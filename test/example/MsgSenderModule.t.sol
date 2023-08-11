// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { AbstractModule } from "../../src/interface/AbstractModule.sol";
import { MsgSenderModule } from "../../src/example/MsgSenderModule.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";

contract MsgSenderModuleTest is Test {
  MsgSenderModule private msgSenderModule;
  address private expectedMsgSender = 0x809e815596AbEB3764aBf81BE2DC39fBBAcc9949;

  event ModuleRegistered(string name, string description, address moduleAddress);
  event Initialized(uint8 version);

  function setUp() public {
    msgSenderModule = new MsgSenderModule();
    msgSenderModule.initialize(expectedMsgSender);
  }

  function testInitialize() public {
    msgSenderModule = new MsgSenderModule();
    vm.expectEmit();
    emit Initialized(1);
    msgSenderModule.initialize(expectedMsgSender);
    assertEq(msgSenderModule.expectedMsgSender(), expectedMsgSender);
  }

  function testCorrectMsgSenderAddress() public {
    assertEq(msgSenderModule.expectedMsgSender(), expectedMsgSender);
    bytes memory attestationPayload = bytes("attestation payload");
    bytes memory validationPayload = bytes("validation payload");
    bytes32 schemaId = 0x36304af55bbea73214675d3770f679b4b6e0bfff512f5af01046e6f5d29261e3;
    address msgSender = expectedMsgSender;

    (bytes memory _attestationPayload, bytes memory _validationPayload) = msgSenderModule.run(
      attestationPayload,
      validationPayload,
      schemaId,
      msgSender
    );

    assertEq(_attestationPayload, attestationPayload);
    assertEq(_validationPayload, validationPayload);
  }

  function testIncorrectMsgSenderAddress() public {
    assertEq(msgSenderModule.expectedMsgSender(), expectedMsgSender);
    bytes memory attestationPayload = bytes("attestation payload");
    bytes memory validationPayload = bytes("validation payload");
    bytes32 schemaId = 0x36304af55bbea73214675d3770f679b4b6e0bfff512f5af01046e6f5d29261e3;
    address incorrectMsgSender = address(1);
    vm.expectRevert("Incorrect message sender");
    msgSenderModule.run(attestationPayload, validationPayload, schemaId, incorrectMsgSender);
  }

  function testSupportsInterface() public {
    bool isIERC165Supported = msgSenderModule.supportsInterface(type(IERC165).interfaceId);
    assertEq(isIERC165Supported, true);
    bool isAbstractModuleSupported = msgSenderModule.supportsInterface(type(AbstractModule).interfaceId);
    assertEq(isAbstractModuleSupported, true);
  }
}
