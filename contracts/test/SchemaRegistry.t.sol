// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { SchemaRegistry } from "../src/SchemaRegistry.sol";
import { PortalRegistryMock } from "./mocks/PortalRegistryMock.sol";
import { Schema } from "../src/types/Structs.sol";
import { Router } from "../src/Router.sol";

contract SchemaRegistryTest is Test {
  SchemaRegistry private schemaRegistry;
  Router public router;
  address public portalRegistryAddress;
  bytes32 private expectedId = 0x36304af55bbea73214675d3770f679b4b6e0bfff512f5af01046e6f5d29261e3;
  string private expectedName = "Name";
  string private expectedDescription = "Description";
  string private expectedContext = "Context";
  string private expectedString = "this is a schema";
  address private user = makeAddr("user");
  address private unassignedUser = makeAddr("unassignedUser");

  event SchemaCreated(bytes32 indexed id, string name, string description, string context, string schemaString);
  event Initialized(uint8 version);

  function setUp() public {
    router = new Router();
    router.initialize();
    schemaRegistry = new SchemaRegistry();
    router.updateSchemaRegistry(address(schemaRegistry));
    vm.prank(address(0));
    schemaRegistry.updateRouter(address(router));
    PortalRegistryMock portalRegistryMock = new PortalRegistryMock();
    portalRegistryAddress = address(portalRegistryMock);
    router.updatePortalRegistry(portalRegistryAddress);
    portalRegistryMock.setIssuer(user);
    portalRegistryMock.setIssuer(unassignedUser);
  }

  function test_initialize_ContractAlreadyInitialized() public {
    vm.expectRevert("Initializable: contract is already initialized");
    schemaRegistry.initialize();
  }

  function test_updateRouter() public {
    SchemaRegistry testSchemaRegistry = new SchemaRegistry();

    vm.prank(address(0));
    testSchemaRegistry.updateRouter(address(1));
    address routerAddress = address(testSchemaRegistry.router());
    assertEq(routerAddress, address(1));
  }

  function test_updateRouter_RouterInvalid() public {
    SchemaRegistry testSchemaRegistry = new SchemaRegistry();

    vm.expectRevert(SchemaRegistry.RouterInvalid.selector);
    vm.prank(address(0));
    testSchemaRegistry.updateRouter(address(0));
  }

  function test_updateSchemaIssuer() public {
    vm.prank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    vm.prank(address(0));
    schemaRegistry.updateSchemaIssuer(expectedId, address(2));
  }

  function test_updateSchemaIssuer_SchemaNotRegistered() public {
    vm.expectRevert(SchemaRegistry.SchemaNotRegistered.selector);
    vm.prank(address(0));
    schemaRegistry.updateSchemaIssuer(expectedId, address(0));
  }

  function test_updateSchemaIssuer_IssuerInvalid() public {
    vm.prank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    vm.prank(address(0));
    vm.expectRevert(SchemaRegistry.IssuerInvalid.selector);
    schemaRegistry.updateSchemaIssuer(expectedId, address(0));
  }

  function test_updateMatchingSchemaIssuers() public {
    vm.prank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    vm.prank(portalRegistryAddress);
    schemaRegistry.updateMatchingSchemaIssuers(user, address(2));
  }

  function test_updateMatchingSchemaIssuers_OnlyPortalRegistry() public {
    vm.prank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    vm.prank(address(0));
    vm.expectRevert(SchemaRegistry.OnlyPortalRegistry.selector);
    schemaRegistry.updateMatchingSchemaIssuers(user, address(2));
  }

  function test_getIdFromSchemaString() public {
    bytes32 id = schemaRegistry.getIdFromSchemaString(expectedString);
    assertEq(id, expectedId);
  }

  function test_createSchema() public {
    vm.expectEmit();
    emit SchemaCreated(expectedId, expectedName, expectedDescription, expectedContext, expectedString);
    vm.startPrank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);

    Schema memory expectedSchema = Schema(expectedName, expectedDescription, expectedContext, expectedString);

    Schema memory registeredSchema = schemaRegistry.getSchema(expectedId);
    _assertSchema(registeredSchema, expectedSchema);
    vm.stopPrank();
  }

  function test_createSchema_OnlyIssuer() public {
    vm.expectRevert(SchemaRegistry.OnlyIssuer.selector);
    vm.startPrank(makeAddr("InvalidIssuer"));
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    vm.stopPrank();
  }

  function test_createSchema_SchemaNameMissing() public {
    vm.expectRevert(SchemaRegistry.SchemaNameMissing.selector);
    vm.prank(user);
    schemaRegistry.createSchema("", expectedDescription, expectedContext, expectedString);
  }

  function test_createSchema_SchemaStringMissing() public {
    vm.expectRevert(SchemaRegistry.SchemaStringMissing.selector);
    vm.prank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, "");
  }

  function test_createSchema_SchemaAlreadyExists() public {
    vm.startPrank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    vm.expectRevert(SchemaRegistry.SchemaAlreadyExists.selector);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    vm.stopPrank();
  }

  function test_updateContext() public {
    vm.expectEmit();
    emit SchemaCreated(expectedId, expectedName, expectedDescription, expectedContext, expectedString);
    vm.startPrank(user);

    // create a schema
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    assertEq(schemaRegistry.getSchema(expectedId).context, expectedContext);

    // update the context
    string memory newContext = "New context";
    schemaRegistry.updateContext(expectedId, newContext);
    assertEq(schemaRegistry.getSchema(expectedId).context, newContext);

    vm.stopPrank();
  }

  function test_updateContext_SchemaNotRegistered() public {
    vm.startPrank(user);
    vm.expectRevert(SchemaRegistry.SchemaNotRegistered.selector);
    schemaRegistry.updateContext("Invalid ID", "New context");
    vm.stopPrank();
  }

  function test_updateContext_OnlyAssignedIssuer() public {
    vm.startPrank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    vm.expectRevert(SchemaRegistry.OnlyAssignedIssuer.selector);
    vm.startPrank(unassignedUser);
    schemaRegistry.updateContext(expectedId, "New context");
    vm.stopPrank();
  }

  function test_updateContext_withEmptyContext() public {
    vm.startPrank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    schemaRegistry.updateContext(expectedId, "");
    assertEq(schemaRegistry.getSchema(expectedId).context, "");
    vm.stopPrank();
  }

  function test_getSchema() public {
    vm.startPrank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);

    Schema memory expectedSchema = Schema(expectedName, expectedDescription, expectedContext, expectedString);

    Schema memory registeredSchema = schemaRegistry.getSchema(expectedId);
    _assertSchema(registeredSchema, expectedSchema);
    vm.stopPrank();
  }

  function test_getSchema_SchemaNotRegistered() public {
    vm.expectRevert(SchemaRegistry.SchemaNotRegistered.selector);
    schemaRegistry.getSchema(bytes32("not registered"));
  }

  function test_getSchemasNumber() public {
    uint256 schemasNumber = schemaRegistry.getSchemasNumber();
    assertEq(schemasNumber, 0);
    vm.startPrank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);

    schemasNumber = schemaRegistry.getSchemasNumber();
    assertEq(schemasNumber, 1);
    vm.stopPrank();
  }

  function test_getSchemaIds() public {
    vm.startPrank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);

    bytes32 schemaId = schemaRegistry.schemaIds(0);
    assertEq(schemaId, expectedId);
    vm.stopPrank();
  }

  function test_isRegistered() public {
    bool isRegistered = schemaRegistry.isRegistered(expectedId);
    assertFalse(isRegistered);
    vm.startPrank(user);
    schemaRegistry.createSchema(expectedName, expectedDescription, expectedContext, expectedString);
    isRegistered = schemaRegistry.isRegistered(expectedId);
    assertTrue(isRegistered);
    vm.stopPrank();
  }

  function _assertSchema(Schema memory schema1, Schema memory schema2) internal {
    assertEq(schema2.name, schema1.name);
    assertEq(schema2.description, schema1.description);
    assertEq(schema2.context, schema1.context);
    assertEq(schema2.schema, schema1.schema);
  }
}
