// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import { Attestation } from "./types/Structs.sol";
import { PortalRegistry } from "./PortalRegistry.sol";
import { SchemaRegistry } from "./SchemaRegistry.sol";

/**
 * @title Attestation Registry
 * @author Consensys
 * @notice This contract stores a registry of all attestations
 */
contract AttestationRegistry is OwnableUpgradeable {
  PortalRegistry public portalRegistry;
  SchemaRegistry public schemaRegistry;

  mapping(bytes32 attestationId => Attestation attestation) private attestations;

  uint16 private version;

  uint256 public attestationCount;

  /// @notice Error thrown when a non-portal tries to call a method that can only be called by a portal
  error OnlyPortal();
  /// @notice Error thrown when an invalid PortalRegistry address is given
  error PortalRegistryInvalid();
  /// @notice Error thrown when an invalid SchemaRegistry address is given
  error SchemaRegistryInvalid();
  /// @notice Error thrown when a portal is not registered in the PortalRegistry
  error PortalNotRegistered();
  /// @notice Error thrown when an attestation is already registered in the AttestationRegistry
  error AttestationAlreadyAttested();
  /// @notice Error thrown when a schema is not registered in the SchemaRegistry
  error SchemaNotRegistered();
  /// @notice Error thrown when an attestation is not registered in the AttestationRegistry
  error AttestationNotAttested();
  /// @notice Error thrown when an attempt is made to revoke an attestation by an entity other than the attesting portal
  error OnlyAttestingPortal();
  /// @notice Error thrown when an attempt is made to register an attestation with an empty subject field
  error EmptyAttestationSubjectField();
  /// @notice Error thrown when an attempt is made to register an attestation with an empty data field
  error DataAttestationFieldEmpty();

  /// @notice Event emitted when an attestation is registered
  event AttestationRegistered(Attestation attestation);
  /// @notice Event emitted when an attestation is revoked
  event AttestationRevoked(bytes32 attestationId);

  /// @notice Event emitted when the version number is incremented
  event VersionUpdated(uint16 version);

  /**
   * @notice Checks if the caller is a registered portal
   * @param portal the portal address
   */
  modifier onlyPortals(address portal) {
    bool isPortalRegistered = portalRegistry.isRegistered(portal);
    if (!isPortalRegistered) revert OnlyPortal();
    _;
  }

  /**
   * @notice Contract initialization
   */
  function initialize(address _portalRegistry, address _schemaRegistry) public initializer {
    __Ownable_init();
    if (_portalRegistry == address(0)) revert PortalRegistryInvalid();
    if (_schemaRegistry == address(0)) revert SchemaRegistryInvalid();
    portalRegistry = PortalRegistry(_portalRegistry);
    schemaRegistry = SchemaRegistry(_schemaRegistry);
  }

  /**
   * @notice Registers an attestation to the AttestationRegistry
   * @param attestation the attestation to register
   * @dev This method is only callable by a registered Portal
   */
  function attest(Attestation memory attestation) external onlyPortals(msg.sender) {
    if (isRegistered(attestation.attestationId)) revert AttestationAlreadyAttested();

    /*
    // verify the schema id exists
    if (!schemaRegistry.isRegistered(attestation.schemaId)) revert SchemaNotRegistered();

    // the subject field is not blank (or is of minimum length - 8 bytes?)
    if (attestation.subject.length == 0) revert EmptyAttestationSubjectField();

    // the attestationData field is not blank
    if (attestation.attestationData.length == 0) revert DataAttestationFieldEmpty();

    // the version is set to the current version of the registry
    attestation.version = version;

    // the attester field is set to tx.origin
    attestation.attester = tx.origin;

    // the portalId is set to the msg.sender
    attestation.portal = msg.sender;

    // the attestationId is created deterministically (e.g. auto-increment, or keccak hash)
    attestation.attestationId = bytes32(++attestationCount);

    // the attestedDate field is set to the current date
    attestation.attestedDate = block.timestamp;

    // the revoked field is uninitialized
    attestation.revoked = false;

    // record attestation in state
    */

    attestations[attestation.attestationId] = attestation;
    emit AttestationRegistered(attestation);
  }

  /**
   * @notice Revokes an attestation of given identifier
   * @param attestationId the attestation identifier
   */
  function revoke(bytes32 attestationId) external {
    if (!isRegistered(attestationId)) revert AttestationNotAttested();
    if (msg.sender != attestations[attestationId].portal) revert OnlyAttestingPortal();

    attestations[attestationId].revoked = true;

    emit AttestationRevoked(attestationId);
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
   * @notice Gets an attestation by its identifier
   * @param attestationId the attestation identifier
   * @return the attestation
   */
  function getAttestation(bytes32 attestationId) public view returns (Attestation memory) {
    if (!isRegistered(attestationId)) revert AttestationNotAttested();
    return attestations[attestationId];
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
}
