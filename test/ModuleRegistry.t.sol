// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { ModuleRegistry } from "../src/ModuleRegistry.sol";
import { CorrectModule } from "../src/example/CorrectModule.sol";
import { IncorrectModule } from "../src/example/IncorrectModule.sol";
import { AbstractModule } from "../src/interface/AbstractModule.sol";
import { PortalRegistryMock } from "./mocks/PortalRegistryMock.sol";
import { AttestationPayload } from "../src/types/Structs.sol";
import { Router } from "../src/Router.sol";

contract ModuleRegistryTest is Test {
  ModuleRegistry private moduleRegistry;
  Router public router;
  address public portalRegistryAddress;
  string private expectedName = "Name";
  string private expectedDescription = "Description";
  address private expectedAddress = address(new CorrectModule());
  address private user = makeAddr("user");

  event ModuleRegistered(string name, string description, address moduleAddress);
  event Initialized(uint8 version);

  function setUp() public {
    router = new Router();
    router.initialize();
    moduleRegistry = new ModuleRegistry();
    router.updateModuleRegistry(address(moduleRegistry));
    vm.prank(address(0));
    moduleRegistry.updateRouter(address(router));
    PortalRegistryMock portalRegistryMock = new PortalRegistryMock();
    portalRegistryAddress = address(portalRegistryMock);
    router.updatePortalRegistry(portalRegistryAddress);
    portalRegistryMock.setIssuer(user);
  }

  function testAlreadyInitialized() public {
    vm.expectRevert("Initializable: contract is already initialized");
    moduleRegistry.initialize();
  }

  function test_updateRouter() public {
    ModuleRegistry testModuleRegistry = new ModuleRegistry();

    vm.prank(address(0));
    testModuleRegistry.updateRouter(address(1));
    address routerAddress = address(testModuleRegistry.router());
    assertEq(routerAddress, address(1));
  }

  function test_updateRouter_InvalidParameter() public {
    ModuleRegistry testModuleRegistry = new ModuleRegistry();

    vm.expectRevert(ModuleRegistry.RouterInvalid.selector);
    vm.prank(address(0));
    testModuleRegistry.updateRouter(address(0));
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
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);

    (string memory name, string memory description, address moduleAddress) = moduleRegistry.modules(expectedAddress);
    assertEq(name, expectedName);
    assertEq(description, expectedDescription);
    assertEq(moduleAddress, expectedAddress);
  }

  function testCannotRegisterModuleWithInvalidIssuer() public {
    vm.expectRevert(ModuleRegistry.OnlyIssuer.selector);
    vm.startPrank(makeAddr("InvalidIssuer"));
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);
    vm.stopPrank();
  }

  function testCannotRegisterModuleWithoutName() public {
    vm.expectRevert(ModuleRegistry.ModuleNameMissing.selector);
    vm.prank(user);
    moduleRegistry.register("", expectedDescription, expectedAddress);
  }

  function testCannotRegisterModuleWithInvalidModuleAddress() public {
    vm.expectRevert(ModuleRegistry.ModuleAddressInvalid.selector);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, vm.addr(1)); //vm.addr(1) gives EOA address
  }

  function testCannotRegisterModuleWichHasNotImplementedAbstractModule() public {
    IncorrectModule incorrectModule = new IncorrectModule();
    vm.expectRevert(ModuleRegistry.ModuleInvalid.selector);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, address(incorrectModule));
  }

  function testCannotRegisterModuleTwice() public {
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);
    vm.expectRevert(ModuleRegistry.ModuleAlreadyExists.selector);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);
  }

  function testStoreModuleAddress() public {
    uint256 modulesNumber = moduleRegistry.getModulesNumber();
    assertEq(modulesNumber, 0);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);

    modulesNumber = moduleRegistry.getModulesNumber();
    assertEq(modulesNumber, 1);
  }

  function testRunModules() public {
    // Register 2 modules
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new CorrectModule());
    moduleAddresses[1] = address(new CorrectModule());
    vm.startPrank(user);
    moduleRegistry.register("Module1", "Description1", moduleAddresses[0]);
    moduleRegistry.register("Module2", "Description2", moduleAddresses[1]);
    vm.stopPrank();
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);

    moduleRegistry.runModules(moduleAddresses, validationPayload);
  }

  function testRunModulesWithIncorrectNumberOfValidationPayload() public {
    // Register 2 modules
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new CorrectModule());
    moduleAddresses[1] = address(new CorrectModule());
    vm.startPrank(user);
    moduleRegistry.register("Module1", "Description1", moduleAddresses[0]);
    moduleRegistry.register("Module2", "Description2", moduleAddresses[1]);
    vm.stopPrank();

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](1);

    vm.expectRevert(ModuleRegistry.ModuleValidationPayloadMismatch.selector);
    moduleRegistry.runModules(moduleAddresses, validationPayload);
  }

  function testRunModulesWithoutSendingModuleAddresses() public {
    // Register a module
    address[] memory moduleAddresses = new address[](0);

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](0);

    moduleRegistry.runModules(moduleAddresses, validationPayload);
  }

  function testRunModulesForUnregisteredModules() public {
    // Create 2 modules without registration
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new CorrectModule());
    moduleAddresses[1] = address(new CorrectModule());

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);

    // execute runModules
    vm.expectRevert(ModuleRegistry.ModuleNotRegistered.selector);
    moduleRegistry.runModules(moduleAddresses, validationPayload);
  }

  function testGetModuleAddress() public {
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);

    address moduleAddress = moduleRegistry.moduleAddresses(0);
    assertEq(moduleAddress, expectedAddress);
  }

  function testIsModuleRegistered() public {
    bool isRegistered = moduleRegistry.isRegistered(expectedAddress);
    assertFalse(isRegistered);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);
    isRegistered = moduleRegistry.isRegistered(expectedAddress);
    assertTrue(isRegistered);
  }
}
