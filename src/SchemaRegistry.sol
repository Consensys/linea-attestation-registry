// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Schema } from "./struct/Schema.sol";
import { Initializable } from "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";

/**
 * @title Schema Registry
 * @author Consensys
 * @notice This contract aims to manage the Schemas used by the Portals, including their discoverability
 */
contract SchemaRegistry is Initializable {
  /// @dev The list of Schemas, accessed by their ID
  mapping(bytes32 id => Schema schema) public schemas;
  /// @dev The list of Schema IDs
  bytes32[] public schemaIds;

  /// @notice Error thrown when an identical Schema was already registered
  error SchemaAlreadyExists();
  /// @notice Error thrown when attempting to add a Schema without a name
  error SchemaNameMissing();
  /// @notice Error thrown when attempting to add a Schema without a string to define it
  error SchemaStringMissing();

  /// @notice Event emitted when a Schema is created and registered
  event SchemaCreated(bytes32 indexed id, string name, string description, string context, string schemaString);

  /**
   * @notice Contract initialization
   */
  function initialize() public initializer {}

  /**
   * Generate an ID for a given schema
   * @param schema the string defining a schema
   * @return the schema ID
   * @dev encodes a schema string to unique bytes
   */
  function getIdFromSchemaString(string memory schema) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(schema));
  }

  /** Create a Schema, with its metadata and run some checks:
   * - mandatory name
   * - mandatory string defining the schema
   * - the Schema must be unique
   * @param name the Schema name
   * @param description the Schema description
   * @param context the Schema context
   * @param schemaString the string defining a Schema
   * @dev the Schema is stored in a mapping, its ID is added to an array of IDs and an event is emitted
   */
  function createSchema(
    string memory name,
    string memory description,
    string memory context,
    string memory schemaString
  ) public {
    if (bytes(name).length == 0) {
      revert SchemaNameMissing();
    }

    if (bytes(schemaString).length == 0) {
      revert SchemaStringMissing();
    }

    bytes32 schemaId = getIdFromSchemaString(schemaString);

    if (bytes(schemas[schemaId].name).length > 0) {
      revert SchemaAlreadyExists();
    }

    schemas[schemaId] = Schema(name, description, context, schemaString);
    schemaIds.push(schemaId);
    emit SchemaCreated(schemaId, name, description, context, schemaString);
  }

  /**
   * @notice Get the number of Schemas managed by the contract
   * @return The number of Schemas already registered
   * @dev Returns the length of the `schemaIds` array
   */
  function getSchemasNumber() public view returns (uint256) {
    return schemaIds.length;
  }
}
