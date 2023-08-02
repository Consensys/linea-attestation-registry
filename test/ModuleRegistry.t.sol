// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { ModuleRegistry } from "../src/ModuleRegistry.sol";
import { ModuleInterface } from "../src/interface/ModuleInterface.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

contract ModuleRegistryTest is Test {
  ModuleRegistry private moduleRegistry;
  string private expectedName = "Name";
  string private expectedDescription = "Description";
  address private expectedAddress = address(new CorrectModule());

  event ModuleRegistered(string name, string description, address moduleAddress);

  function setUp() public {
    moduleRegistry = new ModuleRegistry();
  }

  function testCreateModule() public {
    vm.expectEmit();
    emit ModuleRegistered(expectedName, expectedDescription, expectedAddress);
    moduleRegistry.createModule(expectedName, expectedDescription, expectedAddress);

    (string memory name, string memory description, address moduleAddress) = moduleRegistry.modules(expectedAddress);
    assertEq(name, expectedName);
    assertEq(description, expectedDescription);
    assertEq(moduleAddress, expectedAddress);
  }

  function testCannotCreateModuleWithoutName() public {
    vm.expectRevert(ModuleRegistry.ModuleNameMissing.selector);
    moduleRegistry.createModule("", expectedDescription, expectedAddress);
  }

  function testCannotCreateModuleWithInvalidModuleAddress() public {
    vm.expectRevert(ModuleRegistry.ModuleAddressInvalid.selector);
    moduleRegistry.createModule(expectedName, expectedDescription, vm.addr(1)); //vm.addr(1) gives EOA address
  }

  function testCannotCreateModuleWichHasNotImplementedIModuleInterface() public {
    IncorrectModule incorrectModule = new IncorrectModule();
    vm.expectRevert(ModuleRegistry.ModuleInvalid.selector);
    moduleRegistry.createModule(expectedName, expectedDescription, address(incorrectModule));
  }

  function testCannotCreateModuleTwice() public {
    moduleRegistry.createModule(expectedName, expectedDescription, expectedAddress);
    vm.expectRevert(ModuleRegistry.ModuleAlreadyExists.selector);
    moduleRegistry.createModule(expectedName, expectedDescription, expectedAddress);
  }
}

contract CorrectModule is ModuleInterface, IERC165 {
  function run() external pure returns (bool) {
    return true;
  }

  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return interfaceID == type(ModuleInterface).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}

contract IncorrectModule {}
