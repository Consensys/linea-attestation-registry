// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import { Attestation } from "./types/Structs.sol";
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

  mapping(bytes32 attestationId => Attestation attestation) private attestations;

  uint16 private version;

  /// @notice Error thrown when a non-portal tries to call a method that can only be called by a portal
  error OnlyPortal();
  /// @notice Error thrown when an invalid Router address is given
  error RouterInvalid();
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
   */
  function updateRouter(address _router) public onlyOwner {
    if (_router == address(0)) revert RouterInvalid();
    router = IRouter(_router);
  }

  /**
   * @notice Registers an attestation to the AttestationRegistry
   * @param attestation the attestation to register
   * @dev This method is only callable by a registered Portal
   */
  function attest(Attestation calldata attestation) external onlyPortals(msg.sender) {
    if (isRegistered(attestation.attestationId)) revert AttestationAlreadyAttested();
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
