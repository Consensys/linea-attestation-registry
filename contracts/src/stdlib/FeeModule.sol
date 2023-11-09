// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../abstracts/AbstractModule.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";

/**
 * @title Fee Module
 * @author Consensys
 * @notice This module can be used by portal creators to enforce a fee on attestations.
 */
contract FeeModule is AbstractModule {
  PortalRegistry public portalRegistry;

  mapping(address portal => mapping(bytes32 schemaId => uint256 attestationFee)) public attestationFees;

  /// @notice Error thrown when an array length mismatch occurs
  error ArrayLengthMismatch();
  /// @notice Error thrown when an invalid attestation fee is provided
  error InvalidAttestationFee();

  modifier onlyPortalOwner(address portal) {
    if (msg.sender != portalRegistry.getPortalByAddress(portal).ownerAddress) revert OnlyPortalOwner();
    _;
  }

  event FeesSet(address portal, bytes32[] schemaIds, uint256[] attestationFees);

  /**
   * @notice Contract constructor sets the portal registry
   */
  constructor(address _portalRegistry) {
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @notice Set the fee required to attest
   * @param _attestationFees The fees required to attest
   * @param schemaIds The schemaIds to set the fee for
   */
  function setFees(
    address portal,
    bytes32[] memory schemaIds,
    uint256[] memory _attestationFees
  ) public onlyPortalOwner(portal) {
    if (schemaIds.length != _attestationFees.length) revert ArrayLengthMismatch();

    for (uint256 i = 0; i < schemaIds.length; i++) {
      attestationFees[portal][schemaIds[i]] = _attestationFees[i];
    }

    emit FeesSet(portal, schemaIds, _attestationFees);
  }

  /**
   * @notice The main method for the module, running the check
   * @param _value The value sent for the attestation
   */
  function run(
    AttestationPayload memory _attestationPayload,
    bytes memory /*_validationPayload*/,
    address /*_txSender*/,
    uint256 _value
  ) public view override {
    uint256 attestationFee = attestationFees[msg.sender][_attestationPayload.schemaId];
    if (_value < attestationFee) revert InvalidAttestationFee();
  }
}
