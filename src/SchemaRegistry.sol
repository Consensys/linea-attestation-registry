// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Schema } from "./struct/Schema.sol";
import "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";

/**
 * @title Schema Registry
 * @author Consensys
 * @notice This contract aims to manage the Schemas used by the Portals, including their discoverability
 */
contract SchemaRegistry is Initializable {
  /// @dev The contract administrator
  address private admin;
  /// @dev The list of Schemas, accessed by their ID
  mapping(bytes32 id => Schema schema) public schemas;
  /// @dev The number of Schemas already registered
  uint256 public numberOfSchemas = 0;

  /// @notice Error thrown when an identical Schema was already registered
  error SchemaAlreadyExists();
  /// @notice Error thrown when attempting to add a Schema without a name
  error SchemaNameMissing();
  /// @notice Error thrown when attempting to add a Schema without a string to define it
  error SchemaStringMissing();

  /// @notice Event emitted when a Schema is created and registered
  event SchemaCreated(bytes32 id, string name, string description, string context);

  /**
   * @notice Contract initialization
   * @param _admin The administrator of the contract
   */
  function initialize(address _admin) public initializer {
    admin = _admin;
  }

  /**
   * @notice Get the administrator address for this contract
   * @return The contract's administrator address
   */
  function getAdmin() public view returns (address) {
    return admin;
  }

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
   * - the schema must be unique
   * @param name the schema name
   * @param description the schema description
   * @param context the schema context
   * @param schemaString the string defining a schema
   * @dev the schema is stored in a mapping, the number of schemas is incremented and an event is emitted
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
    numberOfSchemas++;
    emit SchemaCreated(schemaId, name, description, context);
  }
}
