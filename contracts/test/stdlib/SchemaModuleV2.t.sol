// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { SchemaModuleV2, AbstractModuleV2 } from "../../src/stdlib/SchemaModuleV2.sol";
import { OperationType } from "../../src/types/Enums.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";

contract SchemaModuleV2Test is Test {
  SchemaModuleV2 private schemaModule;
  AttestationPayload private attestationPayload;
  PortalRegistryMock private portalRegistry;

  address private portalOwner = makeAddr("portalOwner");
  address private portal = makeAddr("portal");

  bytes32[] private schemaIds;
  bool[] private authorizedStatus;

  function setUp() public {
    vm.startPrank(portalOwner);

    portalRegistry = new PortalRegistryMock();
    schemaModule = new SchemaModuleV2(address(portalRegistry));

    attestationPayload = AttestationPayload(bytes32("schema1"), 0, new bytes(0), new bytes(0));

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
    vm.prank(portalOwner);
    schemaModule.setAuthorizedSchemaIds(portal, schemaIds, authorizedStatus);
    assertTrue(schemaModule.authorizedSchemaIds(portal, schemaIds[0]));
    assertFalse(schemaModule.authorizedSchemaIds(portal, schemaIds[1]));
  }

  function test_setAuthorizedSchemaIds_ArrayLengthMismatch() public {
    vm.prank(portalOwner);
    vm.expectRevert(SchemaModuleV2.ArrayLengthMismatch.selector);
    schemaModule.setAuthorizedSchemaIds(portal, new bytes32[](1), new bool[](2));
  }

  function test_setAuthorizedSchemaIds_OnlyPortalOwner() public {
    vm.startPrank(makeAddr("not portal owner"));
    vm.expectRevert(AbstractModuleV2.OnlyPortalOwner.selector);
    schemaModule.setAuthorizedSchemaIds(portal, schemaIds, authorizedStatus);
    vm.stopPrank();
  }

  function test_run() public {
    vm.prank(portalOwner);
    schemaModule.setAuthorizedSchemaIds(portal, schemaIds, authorizedStatus);
    schemaModule.run(
      attestationPayload,
      new bytes(0),
      address(makeAddr("initialCaller")),
      0,
      address(makeAddr("attester")),
      portal,
      OperationType.Attest
    );
  }

  function test_run_SchemaNotAuthorized() public {
    attestationPayload.schemaId = bytes32("schema3");
    vm.expectRevert(SchemaModuleV2.SchemaNotAuthorized.selector);
    schemaModule.run(
      attestationPayload,
      new bytes(0),
      address(makeAddr("initialCaller")),
      0,
      address(makeAddr("attester")),
      portal,
      OperationType.Attest
    );
  }
}
