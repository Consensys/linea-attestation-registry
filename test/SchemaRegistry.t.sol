// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { SchemaRegistry } from "../src/SchemaRegistry.sol";

contract SchemaRegistryTest is Test {
  SchemaRegistry private schemaRegistry;
  bytes32 private expectedId = 0x36304af55bbea73214675d3770f679b4b6e0bfff512f5af01046e6f5d29261e3;
  string private expectedName = "Name";
  string private expectedDescription = "Description";
  string private expectedContext = "Context";
  string private expectedString = "this is a schema";

  event SchemaCreated(bytes32 indexed id, string name, string description, string context, string schemaString);
  event Initialized(uint8 version);

  function setUp() public {
    schemaRegistry = new SchemaRegistry();
  }

  function testInitialize() public {
    vm.expectEmit();
    emit Initialized(1);
    schemaRegistry.initialize();
  }

  function testGetIdFromSchemaString() public {
    bytes32 id = schemaRegistry.getIdFromSchemaString(expectedString);
    assertEq(id, expectedId);
  }

  function testCreateSchema() public {
    vm.expectEmit();
    emit SchemaCreated(expectedId, expectedName, expectedDescription, expectedContext, expectedString);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);

    (string memory name, string memory description, string memory context, string memory schemaString) = schemaRegistry
      .schemas(expectedId);
    assertEq(name, expectedName);
    assertEq(description, expectedDescription);
    assertEq(context, expectedContext);
    assertEq(schemaString, expectedString);
  }

  function testCannotCreateSchemaWithoutName() public {
    vm.expectRevert(SchemaRegistry.SchemaNameMissing.selector);
    schemaRegistry.createSchema("", expectedDescription, expectedContext, expectedString);
  }

  function testCannotCreateSchemaWithoutString() public {
    vm.expectRevert(SchemaRegistry.SchemaStringMissing.selector);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, "");
  }

  function testCannotCreateSchemaTwice() public {
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    vm.expectRevert(SchemaRegistry.SchemaAlreadyExists.selector);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
  }

  function testStoreSchemaId() public {
    uint256 schemasNumber = schemaRegistry.getSchemasNumber();
    assertEq(schemasNumber, 0);

    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);

    schemasNumber = schemaRegistry.getSchemasNumber();
    assertEq(schemasNumber, 1);
  }

  function testGetSchemaId() public {
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);

    bytes32 schemaId = schemaRegistry.schemaIds(0);
    assertEq(schemaId, expectedId);
  }

  function testIsSchemaRegistered() public {
    bool isRegistered = schemaRegistry.isRegistered(expectedId);
    assertFalse(isRegistered);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    isRegistered = schemaRegistry.isRegistered(expectedId);
    assertTrue(isRegistered);
  }
}
