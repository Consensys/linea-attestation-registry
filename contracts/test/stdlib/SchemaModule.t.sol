// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { SchemaModule, AbstractModule } from "../../src/stdlib/SchemaModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";

contract SchemaModuleTest is Test {
  SchemaModule private schemaModule;
  AttestationPayload private attestationPayload;
  PortalRegistryMock private portalRegistry;

  address private portalOwner = makeAddr("portalOwner");
  address private user = makeAddr("user");
  address private portal = makeAddr("portal");

  bytes32[] private schemaIds;
  bool[] private authorizedStatus;

  function setUp() public {
    vm.startPrank(user);
    // Initialize your FeeModule and AttestationPayload here
    portalRegistry = new PortalRegistryMock();
    schemaModule = new SchemaModule(address(portalRegistry));

    attestationPayload = AttestationPayload(bytes32("schema1"), 0, new bytes(0), new bytes(0));

    // register portal
    portalRegistry.register(address(portal), "portal", "portal", false, "portal");

    schemaIds = new bytes32[](2);
    schemaIds[0] = bytes32("schema1");
    schemaIds[1] = bytes32("schema2");

    authorizedStatus = new bool[](2);
    authorizedStatus[0] = true;
    authorizedStatus[1] = false;
    vm.stopPrank();
  }

  function test_setAuthorizedSchemaIds() public {
    vm.prank(user);
    schemaModule.setAuthorizedSchemaIds(portal, schemaIds, authorizedStatus);
    assertTrue(schemaModule.authorizedSchemaIds(portal, schemaIds[0]));
    assertFalse(schemaModule.authorizedSchemaIds(portal, schemaIds[1]));
  }

  function test_setAuthorizedSchemaIds_ArrayLengthMismatch() public {
    vm.prank(user);
    vm.expectRevert(SchemaModule.ArrayLengthMismatch.selector);
    schemaModule.setAuthorizedSchemaIds(portal, new bytes32[](1), new bool[](2));
  }

  function test_setAuthorizedSchemaIds_OnlyPortalOwner() public {
    vm.startPrank(portalOwner);
    vm.expectRevert(AbstractModule.OnlyPortalOwner.selector);
    schemaModule.setAuthorizedSchemaIds(portal, schemaIds, authorizedStatus);
    vm.stopPrank();
  }

  function test_run() public {
    vm.prank(user);
    schemaModule.setAuthorizedSchemaIds(portal, schemaIds, authorizedStatus);
    vm.prank(portal);
    schemaModule.run(attestationPayload, new bytes(0), address(0), 0);
  }

  function test_run_SchemaNotAuthorized() public {
    attestationPayload.schemaId = bytes32("schema3");
    vm.prank(portal);
    vm.expectRevert(SchemaModule.SchemaNotAuthorized.selector);
    schemaModule.run(attestationPayload, new bytes(0), address(0), 0);
  }
}
