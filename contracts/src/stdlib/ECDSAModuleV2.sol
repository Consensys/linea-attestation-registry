// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "../abstracts/AbstractModuleV2.sol";
import { OperationType } from "../types/Enums.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title ECDSA Module V2
 * @author Consensys
 * @notice This Module can be used by Portal creators to
 *         require a signature of the attestation payload
 *         from an authorized signer before issuing the attestation.
 * @dev DISCLAIMER: This module doesn't check that a signature can be used only once!
 */
contract ECDSAModuleV2 is AbstractModuleV2 {
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
    if (msg.sender != portalRegistry.getPortalByAddress(portal).ownerAddress) revert OnlyPortalOwner();
    _;
  }

  /**
   * @notice Contract constructor sets the portal registry
   */
  constructor(address _portalRegistry) {
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @notice Set the authorized status of signers
   * @param signers The signers to be set
   * @param authorizationStatus The authorization status of signers
   * @dev The length of `signers` and `authorizationStatus` must be the same
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
   * @inheritdoc AbstractModuleV2
   * @param attestationPayload The Payload of the attestation
   * @param validationPayload The validation payload required for the module, in this case the signature of the payload
   * @param portal The Portal issuing the attestation
   * @notice If the signer of the transaction payload is not an expected address, an error is thrown
   */
  function run(
    AttestationPayload memory attestationPayload,
    bytes memory validationPayload,
    address /*initialCaller*/,
    uint256 /*value*/,
    address /*attester*/,
    address portal,
    OperationType /*operationType*/
  ) public view override {
    bytes32 messageHash = keccak256(abi.encode(attestationPayload));
    address messageSigner = messageHash.toEthSignedMessageHash().recover(validationPayload);
    if (!authorizedSigners[portal][messageSigner]) revert SignerNotAuthorized();
  }
}
