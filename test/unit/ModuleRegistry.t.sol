// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { ModuleRegistry } from "../../src/ModuleRegistry.sol";
import { CorrectModule } from "../../src/example/CorrectModule.sol";
import { IncorrectModule } from "../../src/example/IncorrectModule.sol";
import { AbstractModule } from "../../src/interface/AbstractModule.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

contract ModuleRegistryTest is Test {
  ModuleRegistry private moduleRegistry;
  string private expectedName = "Name";
  string private expectedDescription = "Description";
  address private expectedAddress = address(new CorrectModule());

  event ModuleRegistered(string name, string description, address moduleAddress);
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

  function testGetModuleAddress() public {
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);

    address moduleAddress = moduleRegistry.moduleAddresses(0);
    assertEq(moduleAddress, expectedAddress);
  }
}
