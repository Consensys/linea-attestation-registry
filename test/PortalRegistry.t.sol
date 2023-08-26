// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { PortalRegistry } from "../src/PortalRegistry.sol";
import { AbstractPortal } from "../src/interface/AbstractPortal.sol";
import { CorrectModule } from "../src/example/CorrectModule.sol";
import { AttestationPayload, Portal } from "../src/types/Structs.sol";
// solhint-disable-next-line max-line-length
import { IERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/IERC165Upgradeable.sol";
import { Router } from "../src/Router.sol";
import { AttestationRegistryMock } from "./mocks/AttestationRegistryMock.sol";
import { ModuleRegistryMock } from "./mocks/ModuleRegistryMock.sol";

contract PortalRegistryTest is Test {
  address public user = makeAddr("user");
  Router public router;
  PortalRegistry public portalRegistry;
  address public moduleRegistryAddress;
  address public attestationRegistryAddress;
  string public expectedName = "Name";
  string public expectedDescription = "Description";
  ValidPortal public validPortal = new ValidPortal();
  InvalidPortal public invalidPortal = new InvalidPortal();

  event Initialized(uint8 version);
  event PortalRegistered(string name, string description, address portalAddress);

  function setUp() public {
    router = new Router();
    router.initialize();

    portalRegistry = new PortalRegistry();
    router.updatePortalRegistry(address(portalRegistry));

    moduleRegistryAddress = address(new ModuleRegistryMock());
    attestationRegistryAddress = address(new AttestationRegistryMock());
    vm.prank(address(0));
    portalRegistry.updateRouter(address(router));

    router.updateModuleRegistry(moduleRegistryAddress);
    router.updateAttestationRegistry(attestationRegistryAddress);
  }

  function test_alreadyInitialized() public {
    vm.expectRevert("Initializable: contract is already initialized");
    portalRegistry.initialize();
  }

  function test_updateRouter() public {
    PortalRegistry testPortalRegistry = new PortalRegistry();

    vm.prank(address(0));
    testPortalRegistry.updateRouter(address(1));
    address routerAddress = address(testPortalRegistry.router());
    assertEq(routerAddress, address(1));
  }

  function test_updateRouter_InvalidParameter() public {
    PortalRegistry testPortalRegistry = new PortalRegistry();

    vm.expectRevert(PortalRegistry.RouterInvalid.selector);
    vm.prank(address(0));
    testPortalRegistry.updateRouter(address(0));
  }

  function test_register() public {
    vm.expectEmit();
    emit PortalRegistered(expectedName, expectedDescription, address(validPortal));
    portalRegistry.register(address(validPortal), expectedName, expectedDescription, true);

    uint256 portalCount = portalRegistry.getPortalsCount();
    assertEq(portalCount, 1);

    Portal memory portal = portalRegistry.getPortalByAddress(address(validPortal));
    assertEq(portal.name, expectedName);
    assertEq(portal.description, expectedDescription);
    assertEq(portal.modules.length, 2);
  }

  function test_register_PortalAlreadyExists() public {
    portalRegistry.register(address(validPortal), expectedName, expectedDescription, true);
    vm.expectRevert(PortalRegistry.PortalAlreadyExists.selector);
    portalRegistry.register(address(validPortal), expectedName, expectedDescription, true);
  }

  function test_register_PortalAddressInvalid() public {
    vm.expectRevert(PortalRegistry.PortalAddressInvalid.selector);
    portalRegistry.register(address(0), expectedName, expectedDescription, true);

    vm.expectRevert(PortalRegistry.PortalAddressInvalid.selector);
    portalRegistry.register(user, expectedName, expectedDescription, true);
  }

  function test_register_PortalNameMissing() public {
    vm.expectRevert(PortalRegistry.PortalNameMissing.selector);
    portalRegistry.register(address(validPortal), "", expectedDescription, true);
  }

  function test_register_PortalDescriptionMissing() public {
    vm.expectRevert(PortalRegistry.PortalDescriptionMissing.selector);
    portalRegistry.register(address(validPortal), expectedName, "", true);
  }

  function test_register_PortalInvalid() public {
    vm.expectRevert(PortalRegistry.PortalInvalid.selector);
    portalRegistry.register(address(invalidPortal), expectedName, expectedDescription, true);
  }

  function test_deployDefaultPortal() public {
    CorrectModule correctModule = new CorrectModule();
    address[] memory modules = new address[](1);
    modules[0] = address(correctModule);
    portalRegistry.deployDefaultPortal(modules, expectedName, expectedDescription, true);
  }

  function test_getPortals_PortalNotRegistered() public {
    vm.expectRevert(PortalRegistry.PortalNotRegistered.selector);
    portalRegistry.getPortalByAddress(address(validPortal));
  }

  function test_isRegistered() public {
    assertEq(portalRegistry.isRegistered(address(validPortal)), false);
    portalRegistry.register(address(validPortal), expectedName, expectedDescription, true);
    assertEq(portalRegistry.isRegistered(address(validPortal)), true);
  }
}

contract ValidPortal is AbstractPortal, IERC165Upgradeable {
  function test() public {}

  function attest(
    AttestationPayload memory /*attestationPayload*/,
    bytes[] memory /*validationPayload*/
  ) external payable override {}

  function revoke(bytes32 /*attestationId*/, bytes32 /*replacedBy*/) external override {}

  function getModules() external pure override returns (address[] memory) {
    address[] memory modules = new address[](2);
    modules[0] = address(0);
    modules[1] = address(1);
    return modules;
  }

  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165Upgradeable).interfaceId;
  }
}

contract InvalidPortal {
  function test() public {}
}
