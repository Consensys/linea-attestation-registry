// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { SenderModule, AbstractModule } from "../../src/stdlib/SenderModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";

contract SenderModuleTest is Test {
  SenderModule private senderModule;
  AttestationPayload private attestationPayload;
  PortalRegistryMock private portalRegistry;

  address private portalOwner = makeAddr("portalOwner");
  address private user1 = makeAddr("user1");
  address private user2 = makeAddr("user2");
  address private portal = makeAddr("portal");

  address[] private senders;
  bool[] private authorizedStatus;

  function setUp() public {
    vm.startPrank(user1);

    portalRegistry = new PortalRegistryMock();
    senderModule = new SenderModule(address(portalRegistry));

    attestationPayload = AttestationPayload(bytes32("schema1"), 0, new bytes(0), new bytes(0));

    portalRegistry.register(address(portal), "portal", "portal", false, "portal");

    senders = new address[](2);
    senders[0] = user1;
    senders[1] = user2;

    authorizedStatus = new bool[](2);
    authorizedStatus[0] = true;
    authorizedStatus[1] = false;

    vm.stopPrank();
  }

  function test_setAuthorizedSenders() public {
    vm.prank(user1);
    senderModule.setAuthorizedSenders(portal, senders, authorizedStatus);
    assertTrue(senderModule.authorizedSenders(portal, user1));
    assertFalse(senderModule.authorizedSenders(portal, user2));
  }

  function test_setAuthorizedSenders_ArrayLengthMismatch() public {
    bool[] memory wrongLengthStatus = new bool[](1);
    vm.prank(user1);
    vm.expectRevert(SenderModule.ArrayLengthMismatch.selector);
    senderModule.setAuthorizedSenders(portal, senders, wrongLengthStatus);
  }

  function test_setAuthorizedSenders_OnlyPortalOwner() public {
    vm.startPrank(user2);
    vm.expectRevert(AbstractModule.OnlyPortalOwner.selector);
    senderModule.setAuthorizedSenders(portal, senders, authorizedStatus);
    vm.stopPrank();
  }

  function test_run() public {
    vm.startPrank(user1, user1);
    senderModule.setAuthorizedSenders(portal, senders, authorizedStatus);
    senderModule.run(attestationPayload, "", portal, 0);
    vm.stopPrank();
  }

  function test_run_UnauthorizedSender() public {
    vm.startPrank(portal);
    vm.expectRevert(SenderModule.UnauthorizedSender.selector);
    senderModule.run(attestationPayload, "", user2, 0);
    vm.stopPrank();
  }
}
