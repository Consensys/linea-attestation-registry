// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { EASPortal } from "../../src/example/EASPortal.sol";
import { AbstractPortal } from "../../src/interface/AbstractPortal.sol";
import { AttestationRegistryMock } from "../mocks/AttestationRegistryMock.sol";
import { ModuleRegistryMock } from "../mocks/ModuleRegistryMock.sol";
import { ERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165Upgradeable.sol";

contract EASPortalTest is Test {
  EASPortal public easPortal;
  address[] public modules = new address[](0);
  ModuleRegistryMock public moduleRegistryMock = new ModuleRegistryMock();
  AttestationRegistryMock public attestationRegistryMock = new AttestationRegistryMock();

  event Initialized(uint8 version);
  event AttestationRegistered();
  event BulkAttestationsRegistered();

  function setUp() public {
    easPortal = new EASPortal();
    easPortal.initialize(modules, address(moduleRegistryMock), address(attestationRegistryMock));
  }

  function test_initialize() public {
    vm.expectRevert("Initializable: contract is already initialized");
    easPortal.initialize(modules, address(moduleRegistryMock), address(attestationRegistryMock));
  }

  function test_attest() public {
    // Create EAS attestation request
    EASPortal.AttestationRequestData memory attestationRequestData = EASPortal.AttestationRequestData(
      makeAddr("recipient"),
      bytes32("refUID"),
      uint64(block.timestamp + 1 days),
      uint256(1),
      false,
      new bytes(0)
    );
    EASPortal.AttestationRequest memory attestationRequest = EASPortal.AttestationRequest(
      bytes32(uint256(1)),
      attestationRequestData
    );

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    easPortal.attest(attestationRequest);
  }

  function test_bulkAttest() public {
    // Create EAS attestation request
    EASPortal.AttestationRequestData memory attestationRequestData = EASPortal.AttestationRequestData(
      makeAddr("recipient"),
      bytes32("refUID"),
      uint64(block.timestamp + 1 days),
      uint256(1),
      false,
      new bytes(0)
    );

    EASPortal.AttestationRequest[] memory attestationsRequests = new EASPortal.AttestationRequest[](2);
    attestationsRequests[0] = EASPortal.AttestationRequest(bytes32(uint256(1)), attestationRequestData);
    attestationsRequests[1] = EASPortal.AttestationRequest(bytes32(uint256(1)), attestationRequestData);

    vm.expectEmit(true, true, true, true);
    emit BulkAttestationsRegistered();
    easPortal.bulkAttest(attestationsRequests);
  }

  function test_revoke() public {
    vm.expectRevert("No revoking");
    easPortal.revoke(bytes32(uint256(1)), bytes32(uint256(1)));
  }

  function test_bulkRevoke() public {
    bytes32[] memory attestationsToRevoke = new bytes32[](2);
    attestationsToRevoke[0] = bytes32(uint256(1));
    attestationsToRevoke[1] = bytes32(uint256(2));

    bytes32[] memory replacingAttestations = new bytes32[](2);
    replacingAttestations[0] = bytes32(uint256(0));
    replacingAttestations[1] = bytes32(uint256(3));

    vm.expectRevert("No bulk revoking");
    easPortal.bulkRevoke(attestationsToRevoke, replacingAttestations);
  }

  function testSupportsInterface() public {
    bool isIERC165Supported = easPortal.supportsInterface(type(ERC165Upgradeable).interfaceId);
    assertEq(isIERC165Supported, true);
    bool isEASAbstractPortalSupported = easPortal.supportsInterface(type(AbstractPortal).interfaceId);
    assertEq(isEASAbstractPortalSupported, true);
  }
}
