// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { AbstractPortal } from "../../src/interface/AbstractPortal.sol";
import { DefaultPortal } from "../../src/portal/DefaultPortal.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { CorrectModule } from "../../src/example/CorrectModule.sol";
import { AttestationRegistryMock } from "../mocks/AttestationRegistryMock.sol";
import { ModuleRegistryMock } from "../mocks/ModuleRegistryMock.sol";
import { ERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165Upgradeable.sol";

contract DefaultPortalTest is Test {
  CorrectModule public correctModule = new CorrectModule();
  address[] public modules = new address[](1);
  DefaultPortal public defaultPortal;
  ModuleRegistryMock public moduleRegistryMock = new ModuleRegistryMock();
  AttestationRegistryMock public attestationRegistryMock = new AttestationRegistryMock();

  event Initialized(uint8 version);
  event PortalRegistered(string name, string description, address portalAddress);
  event ModulesRunForAttestation();
  event AttestationRegistered();
  event AttestationRevoked(bytes32 attestationId, bytes32 replacedBy);
  event BulkAttestationsRevoked(bytes32[] attestationId, bytes32[] replacedBy);

  function setUp() public {
    modules.push(address(correctModule));
    defaultPortal = new DefaultPortal();
    defaultPortal.initialize(modules, address(moduleRegistryMock), address(attestationRegistryMock));
  }

  function test_setup() public {
    assertEq(address(defaultPortal.modules(0)), address(modules[0]));
    assertEq(address(defaultPortal.moduleRegistry()), address(moduleRegistryMock));
    assertEq(address(defaultPortal.attestationRegistry()), address(attestationRegistryMock));
  }

  function test_initialize() public {
    vm.expectRevert("Initializable: contract is already initialized");
    defaultPortal.initialize(modules, address(moduleRegistryMock), address(attestationRegistryMock));
  }

  function test_getModules() public {
    address[] memory _modules = defaultPortal.getModules();
    assertEq(_modules, modules);
  }

  function test_attest() public {
    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      bytes("subject"),
      block.timestamp + 1 days,
      new bytes(1)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    defaultPortal.attest(attestationPayload, validationPayload);
  }

  function test_revoke() public {
    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(bytes32("1"), bytes32("2"));
    defaultPortal.revoke(bytes32("1"), bytes32("2"));
  }

  function test_bulkRevoke() public {
    bytes32[] memory attestationsToRevoke = new bytes32[](2);
    attestationsToRevoke[0] = bytes32("1");
    attestationsToRevoke[1] = bytes32("2");
    bytes32[] memory replacingAttestations = new bytes32[](2);
    replacingAttestations[0] = bytes32(0);
    replacingAttestations[1] = bytes32(0);

    vm.expectEmit(true, true, true, true);
    emit BulkAttestationsRevoked(attestationsToRevoke, replacingAttestations);
    defaultPortal.bulkRevoke(attestationsToRevoke, replacingAttestations);
  }

  function testSupportsInterface() public {
    bool isIERC165Supported = defaultPortal.supportsInterface(type(ERC165Upgradeable).interfaceId);
    assertEq(isIERC165Supported, true);
    bool isAbstractPortalSupported = defaultPortal.supportsInterface(type(AbstractPortal).interfaceId);
    assertEq(isAbstractPortalSupported, true);
  }
}
