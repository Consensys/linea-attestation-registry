// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { Schema } from "./types/Structs.sol";
import { PortalRegistry } from "./PortalRegistry.sol";
import { IRouter } from "./interfaces/IRouter.sol";
import { uncheckedInc256 } from "./Common.sol";

/**
 * @title Schema Registry
 * @author Consensys
 * @notice This contract aims to manage the Schemas used by the Portals, including their discoverability
 */
contract SchemaRegistry is OwnableUpgradeable {
  IRouter public router;
  /// @dev The list of Schemas, accessed by their ID
  mapping(bytes32 id => Schema schema) private schemas;
  /**
   * @dev [DEPRECATED] This field is no longer used or updated.
   * It previously stored the list of Schema IDs, but its functionality has been deprecated.
   * While this variable cannot be removed due to storage layout constraints in upgradeable contracts,
   * it should not be relied upon as it no longer serves any purpose.
   */
  bytes32[] private schemaIds;
  /// @dev Associates a Schema ID with the address of the Issuer who created it
  mapping(bytes32 id => address issuer) private schemasIssuers;

  /// @notice Error thrown when attempting to set a schema issuer that is already set
  error SchemaIssuerAlreadySet();
  /// @notice Error thrown when the schema context remains unchanged
  error SchemaContextAlreadyUpdated();
  /// @notice Error thrown when a non-allowlisted user tries to call a forbidden method
  error OnlyAllowlisted();
  /// @notice Error thrown when a non-assigned issuer tries to call a method that can only be called by an assigned issuer
  error OnlyAssignedIssuer();
  /// @notice Error thrown when an invalid Issuer address is given
  error IssuerInvalid();
  /// @notice Error thrown when an identical Schema was already registered
  error SchemaAlreadyExists();
  /// @notice Error thrown when attempting to add a Schema without a name
  error SchemaNameMissing();
  /// @notice Error thrown when attempting to add a Schema without a string to define it
  error SchemaStringMissing();
  /// @notice Error thrown when attempting to get a Schema that is not registered
  error SchemaNotRegistered();
  /// @notice Error thrown when the router address is the zero address
  error RouterAddressInvalid();

  /// @notice Event emitted when a Schema is created and registered
  event SchemaCreated(bytes32 indexed id, string name, string description, string context, string schemaString);
  /// @notice Event emitted when a Schema context is updated
  event SchemaContextUpdated(bytes32 indexed id);
  /// @notice Event emitted when the schema issuer is updated
  event SchemaIssuerUpdated(bytes32 schemaId, address schemaIssuerAddress);
  /// @notice Event emitted when the router address is set
  event RouterSet(address router);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice Contract initialization
   * @param _router the address of the Router contract
   */
  function initialize(address _router) public initializer {
    __Ownable_init();
    if (_router == address(0)) revert RouterAddressInvalid();
    router = IRouter(_router);
    emit RouterSet(_router);
  }

  /**
   * @notice Checks if the caller is allowlisted.
   * @param user the user address
   */
  modifier onlyAllowlisted(address user) {
    if (!PortalRegistry(router.getPortalRegistry()).isAllowlisted(user)) revert OnlyAllowlisted();
    _;
  }

  /**
   * @notice Updates a given Schema's Issuer
   * @param schemaId the Schema's ID
   * @param issuer the address of the issuer who created the given Schema
   * @dev Updates issuer for the given schemaId in the `schemaIssuers` mapping
   *      The issuer must already be registered as an Issuer via the `PortalRegistry`
   */
  function updateSchemaIssuer(bytes32 schemaId, address issuer) public onlyOwner {
    if (!isRegistered(schemaId)) revert SchemaNotRegistered();
    if (issuer == address(0)) revert IssuerInvalid();
    if (schemasIssuers[schemaId] == issuer) revert SchemaIssuerAlreadySet();

    schemasIssuers[schemaId] = issuer;
    emit SchemaIssuerUpdated(schemaId, issuer);
  }

  /**
   * @notice Updates issuers of all given schemaIds with the new issuer
   * @param schemaIdsToUpdate the IDs of schemas to update
   * @param issuer the address of new issuer
   * @dev Updates issuer for the given schemaIds in the `schemaIssuers` mapping
   *      The issuer must already be registered as an Issuer via the `PortalRegistry`
   */
  function bulkUpdateSchemasIssuers(bytes32[] calldata schemaIdsToUpdate, address issuer) public onlyOwner {
    for (uint256 i = 0; i < schemaIdsToUpdate.length; i = uncheckedInc256(i)) {
      updateSchemaIssuer(schemaIdsToUpdate[i], issuer);
    }
  }

  /**
   * Generate an ID for a given schema
   * @param schema the string defining a schema
   * @return the schema ID
   * @dev encodes a schema string to unique bytes
   */
  function getIdFromSchemaString(string calldata schema) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(schema));
  }

  /**
   * @notice Creates a Schema, with its metadata and runs some checks:
   * - mandatory name
   * - mandatory string defining the schema
   * - the Schema must be unique
   * @param name the Schema name
   * @param description the Schema description
   * @param context the Schema context
   * @param schemaString the string defining a Schema
   * @dev The Schema is stored in the `schemas` mapping, its ID is added to an array of IDs and an event is emitted
   *      The caller is assigned as the creator of the Schema, via the `schemasIssuers` mapping
   */
  function createSchema(
    string calldata name,
    string calldata description,
    string calldata context,
    string calldata schemaString
  ) public onlyAllowlisted(msg.sender) {
    if (bytes(name).length == 0) revert SchemaNameMissing();
    if (bytes(schemaString).length == 0) revert SchemaStringMissing();

    bytes32 schemaId = getIdFromSchemaString(schemaString);

    if (isRegistered(schemaId)) {
      revert SchemaAlreadyExists();
    }

    schemas[schemaId] = Schema(name, description, context, schemaString);
    schemasIssuers[schemaId] = msg.sender;
    emit SchemaCreated(schemaId, name, description, context, schemaString);
  }

  /**
   * @notice Updates the context of a given schema
   * @param schemaId the schema ID
   * @param context the Schema context
   * @dev Retrieve the Schema with given ID and update its context with new value and an event is emitted
   *      The caller must be the creator of the given Schema (through the `schemaIssuers` mapping)
   */
  function updateContext(bytes32 schemaId, string calldata context) public {
    if (!isRegistered(schemaId)) revert SchemaNotRegistered();
    if (schemasIssuers[schemaId] != msg.sender) revert OnlyAssignedIssuer();
    if (keccak256(abi.encodePacked(schemas[schemaId].context)) == keccak256(abi.encodePacked(context))) {
      revert SchemaContextAlreadyUpdated();
    }

    schemas[schemaId].context = context;
    emit SchemaContextUpdated(schemaId);
  }

  /**
   * @notice Gets a schema by its identifier
   * @param schemaId the schema ID
   * @return the schema
   */
  function getSchema(bytes32 schemaId) public view returns (Schema memory) {
    if (!isRegistered(schemaId)) revert SchemaNotRegistered();
    return schemas[schemaId];
  }

  /**
   * @notice Check if a Schema is registered
   * @param schemaId The ID of the Schema
   * @return True if the Schema is registered, false otherwise
   */
  function isRegistered(bytes32 schemaId) public view returns (bool) {
    return bytes(schemas[schemaId].name).length > 0;
  }
}
