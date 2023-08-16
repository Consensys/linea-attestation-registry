// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Initializable } from "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import { Attestation } from "./types/Structs.sol";
import { PortalRegistry } from "./PortalRegistry.sol";
import { SchemaRegistry } from "./SchemaRegistry.sol";

/**
 * @title Attestation Registry
 * @author Consensys
 * @notice This contract stores a registry of all attestations
 */
contract AttestationRegistry is Initializable {
  PortalRegistry public portalRegistry;
  SchemaRegistry public schemaRegistry;

  mapping(bytes32 attestationId => Attestation attestation) private attestations;

  /// @notice Error thrown when a non-portal tries to call a method that can only be called by a portal
  error OnlyPortal();
  /// @notice Error thrown when an invalid PortalRegistry address is given
  error PortalRegistryInvalid();
  /// @notice Error thrown when an invalid SchemaRegistry address is given
  error SchemaRegistryInvalid();
  /// @notice Error thrown when a portal is not registered in the PortalRegistry
  error PortalNotRegistered();
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
  function attest(Attestation calldata attestation) external onlyPortals(msg.sender) {
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
}
