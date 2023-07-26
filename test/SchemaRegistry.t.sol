// SPDX-License-Identifier: UNLICENSED
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

  event SchemaCreated(bytes32 id, string name, string description, string context);

  function setUp() public {
    schemaRegistry = new SchemaRegistry();
  }

  function testGetIdFromSchemaString() public {
    bytes32 id = schemaRegistry.getIdFromSchemaString(expectedString);
    assertEq(id, expectedId);
  }

  function testCreateSchema() public {
    assertEq(schemaRegistry.numberOfSchemas(), 0);

    vm.expectEmit();
    emit SchemaCreated(expectedId, expectedName, expectedDescription, expectedContext);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    assertEq(schemaRegistry.numberOfSchemas(), 1);

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
}
