// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "../abstracts/AbstractModuleV2.sol";
import { OperationType } from "../types/Enums.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";

/**
 * @title Schema Module V2
 * @author Consensys
 * @notice This module can be used by portal creators to
 *         enforce a schemaId check before issuing attestations.
 */
contract SchemaModuleV2 is AbstractModuleV2 {
  PortalRegistry public portalRegistry;

  mapping(address portal => mapping(bytes32 schemaId => bool authorized)) public authorizedSchemaIds;

  /// @notice Error thrown when an array length mismatch occurs
  error ArrayLengthMismatch();
  /// @notice Error thrown when a schemaId is not authorized by the module
  error SchemaNotAuthorized();

  /// @notice Event emitted when the authorized schemas are set
  event SchemasAuthorized(address indexed portal, bytes32[] schemas, bool[] authorizedStatus);

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
   * @notice Set the authorized status of Schemas
   * @param schemaIds The schema IDs to be set
   * @param authorizedStatus The authorized status of Schemas
   * @dev The length of `schemaIds` and `authorizedStatus` must be the same
   */
  function setAuthorizedSchemaIds(
    address portal,
    bytes32[] memory schemaIds,
    bool[] memory authorizedStatus
  ) public onlyPortalOwner(portal) {
    if (schemaIds.length != authorizedStatus.length) revert ArrayLengthMismatch();

    for (uint256 i = 0; i < schemaIds.length; i++) {
      authorizedSchemaIds[portal][schemaIds[i]] = authorizedStatus[i];
    }

    emit SchemasAuthorized(portal, schemaIds, authorizedStatus);
  }

  /**
   * @inheritdoc AbstractModuleV2
   * @param attestationPayload The incoming attestation data
   * @param portal The Portal issuing the attestation
   * @notice If the Schema used in the attestation payload is not authorized for the Portal, an error is thrown
   */
  function run(
    AttestationPayload memory attestationPayload,
    bytes memory /*_validationPayload*/,
    address /*initialCaller*/,
    uint256 /*value*/,
    address /*attester*/,
    address portal,
    OperationType /*operationType*/
  ) public view override {
    if (!authorizedSchemaIds[portal][attestationPayload.schemaId]) revert SchemaNotAuthorized();
  }
}
