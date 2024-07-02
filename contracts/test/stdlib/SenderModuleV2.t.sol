// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { SenderModuleV2, AbstractModuleV2 } from "../../src/stdlib/SenderModuleV2.sol";
import { OperationType } from "../../src/types/Enums.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";

contract SenderModuleV2Test is Test {
  SenderModuleV2 private senderModule;
  AttestationPayload private attestationPayload;
  PortalRegistryMock private portalRegistry;

  address private portalOwner = makeAddr("portalOwner");
  address private authorizedSender = makeAddr("user1");
  address private notAuthorizedSender = makeAddr("user2");
  address private portal = makeAddr("portal");

  address[] private senders;
  bool[] private authorizedStatus;

  function setUp() public {
    vm.startPrank(portalOwner);

    portalRegistry = new PortalRegistryMock();
    senderModule = new SenderModuleV2(address(portalRegistry));

    attestationPayload = AttestationPayload(bytes32("schema1"), 0, new bytes(0), new bytes(0));

    portalRegistry.register(address(portal), "portal", "portal", false, "portal");

    senders = new address[](2);
    senders[0] = authorizedSender;
    senders[1] = notAuthorizedSender;

    authorizedStatus = new bool[](2);
    authorizedStatus[0] = true;
    authorizedStatus[1] = false;

    vm.stopPrank();
  }

  function test_setAuthorizedSenders() public {
    vm.prank(portalOwner);
    senderModule.setAuthorizedSenders(portal, senders, authorizedStatus);
    assertTrue(senderModule.authorizedSenders(portal, authorizedSender));
    assertFalse(senderModule.authorizedSenders(portal, notAuthorizedSender));
  }

  function test_setAuthorizedSenders_ArrayLengthMismatch() public {
    bool[] memory wrongLengthStatus = new bool[](1);
    vm.prank(portalOwner);
    vm.expectRevert(SenderModuleV2.ArrayLengthMismatch.selector);
    senderModule.setAuthorizedSenders(portal, senders, wrongLengthStatus);
  }

  function test_setAuthorizedSenders_OnlyPortalOwner() public {
    vm.startPrank(makeAddr("not portal owner"));
    vm.expectRevert(AbstractModuleV2.OnlyPortalOwner.selector);
    senderModule.setAuthorizedSenders(portal, senders, authorizedStatus);
    vm.stopPrank();
  }

  function test_run() public {
    vm.prank(portalOwner);
    senderModule.setAuthorizedSenders(portal, senders, authorizedStatus);
    senderModule.run(
      attestationPayload,
      abi.encode(address(portal)),
      authorizedSender,
      0,
      address(makeAddr("attester")),
      address(portal),
      OperationType.Attest
    );
  }

  function test_run_UnauthorizedSender() public {
    vm.prank(portalOwner);
    senderModule.setAuthorizedSenders(portal, senders, authorizedStatus);
    vm.expectRevert(SenderModuleV2.UnauthorizedSender.selector);
    senderModule.run(
      attestationPayload,
      abi.encode(address(portal)),
      notAuthorizedSender,
      0,
      address(makeAddr("attester")),
      address(portal),
      OperationType.Attest
    );
  }
}
