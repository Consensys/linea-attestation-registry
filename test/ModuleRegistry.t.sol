// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { ModuleRegistry } from "../src/ModuleRegistry.sol";
import { CorrectModule } from "../src/example/CorrectModule.sol";
import { IncorrectModule } from "../src/example/IncorrectModule.sol";
import { AbstractModule } from "../src/interface/AbstractModule.sol";
import { AttestationPayload } from "../src/types/Structs.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

contract ModuleRegistryTest is Test {
  ModuleRegistry private moduleRegistry;
  string private expectedName = "Name";
  string private expectedDescription = "Description";
  address private expectedAddress = address(new CorrectModule());

  event ModuleRegistered(string name, string description, address moduleAddress);
  event ModulesRunForAttestation(bytes32 attestationId);
  event Initialized(uint8 version);

  function setUp() public {
    moduleRegistry = new ModuleRegistry();
  }

  function testInitialize() public {
    vm.expectEmit();
    emit Initialized(1);
    moduleRegistry.initialize();
  }

  function testIsContractAddress() public {
    // isContractAddress should return false for EOA address
    address eoaAddress = vm.addr(1);
    bool eoaAddressResult = moduleRegistry.isContractAddress(eoaAddress);
    assertEq(eoaAddressResult, false);

    // isContractAddress should return true for contract address
    address contractAddress = expectedAddress;
    bool contractAddressResult = moduleRegistry.isContractAddress(contractAddress);
    assertEq(contractAddressResult, true);
  }

  function testRegisterModule() public {
    vm.expectEmit();
    emit ModuleRegistered(expectedName, expectedDescription, expectedAddress);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);

    (string memory name, string memory description, address moduleAddress) = moduleRegistry.modules(expectedAddress);
    assertEq(name, expectedName);
    assertEq(description, expectedDescription);
    assertEq(moduleAddress, expectedAddress);
  }

  function testCannotRegisterModuleWithoutName() public {
    vm.expectRevert(ModuleRegistry.ModuleNameMissing.selector);
    moduleRegistry.register("", expectedDescription, expectedAddress);
  }

  function testCannotRegisterModuleWithInvalidModuleAddress() public {
    vm.expectRevert(ModuleRegistry.ModuleAddressInvalid.selector);
    moduleRegistry.register(expectedName, expectedDescription, vm.addr(1)); //vm.addr(1) gives EOA address
  }

  function testCannotRegisterModuleWichHasNotImplementedAbstractModule() public {
    IncorrectModule incorrectModule = new IncorrectModule();
    vm.expectRevert(ModuleRegistry.ModuleInvalid.selector);
    moduleRegistry.register(expectedName, expectedDescription, address(incorrectModule));
  }

  function testCannotRegisterModuleTwice() public {
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);
    vm.expectRevert(ModuleRegistry.ModuleAlreadyExists.selector);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);
  }

  function testStoreModuleAddress() public {
    uint256 modulesNumber = moduleRegistry.getModulesNumber();
    assertEq(modulesNumber, 0);

    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);

    modulesNumber = moduleRegistry.getModulesNumber();
    assertEq(modulesNumber, 1);
  }

  function testRunModules() public {
    // Register 2 modules
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new CorrectModule());
    moduleAddresses[1] = address(new CorrectModule());
    moduleRegistry.register("Module1", "Description1", moduleAddresses[0]);
    moduleRegistry.register("Module2", "Description2", moduleAddresses[1]);
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

    // execute runModules
    vm.expectEmit();
    emit ModulesRunForAttestation(bytes32("attestationId"));
    moduleRegistry.runModules(moduleAddresses, attestationPayload, validationPayload);
  }

  function testRunModulesWithoutSendingModuleAddresses() public {
    // Register a module
    address[] memory moduleAddresses = new address[](0);
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

    // execute runModules
    vm.expectRevert(ModuleRegistry.ModulesAddressesMissing.selector);
    moduleRegistry.runModules(moduleAddresses, attestationPayload, validationPayload);
  }

  function testRunModulesWithInvalidAttestationPayload() public {
    // Register a module
    address[] memory moduleAddresses = new address[](1);
    moduleAddresses[0] = address(new CorrectModule());
    moduleRegistry.register("Module1", "Description1", moduleAddresses[0]);
    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(""),
      bytes32(""),
      address(0),
      bytes(""),
      block.timestamp + 1 days,
      new bytes[](0)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](0);

    // execute runModules
    vm.expectRevert(ModuleRegistry.AttestationPayloadMissing.selector);
    moduleRegistry.runModules(moduleAddresses, attestationPayload, validationPayload);
  }

  function testRunModulesForUnregisteredModules() public {
    // Create 2 modules without registration
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new CorrectModule());
    moduleAddresses[1] = address(new CorrectModule());
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

    // execute runModules
    vm.expectRevert(ModuleRegistry.ModuleNotRegistered.selector);
    moduleRegistry.runModules(moduleAddresses, attestationPayload, validationPayload);
  }

  function testGetModuleAddress() public {
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);

    address moduleAddress = moduleRegistry.moduleAddresses(0);
    assertEq(moduleAddress, expectedAddress);
  }
}
