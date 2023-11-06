// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../abstracts/AbstractModule.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";

/**
 * @title Schema Module
 * @author Consensys
 * @notice This module can be used by portal creators to
 *         enforce a schemaId check before issuing attestations.
 */
contract SchemaModule is AbstractModule {
  PortalRegistry public portalRegistry;

  mapping(address portal => mapping(bytes32 schemaId => bool authorized)) public authorizedSchemaIds;

  /// @notice Error thrown when an array length mismatch occurs
  error ArraylengthMismatch();
  /// @notice Error thrown when a schemaId is not authorized by the module
  error SchemaNotAuthorized();

  modifier onlyPortalOwner(address portal) {
    if (msg.sender != portalRegistry.getPortalByAddress(portal).ownerAddress) revert OnlyPortalOwner();
    _;
  }

  event SchemaIdsSet(address portal, bytes32[] schemaIds, bool[] authorizedStatus);

  /**
   * @notice Contract constructor sets the portal registry
   */
  constructor(address _portalRegistry) {
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @notice Set the authorized status of schemaIds
   * @param schemaIds The schemaIds to be set
   * @param authorizedStatus The authorized status of schemaIds
   */
  function setAuthorizedSchemaIds(
    address portal,
    bytes32[] memory schemaIds,
    bool[] memory authorizedStatus
  ) public onlyPortalOwner(portal) {
    if (schemaIds.length != authorizedStatus.length) revert ArraylengthMismatch();

    for (uint256 i = 0; i < schemaIds.length; i++) {
      authorizedSchemaIds[portal][schemaIds[i]] = authorizedStatus[i];
    }
  }

  /**
   * @notice Checks if the attesatation schemaId is authorized by the module
   * @param _attestationPayload The Payload of the attestation The value sent for the attestation
   */
  function run(
    AttestationPayload memory _attestationPayload,
    bytes memory /*_validationPayload*/,
    address /*_txSender*/,
    uint256 /*_value*/
  ) public view override {
    if (!authorizedSchemaIds[msg.sender][_attestationPayload.schemaId]) revert SchemaNotAuthorized();
  }
}
