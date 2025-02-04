// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "../abstracts/AbstractModuleV2.sol";
import { OperationType } from "../types/Enums.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";

/**
 * @title Fee Module V2
 * @author Consensys
 * @notice This module can be used by portal creators to enforce a fee on attestations.
 * @dev This Module checks the fee is sent, but doesn't collect the fee
 */
contract FeeModuleV2 is AbstractModuleV2 {
  PortalRegistry public portalRegistry;

  mapping(address portal => mapping(bytes32 schemaId => uint256 attestationFee)) public attestationFees;

  /// @notice Error thrown when an array length mismatch occurs
  error ArrayLengthMismatch();
  /// @notice Error thrown when an invalid attestation fee is provided
  error InvalidAttestationFee();

  modifier onlyPortalOwner(address portal) {
    if (msg.sender != portalRegistry.getPortalOwner(portal)) revert OnlyPortalOwner();
    _;
  }

  event FeesSet(address portal, bytes32[] schemaIds, uint256[] attestationFees);

  /**
   * @notice Contract constructor sets the Portal Registry
   */
  constructor(address _portalRegistry) {
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @notice Set the fee required to attest for a given Portal and one or multiple Schemas
   * @param portal The Portal targeted by the fees
   * @param schemaIds The Schema IDs to set the fees for
   * @param fees The fees required to attest with the Schemas on the Portal
   * @dev The length of `schemaIds` and `attestationFees` must be the same
   *      Only the Portal owner can call this function to set the fees on his Portal
   */
  function setFees(
    address portal,
    bytes32[] calldata schemaIds,
    uint256[] calldata fees
  ) public onlyPortalOwner(portal) {
    if (schemaIds.length != fees.length) revert ArrayLengthMismatch();

    for (uint256 i = 0; i < schemaIds.length; i++) {
      attestationFees[portal][schemaIds[i]] = fees[i];
    }

    emit FeesSet(portal, schemaIds, fees);
  }

  /**
   * @inheritdoc AbstractModuleV2
   * @param value The value sent for the attestation (= the fee)
   * @param portal The Portal issuing the attestation
   * @notice If the provided fee is not enough, an error is thrown
   */
  function run(
    AttestationPayload calldata attestationPayload,
    bytes calldata /*validationPayload*/,
    address /*initialCaller*/,
    uint256 value,
    address /*attester*/,
    address portal,
    OperationType /*operationType*/
  ) public view override {
    uint256 attestationFee = attestationFees[portal][attestationPayload.schemaId];
    if (value < attestationFee) revert InvalidAttestationFee();
  }
}
