// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { Router } from "../src/Router.sol";

contract RouterTest is Test {
  Router public router;
  address public attestationRegistry = makeAddr("attestationRegistry");
  address public moduleRegistry = makeAddr("moduleRegistry");
  address public portalRegistry = makeAddr("portalRegistry");
  address public schemaRegistry = makeAddr("schemaRegistry");
  address public user = makeAddr("user");

  event Initialized(uint8 version);
  event AttestationRegistryUpdated(address indexed registryAddress);
  event ModuleRegistryUpdated(address indexed registryAddress);
  event PortalRegistryUpdated(address indexed registryAddress);
  event SchemaRegistryUpdated(address indexed registryAddress);

  function setUp() public {
    router = new Router();
    router.initialize();
  }

  function testInitialize() public {
    vm.expectEmit();
    emit Initialized(1);
    Router testRouter = new Router();
    testRouter.initialize();
    vm.expectRevert("Initializable: contract is already initialized");
    testRouter.initialize();
  }

  function testUpdateAttestationRegistry() public {
    vm.expectEmit();
    emit AttestationRegistryUpdated(attestationRegistry);
    router.updateAttestationRegistry(attestationRegistry);
    assertEq(router.getAttestationRegistry(), attestationRegistry);
  }

  function testUpdateAttestationRegistryNotOwner() public {
    vm.prank(user);
    vm.expectRevert("Ownable: caller is not the owner");
    router.updateAttestationRegistry(attestationRegistry);
  }

  function testUpdateModuleRegistry() public {
    vm.expectEmit();
    emit ModuleRegistryUpdated(moduleRegistry);
    router.updateModuleRegistry(moduleRegistry);
    assertEq(router.getModuleRegistry(), moduleRegistry);
  }

  function testUpdateModuleRegistryNotOwner() public {
    vm.prank(user);
    vm.expectRevert("Ownable: caller is not the owner");
    router.updateModuleRegistry(moduleRegistry);
  }

  function testUpdatePortalRegistry() public {
    vm.expectEmit();
    emit PortalRegistryUpdated(portalRegistry);
    router.updatePortalRegistry(portalRegistry);
    assertEq(router.getPortalRegistry(), portalRegistry);
  }

  function testUpdatePortalRegistryNotOwner() public {
    vm.prank(user);
    vm.expectRevert("Ownable: caller is not the owner");
    router.updatePortalRegistry(portalRegistry);
  }

  function testUpdateSchemaRegistry() public {
    vm.expectEmit();
    emit SchemaRegistryUpdated(schemaRegistry);
    router.updateSchemaRegistry(schemaRegistry);
    assertEq(router.getSchemaRegistry(), schemaRegistry);
  }

  function testUpdateSchemaRegistryNotOwner() public {
    vm.prank(user);
    vm.expectRevert("Ownable: caller is not the owner");
    router.updateSchemaRegistry(schemaRegistry);
  }
}
