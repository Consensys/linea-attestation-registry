// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { AbstractModule } from "../../src/interface/AbstractModule.sol";
import { MsgSenderModule } from "../../src/example/MsgSenderModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

contract MsgSenderModuleTest is Test {
  MsgSenderModule private msgSenderModule;
  address private expectedMsgSender = 0x809e815596AbEB3764aBf81BE2DC39fBBAcc9949;
  AttestationPayload private attestationPayload;

  event ModuleRegistered(string name, string description, address moduleAddress);

  function setUp() public {
    msgSenderModule = new MsgSenderModule(expectedMsgSender);

    attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      bytes("subject"),
      new bytes(1)
    );
  }

  function test_MsgSenderModule_correctAddress() public {
    assertEq(msgSenderModule.expectedMsgSender(), expectedMsgSender);
    bytes memory validationPayload = new bytes(0);
    address msgSender = expectedMsgSender;

    msgSenderModule.run(attestationPayload, validationPayload, msgSender, 0);
  }

  function test_MsgSenderModule_incorrectAddress() public {
    assertEq(msgSenderModule.expectedMsgSender(), expectedMsgSender);
    bytes memory validationPayload = new bytes(0);
    address incorrectMsgSender = address(1);

    vm.expectRevert(MsgSenderModule.WrongTransactionSender.selector);
    msgSenderModule.run(attestationPayload, validationPayload, incorrectMsgSender, 0);
  }

  function test_MsgSenderModule_supportsInterface() public {
    bool isAbstractModuleSupported = msgSenderModule.supportsInterface(type(AbstractModule).interfaceId);
    assertEq(isAbstractModuleSupported, true);
  }
}
