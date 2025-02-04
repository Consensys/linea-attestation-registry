// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "../abstracts/AbstractModuleV2.sol";
import { PortalRegistry } from "../PortalRegistry.sol";
import { OperationType } from "../types/Enums.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { IERC1271 } from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title ERC-1271 Module V2
 * @author Consensys
 * @notice This Module can be used by Portal creators to
 *         require an ERC_1271 signature of the attestation payload
 *         from an authorized signer before issuing the attestation.
 * @dev DISCLAIMER: This module doesn't check that a signature can be used only once!
 */
contract ERC1271ModuleV2 is AbstractModuleV2 {
  using ECDSA for bytes32;
  using Address for address;

  PortalRegistry public portalRegistry;

  mapping(address portal => mapping(address signer => bool authorizedSigners)) public authorizedSigners;

  /// @notice Error thrown when an array length mismatch occurs
  error ArrayLengthMismatch();
  /// @notice Error thrown when a signer is not authorized by the module
  error SignerNotAuthorized();
  /// @notice Error thrown when a signature is invalid
  error InvalidSignature();
  /// @notice Error thrown when a signature validation fails
  error FailedValidation();

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
   * @dev The length of `signers` and `authorizationStatus` must be the same
   */
  function setAuthorizedSigners(
    address portal,
    address[] calldata signers,
    bool[] calldata authorizationStatus
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
    AttestationPayload calldata attestationPayload,
    bytes calldata validationPayload,
    address /*initialCaller*/,
    uint256 /*value*/,
    address /*attester*/,
    address portal,
    OperationType /*operationType*/
  ) public view override {
    bytes32 messageHash = keccak256(abi.encode(attestationPayload));
    address messageSigner = messageHash.toEthSignedMessageHash().recover(validationPayload);
    if (!authorizedSigners[portal][messageSigner]) revert SignerNotAuthorized();

    if (messageSigner.isContract()) {
      try IERC1271(messageSigner).isValidSignature(messageHash.toEthSignedMessageHash(), validationPayload) returns (
        bytes4 magicValue
      ) {
        if (magicValue != IERC1271.isValidSignature.selector) revert InvalidSignature();
      } catch {
        revert FailedValidation();
      }
    }
  }
}
