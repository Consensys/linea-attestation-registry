// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

contract SchemaRegistryMock {
  event SchemaCreated(bytes32 indexed id, string name, string description, string context, string schemaString);

  function getIdFromSchemaString(string memory schema) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(schema));
  }

  function createSchema(
    string memory name,
    string memory description,
    string memory context,
    string memory schemaString
  ) public {
    bytes32 schemaId = getIdFromSchemaString(schemaString);
    emit SchemaCreated(schemaId, name, description, context, schemaString);
  }

  function isRegistered(bytes32 /*schemaId*/) public pure returns (bool) {
    return true;
  }
}
