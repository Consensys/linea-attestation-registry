// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

contract SchemaRegistryMock {
  mapping(bytes32 id => bool exists) public schemas;

  event SchemaCreated(bytes32 indexed id, string name, string description, string context, string schemaString);

  function test() public {}

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
    schemas[schemaId] = true;
    emit SchemaCreated(schemaId, name, description, context, schemaString);
  }

  function isRegistered(bytes32 schemaId) public view returns (bool) {
    return schemas[schemaId];
  }

  function updateMatchingSchemaIssuers(address oldIssuer, address newIssuer) public {}
}
