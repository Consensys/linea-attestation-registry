// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import { Attestation, AttestationPayload } from "./types/Structs.sol";
import { PortalRegistry } from "./PortalRegistry.sol";
import { SchemaRegistry } from "./SchemaRegistry.sol";
import { IRouter } from "./interface/IRouter.sol";

/**
 * @title Attestation Registry
 * @author Consensys
 * @notice This contract stores a registry of all attestations
 */
contract AttestationRegistry is OwnableUpgradeable {
  IRouter public router;

  uint16 private version;
  uint32 private attestationIdCounter;

  mapping(bytes32 attestationId => Attestation attestation) private attestations;
  mapping(bytes subject => bytes32[] attestationIds) private subjectToAttestations;

  /// @notice Error thrown when a non-portal tries to call a method that can only be called by a portal
  error OnlyPortal();
  /// @notice Error thrown when an invalid Router address is given
  error RouterInvalid();
  /// @notice Error thrown when an attestation is not registered in the AttestationRegistry
  error AttestationNotAttested();
  /// @notice Error thrown when an attempt is made to revoke an attestation by an entity other than the attesting portal
  error OnlyAttestingPortal();
  /// @notice Error thrown when a schema id is not registered
  error SchemaNotRegistered();
  /// @notice Error thrown when an attestation subject is empty
  error AttestationSubjectFieldEmpty();
  /// @notice Error thrown when an attestation data field is empty
  error AttestationDataFieldEmpty();
  /// @notice Error thrown when an attempt is made to bulk replace with mismatched parameter array lengths
  error ArrayLengthMismatch();
  /// @notice Error thrown when an attempt is made to revoke an attestation that was already revoked
  error AlreadyRevoked();
  /// @notice Error thrown when an attempt is made to revoke an attestation based on a non-revocable schema
  error AttestationNotRevocable();

  /// @notice Event emitted when an attestation is registered
  event AttestationRegistered(bytes32 indexed attestationId);
  /// @notice Event emitted when an attestation is replaced
  event AttestationReplaced(bytes32 attestationId, bytes32 replacedBy);
  /// @notice Event emitted when an attestation is revoked
  event AttestationRevoked(bytes32 attestationId);
  /// @notice Event emitted when the version number is incremented
  event VersionUpdated(uint16 version);

  /**
   * @notice Checks if the caller is a registered portal
   * @param portal the portal address
   */
  modifier onlyPortals(address portal) {
    bool isPortalRegistered = PortalRegistry(router.getPortalRegistry()).isRegistered(portal);
    if (!isPortalRegistered) revert OnlyPortal();
    _;
  }

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice Contract initialization
   */
  function initialize() public initializer {
    __Ownable_init();
  }

  /**
   * @notice Changes the address for the Router
   * @dev Only the registry owner can call this method
   */
  function updateRouter(address _router) public onlyOwner {
    if (_router == address(0)) revert RouterInvalid();
    router = IRouter(_router);
  }

  /**
   * @notice Registers an attestation to the AttestationRegistry
   * @param attestationPayload the attestation payload to create attestation and register it
   * @param attester the account address issuing the attestation
   * @dev This method is only callable by a registered Portal
   */
  function attest(AttestationPayload calldata attestationPayload, address attester) public onlyPortals(msg.sender) {
    // Verify the schema id exists
    SchemaRegistry schemaRegistry = SchemaRegistry(router.getSchemaRegistry());
    if (!schemaRegistry.isRegistered(attestationPayload.schemaId)) revert SchemaNotRegistered();
    // Verify the subject field is not blank
    if (attestationPayload.subject.length == 0) revert AttestationSubjectFieldEmpty();
    // Verify the attestationData field is not blank
    if (attestationPayload.attestationData.length == 0) revert AttestationDataFieldEmpty();
    // Auto increment attestation counter
    attestationIdCounter++;
    bytes32 id = bytes32(abi.encode(attestationIdCounter));
    // Create attestation
    attestations[id] = Attestation(
      id,
      attestationPayload.schemaId,
      bytes32(0),
      attester,
      msg.sender,
      uint64(block.timestamp),
      attestationPayload.expirationDate,
      0,
      version,
      false,
      attestationPayload.subject,
      attestationPayload.attestationData
    );
    emit AttestationRegistered(id);
    subjectToAttestations[attestationPayload.subject].push(id);
  }

  /**
   * @notice Registers attestations to the AttestationRegistry
   * @param attestationsPayloads the attestations payloads to create attestations and register them
   */
  function bulkAttest(AttestationPayload[] calldata attestationsPayloads, address attester) public {
    for (uint256 i = 0; i < attestationsPayloads.length; i++) {
      attest(attestationsPayloads[i], attester);
    }
  }

  function massImport(AttestationPayload[] calldata attestationsPayloads, address portal) public onlyOwner {
    for (uint256 i = 0; i < attestationsPayloads.length; i++) {
      // Auto increment attestation counter
      attestationIdCounter++;
      bytes32 id = bytes32(abi.encode(attestationIdCounter));
      // Create attestation
      attestations[id] = Attestation(
        id,
        attestationsPayloads[i].schemaId,
        bytes32(0),
        msg.sender,
        portal,
        uint64(block.timestamp),
        attestationsPayloads[i].expirationDate,
        0,
        version,
        false,
        attestationsPayloads[i].subject,
        attestationsPayloads[i].attestationData
      );
      emit AttestationRegistered(id);
    }
  }

  /**
   * @notice Replaces an attestation for the given identifier and replaces it with a new attestation
   * @param attestationId the ID of the attestation to replace
   * @param attestationPayload the attestation payload to create the new attestation and register it
   * @param attester the account address issuing the attestation
   */
  function replace(bytes32 attestationId, AttestationPayload calldata attestationPayload, address attester) public {
    attest(attestationPayload, attester);
    revoke(attestationId);
    bytes32 replacedBy = bytes32(abi.encode(attestationIdCounter));
    attestations[attestationId].replacedBy = replacedBy;

    emit AttestationReplaced(attestationId, replacedBy);
  }

  /**
   * @notice Replaces attestations for given identifiers and replaces them with new attestations
   * @param attestationIds the list of IDs of the attestations to replace
   * @param attestationPayloads the list of attestation payloads to create the new attestations and register them
   * @param attester the account address issuing the attestation
   */
  function bulkReplace(
    bytes32[] calldata attestationIds,
    AttestationPayload[] calldata attestationPayloads,
    address attester
  ) public {
    if (attestationIds.length != attestationPayloads.length) revert ArrayLengthMismatch();
    for (uint256 i = 0; i < attestationIds.length; i++) {
      replace(attestationIds[i], attestationPayloads[i], attester);
    }
  }

  /**
   * @notice Revokes an attestation for a given identifier
   * @param attestationId the ID of the attestation to revoke
   */
  function revoke(bytes32 attestationId) public {
    if (!isRegistered(attestationId)) revert AttestationNotAttested();
    if (attestations[attestationId].revoked) revert AlreadyRevoked();
    if (msg.sender != attestations[attestationId].portal) revert OnlyAttestingPortal();
    if (!isRevocable(attestations[attestationId].portal)) revert AttestationNotRevocable();

    attestations[attestationId].revoked = true;
    attestations[attestationId].revocationDate = uint64(block.timestamp);

    emit AttestationRevoked(attestationId);
  }

  /**
   * @notice Bulk revokes a list of attestations for the given identifiers
   * @param attestationIds the IDs of the attestations to revoke
   */
  function bulkRevoke(bytes32[] memory attestationIds) external {
    for (uint256 i = 0; i < attestationIds.length; i++) {
      revoke(attestationIds[i]);
    }
  }

  /**
   * @notice Checks if an attestation is registered
   * @param attestationId the attestation identifier
   * @return true if the attestation is registered, false otherwise
   */
  function isRegistered(bytes32 attestationId) public view returns (bool) {
    return attestations[attestationId].attestationId != bytes32(0);
  }

  /**
   * @notice Checks whether a portal issues revocable attestations
   * @param portalId the portal address (ID)
   * @return true if the attestations issued by this portal are revocable, false otherwise
   */
  function isRevocable(address portalId) public view returns (bool) {
    PortalRegistry portalRegistry = PortalRegistry(router.getPortalRegistry());
    return portalRegistry.getPortalByAddress(portalId).isRevocable;
  }

  /**
   * @notice Gets an attestation by its identifier
   * @param attestationId the attestation identifier
   * @return the attestation
   */
  function getAttestation(bytes32 attestationId) public view returns (Attestation memory) {
    if (!isRegistered(attestationId)) revert AttestationNotAttested();
    return attestations[attestationId];
  }

  /**
   * @notice Gets the attestations that issued to a specific subject
   * @param subject the subject identifier
   * @return attestations the attestations issued to a specific subject
   */
  function getAttestationBySubject(bytes memory subject) public view returns (Attestation[] memory) {
    Attestation[] memory attestations = new Attestation[](subjectToAttestations[subject].length);
    for (uint256 i = 0; i < subjectToAttestations[subject].length; i++) {
      bytes32 attestationId = subjectToAttestations[subject][i];
      attestations[i] = getAttestation(attestationId);
    }
    return attestations;
  }

  /**
   * @notice Increments the registry version
   * @return The new version number
   */
  function incrementVersionNumber() public onlyOwner returns (uint16) {
    ++version;
    emit VersionUpdated(version);
    return version;
  }

  /**
   * @notice Gets the registry version
   * @return The current version number
   */
  function getVersionNumber() public view returns (uint16) {
    return version;
  }

  /**
   * @notice Gets the attestation id counter
   * @return The attestationIdCounter
   */
  function getAttestationIdCounter() public view returns (uint32) {
    return attestationIdCounter;
  }

  /**
   * @notice Checks if an address owns a given attestation following ERC-1155
   * @param account The address of the token holder
   * @param id ID of the attestation
   * @return The _owner's balance of the attestations on a given attestation ID
   */
  function balanceOf(address account, uint256 id) public view returns (uint256) {
    bytes32 attestationId = bytes32(abi.encode(id));
    Attestation memory attestation = attestations[attestationId];
    if (attestation.subject.length > 20 && keccak256(attestation.subject) == keccak256(abi.encode(account))) return 1;
    if (attestation.subject.length == 20 && keccak256(attestation.subject) == keccak256(abi.encodePacked(account)))
      return 1;
    return 0;
  }

  /**
   * @notice Get the balance of multiple account/attestation pairs following ERC-1155
   * @param accounts The addresses of the attestation holders
   * @param ids ID of the attestations
   * @return The _owner's balance of the attestation for a given address (i.e. balance for each (owner, id) pair)
   */
  function balanceOfBatch(address[] memory accounts, uint256[] memory ids) public view returns (uint256[] memory) {
    if (accounts.length != ids.length) revert ArrayLengthMismatch();
    uint256[] memory result = new uint256[](accounts.length);
    for (uint256 i = 0; i < accounts.length; i++) {
      result[i] = balanceOf(accounts[i], ids[i]);
    }
    return result;
  }
}
