// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { ModuleRegistry } from "../src/ModuleRegistry.sol";
import { OldVersionModule } from "./mocks/OldVersionModuleMock.sol";
import { CorrectModuleV2 } from "./mocks/CorrectModuleV2Mock.sol";
import { IncorrectModule } from "./mocks/IncorrectModuleMock.sol";
import { PortalRegistryMock } from "./mocks/PortalRegistryMock.sol";
import { OperationType } from "../src/types/Enums.sol";
import { PortalRegistryNotAllowlistedMock } from "./mocks/PortalRegistryNotAllowlistedMock.sol";
import { AttestationPayload } from "../src/types/Structs.sol";
import { Router } from "../src/Router.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract ModuleRegistryTest is Test {
  ModuleRegistry private moduleRegistry;
  Router public router;
  address public portalRegistryAddress;
  string private expectedName = "Name";
  string private expectedDescription = "Description";
  address private expectedAddress = address(new CorrectModuleV2());
  address private user = makeAddr("user");
  AttestationPayload private attestationPayload;
  address private proxyAdmin = makeAddr("proxyAdmin");

  event ModuleRegistered(string name, string description, address moduleAddress);
  event Initialized(uint8 version);
  event RouterUpdated(address routerAddress);

  function setUp() public {
    router = new Router();
    router.initialize();

    TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
      address(new ModuleRegistry()),
      proxyAdmin,
      abi.encodeWithSelector(ModuleRegistry.initialize.selector, address(router))
    );

    moduleRegistry = ModuleRegistry(payable(address(proxy)));

    router.updateModuleRegistry(address(moduleRegistry));
    PortalRegistryMock portalRegistryMock = new PortalRegistryMock();
    portalRegistryAddress = address(portalRegistryMock);
    router.updatePortalRegistry(portalRegistryAddress);
    portalRegistryMock.setIssuer(user);

    attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      bytes("subject"),
      new bytes(1)
    );
  }

  function test_initialize_ContractAlreadyInitialized() public {
    vm.expectRevert("Initializable: contract is already initialized");
    moduleRegistry.initialize(makeAddr("router"));
  }

  function test_isContractAddress() public view {
    // isContractAddress should return false for EOA address
    address eoaAddress = vm.addr(1);
    bool eoaAddressResult = moduleRegistry.isContractAddress(eoaAddress);
    assertEq(eoaAddressResult, false);

    // isContractAddress should return true for contract address
    address contractAddress = expectedAddress;
    bool contractAddressResult = moduleRegistry.isContractAddress(contractAddress);
    assertEq(contractAddressResult, true);
  }

  function test_register() public {
    vm.expectEmit();
    emit ModuleRegistered(expectedName, expectedDescription, expectedAddress);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);

    (address moduleAddress, string memory name, string memory description) = moduleRegistry.modules(expectedAddress);
    assertEq(moduleAddress, expectedAddress);
    assertEq(name, expectedName);
    assertEq(description, expectedDescription);
  }

  function test_register_OnlyAllowlisted() public {
    PortalRegistryNotAllowlistedMock portalRegistryNotAllowlistedMock = new PortalRegistryNotAllowlistedMock();
    portalRegistryAddress = address(portalRegistryNotAllowlistedMock);
    Router newRouter = new Router();
    newRouter.initialize();
    newRouter.updatePortalRegistry(portalRegistryAddress);

    TransparentUpgradeableProxy proxy = new TransparentUpgradeableProxy(
      address(new ModuleRegistry()),
      proxyAdmin,
      abi.encodeWithSelector(ModuleRegistry.initialize.selector, address(newRouter))
    );

    ModuleRegistry newModuleRegistry = ModuleRegistry(payable(address(proxy)));

    vm.expectRevert(ModuleRegistry.OnlyAllowlisted.selector);
    vm.startPrank(makeAddr("InvalidIssuer"));
    newModuleRegistry.register(expectedName, expectedDescription, expectedAddress);
    vm.stopPrank();
  }

  function test_register_ModuleNameMissing() public {
    vm.expectRevert(ModuleRegistry.ModuleNameMissing.selector);
    vm.prank(user);
    moduleRegistry.register("", expectedDescription, expectedAddress);
  }

  function test_register_ModuleAddressInvalid() public {
    vm.expectRevert(ModuleRegistry.ModuleAddressInvalid.selector);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, vm.addr(1)); //vm.addr(1) gives EOA address
  }

  function test_register_ModuleInvalid() public {
    IncorrectModule incorrectModule = new IncorrectModule();
    vm.expectRevert(ModuleRegistry.ModuleInvalid.selector);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, address(incorrectModule));
  }

  function test_register_old_version_ModuleInvalid() public {
    OldVersionModule oldVersionModule = new OldVersionModule();
    vm.expectRevert(ModuleRegistry.ModuleInvalid.selector);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, address(oldVersionModule));
  }

  function test_register_ModuleAlreadyExists() public {
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);
    vm.expectRevert(ModuleRegistry.ModuleAlreadyExists.selector);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);
  }

  function test_runModulesV2() public {
    // Register 2 modules
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new CorrectModuleV2());
    moduleAddresses[1] = address(new CorrectModuleV2());
    vm.startPrank(user);
    moduleRegistry.register("Module1", "Description1", moduleAddresses[0]);
    moduleRegistry.register("Module2", "Description2", moduleAddresses[1]);
    vm.stopPrank();
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);

    moduleRegistry.runModulesV2(
      moduleAddresses,
      attestationPayload,
      validationPayload,
      0,
      address(makeAddr("initialCaller")),
      address(makeAddr("attester")),
      OperationType.Attest
    );
  }

  function test_runModules_ModuleValidationPayloadMismatch() public {
    // Register 2 modules
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new CorrectModuleV2());
    moduleAddresses[1] = address(new CorrectModuleV2());
    vm.startPrank(user);
    moduleRegistry.register("Module1", "Description1", moduleAddresses[0]);
    moduleRegistry.register("Module2", "Description2", moduleAddresses[1]);
    vm.stopPrank();

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](1);

    vm.expectRevert(ModuleRegistry.ModuleValidationPayloadMismatch.selector);
    moduleRegistry.runModules(moduleAddresses, attestationPayload, validationPayload, 0);
  }

  function test_runModuleV2s_ModuleValidationPayloadMismatch() public {
    // Register 2 modules
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new CorrectModuleV2());
    moduleAddresses[1] = address(new CorrectModuleV2());
    vm.startPrank(user);
    moduleRegistry.register("Module1", "Description1", moduleAddresses[0]);
    moduleRegistry.register("Module2", "Description2", moduleAddresses[1]);
    vm.stopPrank();

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](1);

    vm.expectRevert(ModuleRegistry.ModuleValidationPayloadMismatch.selector);
    moduleRegistry.runModulesV2(
      moduleAddresses,
      attestationPayload,
      validationPayload,
      0,
      address(makeAddr("initialCaller")),
      address(makeAddr("attester")),
      OperationType.Attest
    );
  }

  function test_runModules_withoutModule() public {
    // Register a module
    address[] memory moduleAddresses = new address[](0);

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](0);

    moduleRegistry.runModules(moduleAddresses, attestationPayload, validationPayload, 0);
  }

  function test_runModulesV2_withoutModule() public {
    // Register a module
    address[] memory moduleAddresses = new address[](0);

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](0);

    moduleRegistry.runModulesV2(
      moduleAddresses,
      attestationPayload,
      validationPayload,
      0,
      address(makeAddr("initialCaller")),
      address(makeAddr("attester")),
      OperationType.Attest
    );
  }

  function test_runModules_ModuleNotRegistered() public {
    // Create 2 modules without registration
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new OldVersionModule());
    moduleAddresses[1] = address(new OldVersionModule());

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);

    // execute runModules
    vm.expectRevert(ModuleRegistry.ModuleNotRegistered.selector);
    moduleRegistry.runModules(moduleAddresses, attestationPayload, validationPayload, 0);
  }

  function test_runModulesV2_ModuleNotRegistered() public {
    // Create 2 modules without registration
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new CorrectModuleV2());
    moduleAddresses[1] = address(new CorrectModuleV2());

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);

    // execute runModules
    vm.expectRevert(ModuleRegistry.ModuleNotRegistered.selector);
    moduleRegistry.runModulesV2(
      moduleAddresses,
      attestationPayload,
      validationPayload,
      0,
      address(makeAddr("initialCaller")),
      address(makeAddr("attester")),
      OperationType.Attest
    );
  }

  function test_bulkRunModulesV2() public {
    // Register 2 modules
    address[] memory moduleAddresses = new address[](2);
    moduleAddresses[0] = address(new CorrectModuleV2());
    moduleAddresses[1] = address(new CorrectModuleV2());
    vm.startPrank(user);
    moduleRegistry.register("Module1", "Description1", moduleAddresses[0]);
    moduleRegistry.register("Module2", "Description2", moduleAddresses[1]);

    // Create validation payloads
    bytes[] memory validationPayload1 = new bytes[](2);
    bytes[] memory validationPayload2 = new bytes[](2);

    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload1;
    validationPayloads[1] = validationPayload2;

    AttestationPayload[] memory attestationPayloads = new AttestationPayload[](2);
    attestationPayloads[0] = attestationPayload;
    attestationPayloads[1] = attestationPayload;

    moduleRegistry.bulkRunModulesV2(
      moduleAddresses,
      attestationPayloads,
      validationPayloads,
      address(makeAddr("initialCaller")),
      address(makeAddr("attester")),
      OperationType.BulkAttest
    );
    vm.stopPrank();
  }

  function test_isRegistered() public {
    bool isRegistered = moduleRegistry.isRegistered(expectedAddress);
    assertFalse(isRegistered);
    vm.prank(user);
    moduleRegistry.register(expectedName, expectedDescription, expectedAddress);
    isRegistered = moduleRegistry.isRegistered(expectedAddress);
    assertTrue(isRegistered);
  }
}
