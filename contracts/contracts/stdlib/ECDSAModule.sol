// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../abstracts/AbstractModule.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title Signature Module
 * @author Consensys
 * @notice This module can be used by portal creators to
 *         require a signature from an authorized signer
 *         before issuing attestations.
 */
contract ECDSAModule is AbstractModule {
  using ECDSA for bytes32;

  PortalRegistry public portalRegistry;

  mapping(address portal => mapping(address signer => bool authorizedSigners)) public authorizedSigners;

  /// @notice Error thrown when an array length mismatch occurs
  error ArrayLengthMismatch();
  /// @notice Error thrown when a signer is not authorized by the module
  error SignerNotAuthorized();

  /// @notice Event emitted when the authorized signers are set
  event SignersAuthorized(address indexed portal, address[] signers, bool[] authorizationStatus);

  modifier onlyPortalOwner(address portal) {
    if (msg.sender != portalRegistry.getPortalOwner(portal)) revert OnlyPortalOwner();
    _;
  }

  /**
   * @notice Contract constructor sets the portal registry
   */
  constructor(address _portalRegistry) {
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @notice Set the accepted status of schemaIds
   * @param signers The signers to be set
   * @param authorizationStatus The authorization status of signers
   */
  function setAuthorizedSigners(
    address portal,
    address[] memory signers,
    bool[] memory authorizationStatus
  ) public onlyPortalOwner(portal) {
    if (signers.length != authorizationStatus.length) revert ArrayLengthMismatch();

    for (uint256 i = 0; i < signers.length; i++) {
      authorizedSigners[portal][signers[i]] = authorizationStatus[i];
    }

    emit SignersAuthorized(portal, signers, authorizationStatus);
  }

  /**
   * @notice The main method for the module, running the check
   * @param _attestationPayload The Payload of the attestation
   * @param _validationPayload The validation payload required for the module
   */
  function run(
    AttestationPayload memory _attestationPayload,
    bytes memory _validationPayload,
    address /*_txSender*/,
    uint256 /*_value*/
  ) public view override {
    bytes32 messageHash = keccak256(abi.encode(_attestationPayload));
    address messageSigner = messageHash.toEthSignedMessageHash().recover(_validationPayload);
    if (!authorizedSigners[msg.sender][messageSigner]) revert SignerNotAuthorized();
  }
}
