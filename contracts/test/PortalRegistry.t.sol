// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { RouterManager } from "../src/RouterManager.sol";
import { PortalRegistry } from "../src/PortalRegistry.sol";
import { CorrectModuleV2 } from "./mocks/CorrectModuleV2Mock.sol";
import { Portal } from "../src/types/Structs.sol";
import { Router } from "../src/Router.sol";
import { AttestationRegistryMock } from "./mocks/AttestationRegistryMock.sol";
import { SchemaRegistryMock } from "./mocks/SchemaRegistryMock.sol";
import { ModuleRegistryMock } from "./mocks/ModuleRegistryMock.sol";
import { ValidPortalMock } from "./mocks/ValidPortalMock.sol";
import { OldVersionPortalMock } from "./mocks/OldVersionPortalMock.sol";
import { InvalidPortalMock } from "./mocks/InvalidPortalMock.sol";

contract PortalRegistryTest is Test {
  address public user = makeAddr("user");
  Router public router;
  PortalRegistry public portalRegistry;
  address public moduleRegistryAddress;
  address public attestationRegistryAddress;
  address public schemaRegistryAddress;
  string public expectedName = "Name";
  string public expectedDescription = "Description";
  string public expectedOwnerName = "Owner Name";
  ValidPortalMock public validPortalMock;
  OldVersionPortalMock public oldVersionPortalMock;
  InvalidPortalMock public invalidPortalMock = new InvalidPortalMock();

  event Initialized(uint8 version);
  event PortalRegistered(string name, string description, address portalAddress);
  event IssuerAdded(address issuerAddress);
  event IsTestnetUpdated(bool isTestnet);
  event IssuerRemoved(address issuerAddress);
  event PortalRevoked(address portalAddress);
  event RouterUpdated(address routerAddress);

  function setUp() public {
    router = new Router();
    router.initialize();

    portalRegistry = new PortalRegistry();
    router.updatePortalRegistry(address(portalRegistry));

    moduleRegistryAddress = address(new ModuleRegistryMock());
    attestationRegistryAddress = address(new AttestationRegistryMock());
    schemaRegistryAddress = address(new SchemaRegistryMock());
    vm.prank(address(0));
    portalRegistry.updateRouter(address(router));

    router.updateModuleRegistry(moduleRegistryAddress);
    router.updateAttestationRegistry(attestationRegistryAddress);
    router.updateSchemaRegistry(schemaRegistryAddress);
    vm.prank(address(0));
    portalRegistry.setIssuer(user);

    validPortalMock = new ValidPortalMock(new address[](0), address(router));
    oldVersionPortalMock = new OldVersionPortalMock(new address[](1), address(router));
  }

  function test_initialize_ContractAlreadyInitialized() public {
    vm.expectRevert("Initializable: contract is already initialized");
    portalRegistry.initialize(false);
  }

  function test_updateRouter() public {
    PortalRegistry testPortalRegistry = new PortalRegistry();

    vm.expectEmit(true, true, true, true);
    emit RouterUpdated(address(1));
    vm.prank(address(0));
    testPortalRegistry.updateRouter(address(1));
    address routerAddress = address(testPortalRegistry.router());
    assertEq(routerAddress, address(1));
  }

  function test_updateRouter_RouterInvalid() public {
    PortalRegistry testPortalRegistry = new PortalRegistry();

    vm.expectRevert(RouterManager.RouterInvalid.selector);
    vm.prank(address(0));
    testPortalRegistry.updateRouter(address(0));
  }

  function test_updateRouter_RouterAlreadyUpdated() public {
    PortalRegistry testPortalRegistry = new PortalRegistry();
    vm.expectEmit(true, true, true, true);
    emit RouterUpdated(address(1));
    vm.prank(address(0));
    testPortalRegistry.updateRouter(address(1));

    vm.expectRevert(PortalRegistry.RouterAlreadyUpdated.selector);
    vm.prank(address(0));
    testPortalRegistry.updateRouter(address(1));
  }

  function test_setIssuer() public {
    vm.startPrank(address(0));
    address issuerAddress = makeAddr("Issuer");
    vm.expectEmit();
    emit IssuerAdded(issuerAddress);
    portalRegistry.setIssuer(issuerAddress);

    bool isIssuer = portalRegistry.isIssuer(issuerAddress);
    assertEq(isIssuer, true);
  }

  function test_setIssuer_OnlyOwner() public {
    address issuerAddress = makeAddr("Issuer");

    vm.prank(makeAddr("random"));
    vm.expectRevert("Ownable: caller is not the owner");
    portalRegistry.setIssuer(issuerAddress);

    bool isIssuer = portalRegistry.isIssuer(issuerAddress);
    assertEq(isIssuer, false);
  }

  function test_setIssuer_AddressInvalid() public {
    vm.prank(address(0));

    vm.expectRevert(PortalRegistry.AddressInvalid.selector);
    portalRegistry.setIssuer(address(0));

    bool isIssuer = portalRegistry.isIssuer(address(0));
    assertEq(isIssuer, false);
  }

  function test_setIssuer_IssuerAlreadySet() public {
    vm.startPrank(address(0));
    address issuerAddress = makeAddr("Issuer");
    vm.expectEmit();
    emit IssuerAdded(issuerAddress);
    portalRegistry.setIssuer(issuerAddress);

    vm.expectRevert(PortalRegistry.IssuerAlreadySet.selector);
    portalRegistry.setIssuer(issuerAddress);
  }

  function test_setIsTestnet() public {
    PortalRegistry testnetPortalRegistry = new PortalRegistry();

    bool isTestnet = testnetPortalRegistry.getIsTestnet();
    assertEq(isTestnet, false);

    vm.prank(address(0));
    vm.expectEmit();
    emit IsTestnetUpdated(true);
    testnetPortalRegistry.setIsTestnet(true);

    isTestnet = testnetPortalRegistry.getIsTestnet();
    assertEq(isTestnet, true);
  }

  function test_setIsTestnet_OnlyOwner() public {
    bool isTestnet = portalRegistry.getIsTestnet();
    assertEq(isTestnet, false);

    // Set the flag as a random user
    vm.prank(makeAddr("random"));
    vm.expectRevert("Ownable: caller is not the owner");
    portalRegistry.setIsTestnet(true);

    isTestnet = portalRegistry.getIsTestnet();
    assertEq(isTestnet, false);
  }

  function test_setIsTestnet_TestnetStatusAlreadyUpdated() public {
    bool isTestnet = portalRegistry.getIsTestnet();
    assertEq(isTestnet, false);

    vm.prank(address(0));
    vm.expectRevert(PortalRegistry.TestnetStatusAlreadyUpdated.selector);
    portalRegistry.setIsTestnet(false);
  }

  function test_removeIssuer() public {
    vm.startPrank(address(0));
    address issuerAddress = makeAddr("Issuer");
    portalRegistry.setIssuer(issuerAddress);

    bool isIssuer = portalRegistry.isIssuer(issuerAddress);
    assertEq(isIssuer, true);

    vm.expectEmit();
    emit IssuerRemoved(issuerAddress);
    portalRegistry.removeIssuer(issuerAddress);
    bool isIssuerAfterRemoval = portalRegistry.isIssuer(issuerAddress);
    assertEq(isIssuerAfterRemoval, false);
    vm.stopPrank();
  }

  function test_register() public {
    // Register a portal implementing AbstractPortal
    vm.expectEmit();
    emit PortalRegistered(expectedName, expectedDescription, address(validPortalMock));
    vm.prank(user);
    portalRegistry.register(address(validPortalMock), expectedName, expectedDescription, true, expectedOwnerName);

    bool isRegistered = portalRegistry.isRegistered(address(validPortalMock));
    assertEq(isRegistered, true);

    Portal memory expectedPortal = Portal(
      address(validPortalMock),
      user,
      new address[](0),
      true,
      expectedName,
      expectedDescription,
      expectedOwnerName
    );

    Portal memory registeredPortal = portalRegistry.getPortalByAddress(address(validPortalMock));
    _assertPortal(registeredPortal, expectedPortal);
  }

  function test_register_OnlyAllowlisted() public {
    vm.expectRevert(PortalRegistry.OnlyAllowlisted.selector);
    vm.prank(makeAddr("InvalidUser"));
    portalRegistry.register(address(validPortalMock), expectedName, expectedDescription, true, expectedOwnerName);
  }

  function test_register_PortalAlreadyExists() public {
    vm.prank(user);
    portalRegistry.register(address(validPortalMock), expectedName, expectedDescription, true, expectedOwnerName);
    vm.expectRevert(PortalRegistry.PortalAlreadyExists.selector);
    vm.prank(user);
    portalRegistry.register(address(validPortalMock), expectedName, expectedDescription, true, expectedOwnerName);
  }

  function test_register_PortalAddressInvalid() public {
    vm.expectRevert(PortalRegistry.PortalAddressInvalid.selector);
    vm.prank(user);
    portalRegistry.register(address(0), expectedName, expectedDescription, true, expectedOwnerName);

    vm.expectRevert(PortalRegistry.PortalAddressInvalid.selector);
    vm.prank(user);
    portalRegistry.register(user, expectedName, expectedDescription, true, expectedOwnerName);
  }

  function test_register_PortalNameMissing() public {
    vm.expectRevert(PortalRegistry.PortalNameMissing.selector);
    vm.prank(user);
    portalRegistry.register(address(validPortalMock), "", expectedDescription, true, expectedOwnerName);
  }

  function test_register_PortalDescriptionMissing() public {
    vm.expectRevert(PortalRegistry.PortalDescriptionMissing.selector);
    vm.prank(user);
    portalRegistry.register(address(validPortalMock), expectedName, "", true, expectedOwnerName);
  }

  function test_register_PortalOwnerNameMissing() public {
    vm.expectRevert(PortalRegistry.PortalOwnerNameMissing.selector);
    vm.prank(user);
    portalRegistry.register(address(validPortalMock), expectedName, expectedDescription, true, "");
  }

  function test_register_PortalInvalid() public {
    vm.expectRevert(PortalRegistry.PortalInvalid.selector);
    vm.prank(user);
    portalRegistry.register(address(invalidPortalMock), expectedName, expectedDescription, true, expectedOwnerName);
  }

  function test_register_old_version_PortalInvalid() public {
    vm.expectRevert(PortalRegistry.PortalInvalid.selector);
    vm.prank(user);
    portalRegistry.register(address(oldVersionPortalMock), expectedName, expectedDescription, true, expectedOwnerName);
  }

  function test_revoke() public {
    address portalAddress = address(validPortalMock);
    vm.expectEmit();
    emit PortalRegistered(expectedName, expectedDescription, portalAddress);
    vm.prank(user);
    portalRegistry.register(portalAddress, expectedName, expectedDescription, true, expectedOwnerName);

    bool isRegistered = portalRegistry.isRegistered(address(validPortalMock));
    assertEq(isRegistered, true);

    Portal memory expectedPortal = Portal(
      address(validPortalMock),
      user,
      new address[](0),
      true,
      expectedName,
      expectedDescription,
      expectedOwnerName
    );

    Portal memory registeredPortal = portalRegistry.getPortalByAddress(address(validPortalMock));
    _assertPortal(registeredPortal, expectedPortal);

    vm.prank(address(0));
    emit PortalRevoked(address(validPortalMock));
    portalRegistry.revoke(address(validPortalMock));

    isRegistered = portalRegistry.isRegistered(address(validPortalMock));
    assertEq(isRegistered, false);

    vm.expectRevert(PortalRegistry.PortalNotRegistered.selector);
    portalRegistry.getPortalByAddress(address(validPortalMock));
  }

  function test_revoke_OnlyOwner() public {
    vm.prank(makeAddr("randomAddress"));
    vm.expectRevert("Ownable: caller is not the owner");
    portalRegistry.revoke(address(validPortalMock));
  }

  function test_revoke_NotRegistered() public {
    vm.prank(address(0));
    vm.expectRevert(PortalRegistry.PortalNotRegistered.selector);
    portalRegistry.revoke(makeAddr("randomAddress"));
  }

  function test_deployDefaultPortal() public {
    CorrectModuleV2 correctModule = new CorrectModuleV2();
    address[] memory modules = new address[](1);
    modules[0] = address(correctModule);
    vm.prank(user);
    portalRegistry.deployDefaultPortal(modules, expectedName, expectedDescription, true, expectedOwnerName);
  }

  function test_deployDefaultPortal_OnlyAllowlisted() public {
    CorrectModuleV2 correctModule = new CorrectModuleV2();
    address[] memory modules = new address[](1);
    modules[0] = address(correctModule);
    vm.expectRevert(PortalRegistry.OnlyAllowlisted.selector);
    vm.prank(makeAddr("InvalidUser"));
    portalRegistry.deployDefaultPortal(modules, expectedName, expectedDescription, true, expectedOwnerName);
  }

  function test_getPortals_PortalNotRegistered() public {
    vm.expectRevert(PortalRegistry.PortalNotRegistered.selector);
    portalRegistry.getPortalByAddress(address(validPortalMock));
  }

  function test_isRegistered() public {
    assertEq(portalRegistry.isRegistered(address(validPortalMock)), false);
    vm.prank(user);
    portalRegistry.register(address(validPortalMock), expectedName, expectedDescription, true, expectedOwnerName);
    assertEq(portalRegistry.isRegistered(address(validPortalMock)), true);
  }

  function test_isAllowlisted_Testnet() public {
    PortalRegistry testnetPortalRegistry = new PortalRegistry();
    vm.prank(address(0));
    testnetPortalRegistry.setIsTestnet(true);

    address userAddress = makeAddr("User");
    assertEq(testnetPortalRegistry.isAllowlisted(userAddress), true);
  }

  function test_isAllowlisted_Testnet_fail() public {
    PortalRegistry mainnetPortalRegistry = new PortalRegistry();
    address userAddress = makeAddr("User");
    assertEq(mainnetPortalRegistry.isAllowlisted(userAddress), false);
  }

  function test_isAllowlisted_Issuer() public {
    address userAddress = makeAddr("User");
    assertEq(portalRegistry.isAllowlisted(userAddress), false);
    vm.prank(address(0));
    portalRegistry.setIssuer(userAddress);
    assertEq(portalRegistry.isAllowlisted(userAddress), true);
  }

  function test_isAllowlisted_Issuer_fail() public {
    address userAddress = makeAddr("User");
    assertEq(portalRegistry.isAllowlisted(userAddress), false);
  }

  function test_isAllowlisted_TestnetAndIssuer() public {
    PortalRegistry testnetPortalRegistry = new PortalRegistry();
    vm.prank(address(0));
    testnetPortalRegistry.setIsTestnet(true);

    address userAddress = makeAddr("User");
    vm.prank(address(0));
    testnetPortalRegistry.setIssuer(userAddress);
    assertEq(testnetPortalRegistry.isAllowlisted(userAddress), true);
  }

  function test_isAllowlisted_TestnetAndIssuer_fail() public {
    PortalRegistry mainnetPortalRegistry = new PortalRegistry();
    address userAddress = makeAddr("User");
    assertEq(mainnetPortalRegistry.isAllowlisted(userAddress), false);
  }

  function _assertPortal(Portal memory portal1, Portal memory portal2) internal pure {
    assertEq(portal1.name, portal2.name);
    assertEq(portal1.description, portal2.description);
    assertEq(portal1.isRevocable, portal2.isRevocable);
    assertEq(portal1.ownerAddress, portal2.ownerAddress);
    assertEq(portal1.ownerName, portal2.ownerName);
  }
}
