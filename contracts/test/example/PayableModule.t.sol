// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { AbstractModule } from "../../src/interface/AbstractModule.sol";
import { PayableModule } from "../../src/example/PayableModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

contract PayableModuleTest is Test {
  PayableModule private payableModule;
  uint256 private attestationFee = 0.01 ether;
  AttestationPayload private attestationPayload;

  function setUp() public {
    payableModule = new PayableModule(attestationFee);

    attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      bytes("subject"),
      new bytes(1)
    );
  }

  function test_PayableModule() public view {
    address payable msgSender = payable(address(0x123));
    bytes memory validationPayload = new bytes(0);

    payableModule.run(attestationPayload, validationPayload, msgSender, attestationFee);
  }

  function test_PayableModule_setFee() public {
    assertEq(payableModule.attestationFee(), 0.01 ether);
    payableModule.setFee(0.001 ether);
    assertEq(payableModule.attestationFee(), 0.001 ether);
  }

  function test_PayableModule_InvalidAttestationFee() public {
    address payable msgSender = payable(address(0x123));
    bytes memory validationPayload = new bytes(0);

    vm.expectRevert(PayableModule.InvalidAttestationFee.selector);
    payableModule.run(attestationPayload, validationPayload, msgSender, 0 ether);

    vm.expectRevert(PayableModule.InvalidAttestationFee.selector);
    payableModule.run(attestationPayload, validationPayload, msgSender, 0.001 ether);
  }

  function testSupportsInterface() public {
    bool isAbstractModuleSupported = payableModule.supportsInterface(type(AbstractModule).interfaceId);
    assertEq(isAbstractModuleSupported, true);
  }
}
