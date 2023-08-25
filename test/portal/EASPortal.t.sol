// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { AttestationRequest, AttestationRequestData, EASAbstractPortal, EASPortal } from "../../src/portal/EASPortal.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { CorrectModule } from "../../src/example/CorrectModule.sol";
import { AttestationRegistryMock } from "../mocks/AttestationRegistryMock.sol";
import { ModuleRegistryMock } from "../mocks/ModuleRegistryMock.sol";
import { ERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165Upgradeable.sol";

contract EASPortalTest is Test {
  EASPortal public easPortal;
  AttestationRegistryMock public attestationRegistryMock = new AttestationRegistryMock();

  event Initialized(uint8 version);
  event AttestationRegistered();

  function setUp() public {
    easPortal = new EASPortal();
  }

  function test_initialize() public {
    vm.expectEmit();
    emit Initialized(1);
    easPortal.initialize(address(1));

    vm.expectRevert("Initializable: contract is already initialized");
    easPortal.initialize(address(1));
  }

  // function test_attest() public {
  //   vm.expectEmit();
  //   emit Initialized(1);
  //   easPortal.initialize(address(attestationRegistryMock));

  //   // Create EAS attestation request
  //   AttestationRequestData memory attestationRequestData = AttestationRequestData(
  //     makeAddr("recipient"),
  //     uint64(block.timestamp + 1 days),
  //     false,
  //     bytes32("refUID"),
  //     new bytes(0),
  //     uint256(1)
  //   );
  //   AttestationRequest memory attestationRequest = AttestationRequest(bytes32(uint256(1)), attestationRequestData);

  //   vm.expectEmit(true, true, true, true);
  //   emit AttestationRegistered();
  //   easPortal.attest(attestationRequest);
  // }

  function testSupportsInterface() public {
    bool isIERC165Supported = easPortal.supportsInterface(type(ERC165Upgradeable).interfaceId);
    assertEq(isIERC165Supported, true);
    bool isEASAbstractPortalSupported = easPortal.supportsInterface(type(EASAbstractPortal).interfaceId);
    assertEq(isEASAbstractPortalSupported, true);
  }
}
