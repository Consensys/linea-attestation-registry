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
  event PortalRegistered(string name, string description, address moduleAddress);
  event ModulesRunForAttestation();
  event AttestationRegistered();

  function setUp() public {
    defaultPortal = new DefaultPortal();
    modules.push(address(correctModule));
  }

  function test_initialize() public {
    vm.expectEmit();
    emit Initialized(1);
    defaultPortal.initialize(modules, address(1), address(2));

    vm.expectRevert("Initializable: contract is already initialized");
    defaultPortal.initialize(modules, address(1), address(2));
  }

  function test_getModules() public {
    vm.expectEmit();
    emit Initialized(1);
    defaultPortal.initialize(modules, address(1), address(2));

    address[] memory _modules = defaultPortal.getModules();
    assertEq(_modules, modules);
  }

  function test_attest() public {
    vm.expectEmit();
    emit Initialized(1);
    defaultPortal.initialize(modules, address(moduleRegistryMock), address(attestationRegistryMock));

    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("attestationId"),
      bytes32("schemaId"),
      address(1),
      bytes("subject"),
      block.timestamp + 1 days,
      new bytes[](0)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit ModulesRunForAttestation();
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    defaultPortal.attest(attestationPayload, validationPayload);
  }

  function testSupportsInterface() public {
    bool isIERC165Supported = defaultPortal.supportsInterface(type(ERC165Upgradeable).interfaceId);
    assertEq(isIERC165Supported, true);
    bool isAbstractPortalSupported = defaultPortal.supportsInterface(type(AbstractPortal).interfaceId);
    assertEq(isAbstractPortalSupported, true);
  }
}
