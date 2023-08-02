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
    moduleRegistry.registerModule(expectedName, expectedDescription, expectedAddress);

    (string memory name, string memory description, address moduleAddress) = moduleRegistry.modules(expectedAddress);
    assertEq(name, expectedName);
    assertEq(description, expectedDescription);
    assertEq(moduleAddress, expectedAddress);
  }

  function testCannotRegisterModuleWithoutName() public {
    vm.expectRevert(ModuleRegistry.ModuleNameMissing.selector);
    moduleRegistry.registerModule("", expectedDescription, expectedAddress);
  }

  function testCannotRegisterModuleWithInvalidModuleAddress() public {
    vm.expectRevert(ModuleRegistry.ModuleAddressInvalid.selector);
    moduleRegistry.registerModule(expectedName, expectedDescription, vm.addr(1)); //vm.addr(1) gives EOA address
  }

  function testCannotRegisterModuleWichHasNotImplementedIModuleInterface() public {
    IncorrectModule incorrectModule = new IncorrectModule();
    vm.expectRevert(ModuleRegistry.ModuleInvalid.selector);
    moduleRegistry.registerModule(expectedName, expectedDescription, address(incorrectModule));
  }

  function testCannotRegisterModuleTwice() public {
    moduleRegistry.registerModule(expectedName, expectedDescription, expectedAddress);
    vm.expectRevert(ModuleRegistry.ModuleAlreadyExists.selector);
    moduleRegistry.registerModule(expectedName, expectedDescription, expectedAddress);
  }
}

contract CorrectModule is ModuleInterface, IERC165 {
  function test() public {}

  function run() external pure returns (bool) {
    return true;
  }

  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return interfaceID == type(ModuleInterface).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}

contract IncorrectModule {
  function test() public {}
}
