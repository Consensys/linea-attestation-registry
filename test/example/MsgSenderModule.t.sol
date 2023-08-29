// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { AbstractModule } from "../../src/interface/AbstractModule.sol";
import { MsgSenderModule } from "../../src/example/MsgSenderModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
// solhint-disable-next-line max-line-length
import { IERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/IERC165Upgradeable.sol";

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
    bytes[] memory validationPayload = new bytes[](0);
    address msgSender = expectedMsgSender;

    bytes[] memory _validationPayload = msgSenderModule.run(validationPayload, msgSender);

    assertBytesArrayEq(_validationPayload, validationPayload);
  }

  function testIncorrectMsgSenderAddress() public {
    assertEq(msgSenderModule.expectedMsgSender(), expectedMsgSender);
    bytes[] memory validationPayload = new bytes[](0);
    address incorrectMsgSender = address(1);
    vm.expectRevert("Incorrect message sender");
    msgSenderModule.run(validationPayload, incorrectMsgSender);
  }

  function testSupportsInterface() public {
    bool isIERC165Supported = msgSenderModule.supportsInterface(type(IERC165Upgradeable).interfaceId);
    assertEq(isIERC165Supported, true);
    bool isAbstractModuleSupported = msgSenderModule.supportsInterface(type(AbstractModule).interfaceId);
    assertEq(isAbstractModuleSupported, true);
  }

  function assertBytesArrayEq(bytes[] memory actualBytesArray, bytes[] memory expectedBytesArray) public {
    // Compare bytes[] arrays using assertEq
    require(expectedBytesArray.length == actualBytesArray.length, "Number of elements are not equal");

    for (uint256 i = 0; i < expectedBytesArray.length; i++) {
      assertEq(expectedBytesArray[i], actualBytesArray[i]);
    }
  }
}
