// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { FeeModuleV2, AbstractModuleV2 } from "../../src/stdlib/FeeModuleV2.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";

contract FeeModuleV2Test is Test {
  FeeModuleV2 private feeModule;
  PortalRegistryMock private portalRegistry;
  AttestationPayload private attestationPayload;

  address private portal = makeAddr("portal");
  address private user1 = makeAddr("user1");
  address private user2 = makeAddr("user2");

  bytes32[] private schemaIds;
  uint256[] private attestationFees;

  event FeesSet(address portal, bytes32[] schemaIds, uint256[] attestationFees);

  function setUp() public {
    vm.startPrank(user1);
    // Initialize your FeeModule and AttestationPayload here
    portalRegistry = new PortalRegistryMock();
    feeModule = new FeeModuleV2(address(portalRegistry));

    // register portal
    portalRegistry.register(address(portal), "portal", "portal", false, "portal");

    schemaIds = new bytes32[](2);
    schemaIds[0] = bytes32("schema1");
    schemaIds[1] = bytes32("schema2");

    attestationFees = new uint256[](2);
    attestationFees[0] = 1;
    attestationFees[1] = 2;
  }

  function test_setFees() public {
    vm.expectEmit({ emitter: address(feeModule) });
    emit FeesSet(portal, schemaIds, attestationFees);
    feeModule.setFees(portal, schemaIds, attestationFees);
  }

  function test_setFees_ArrayLengthMismatch() public {
    vm.expectRevert(FeeModuleV2.ArrayLengthMismatch.selector);
    feeModule.setFees(portal, new bytes32[](1), new uint256[](2));
  }

  function test_setFees_OnlyPortalOwner() public {
    vm.startPrank(user2);
    vm.expectRevert(AbstractModuleV2.OnlyPortalOwner.selector);
    feeModule.setFees(portal, schemaIds, attestationFees);
    vm.stopPrank();
  }

  function test_run_TwoPortals() public {
    address portal2 = makeAddr("portal2");
    vm.startPrank(user2);
    portalRegistry.register(address(portal2), "portal2", "portal2", false, "portal2");

    // Set fees for both portals
    vm.startPrank(user1);
    feeModule.setFees(portal, schemaIds, attestationFees);
    vm.startPrank(user2);
    feeModule.setFees(portal2, schemaIds, attestationFees);
    vm.stopPrank();

    // Test with sufficient fees
    vm.startPrank(portal);
    AttestationPayload memory attestationPayload1 = AttestationPayload(schemaIds[0], 0, new bytes(0), new bytes(0));
    feeModule.run(attestationPayload1, new bytes(0), user1, attestationFees[0], address(makeAddr("attester")), portal);

    // Test with insufficient fees
    vm.startPrank(portal2);
    AttestationPayload memory attestationPayload2 = AttestationPayload(schemaIds[1], 0, new bytes(0), new bytes(0));
    vm.expectRevert(FeeModuleV2.InvalidAttestationFee.selector);
    feeModule.run(attestationPayload2, new bytes(0), user1, 0, address(makeAddr("attester")), portal);
  }

  function test_run_InvalidAttestationFee() public {
    feeModule.setFees(portal, schemaIds, attestationFees);
    AttestationPayload memory payload = AttestationPayload(schemaIds[0], 0, new bytes(0), new bytes(0));
    vm.expectRevert(FeeModuleV2.InvalidAttestationFee.selector);
    vm.startPrank(portal);
    feeModule.run(payload, new bytes(0), user1, 0, address(makeAddr("attester")), portal);
  }
}
