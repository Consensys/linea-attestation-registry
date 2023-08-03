// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { MsgSenderModule } from "../../src/example/MsgSenderModule.sol";

contract MsgSenderModuleTest is Test {
  MsgSenderModule private msgSenderModule;
  address private expectedMsgSender = 0x809e815596AbEB3764aBf81BE2DC39fBBAcc9949;

  event ModuleRegistered(string name, string description, address moduleAddress);
  event Initialized(uint8 version);

  function setUp() public {
    msgSenderModule = new MsgSenderModule();
    vm.expectEmit();
    emit Initialized(1);
    msgSenderModule.initialize(expectedMsgSender);
  }

  function testInitialize() public {
    assertEq(msgSenderModule.expectedMsgSender(), expectedMsgSender);
  }

  function testRun() public {
    assertEq(msgSenderModule.expectedMsgSender(), expectedMsgSender);
    bytes memory attestationPayload = bytes("attestation payload");
    bytes memory validationPayload = bytes("validation payload");
    bytes32 schemaId = 0x36304af55bbea73214675d3770f679b4b6e0bfff512f5af01046e6f5d29261e3;
    address msgSender = expectedMsgSender;

    (
      bytes memory _attestationPayload,
      bytes memory _validationPayload,
      bytes32 _schemaId,
      address _msgSender,
      bool isValid
    ) = msgSenderModule.run(attestationPayload, validationPayload, schemaId, msgSender);

    assertEq(_attestationPayload, attestationPayload);
    assertEq(_validationPayload, validationPayload);
    assertEq(_schemaId, schemaId);
    assertEq(_msgSender, msgSender);
    assertTrue(isValid);
  }
}
