// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { PortalRegistry } from "../src/PortalRegistry.sol";
import { IPortal } from "../src/interface/IPortal.sol";
import { Portal } from "../src/struct/Portal.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

contract PortalRegistryTest is Test {
  address public user = makeAddr("user");
  PortalRegistry public portalRegistry;
  string public expectedName = "Name";
  string public expectedDescription = "Description";
  ValidPortal public validPortal = new ValidPortal();
  InvalidPortal public invalidPortal = new InvalidPortal();

  event Initialized(uint8 version);
  event PortalRegistered(string name, string description, address moduleAddress);

  function setUp() public {
    portalRegistry = new PortalRegistry();
  }

  function test_initialize() public {
    vm.expectEmit();
    emit Initialized(1);
    portalRegistry.initialize();

    vm.expectRevert("Initializable: contract is already initialized");
    portalRegistry.initialize();
  }

  function test_register() public {
    vm.expectEmit(true, true, true, true);
    emit PortalRegistered(expectedName, expectedDescription, address(validPortal));
    portalRegistry.register(address(validPortal), expectedName, expectedDescription);

    uint256 portalCount = portalRegistry.getPortalsCount();
    assertEq(portalCount, 1);

    Portal memory portal = portalRegistry.getPortalByAddress(address(validPortal));
    assertEq(portal.name, expectedName);
    assertEq(portal.description, expectedDescription);
    assertEq(portal.modules.length, 2);
  }

  function test_register_PortalAlreadyExists() public {
    portalRegistry.register(address(validPortal), expectedName, expectedDescription);
    vm.expectRevert(PortalRegistry.PortalAlreadyExists.selector);
    portalRegistry.register(address(validPortal), expectedName, expectedDescription);
  }

  function test_register_PortalAddressInvalid() public {
    vm.expectRevert(PortalRegistry.PortalAddressInvalid.selector);
    portalRegistry.register(address(0), expectedName, expectedDescription);

    vm.expectRevert(PortalRegistry.PortalAddressInvalid.selector);
    portalRegistry.register(user, expectedName, expectedDescription);
  }

  function test_register_PortalNameMissing() public {
    vm.expectRevert(PortalRegistry.PortalNameMissing.selector);
    portalRegistry.register(address(validPortal), "", expectedDescription);
  }

  function test_register_PortalDescriptionMissing() public {
    vm.expectRevert(PortalRegistry.PortalDescriptionMissing.selector);
    portalRegistry.register(address(validPortal), expectedName, "");
  }

  function test_register_PortalInvalid() public {
    vm.expectRevert(PortalRegistry.PortalInvalid.selector);
    portalRegistry.register(address(invalidPortal), expectedName, expectedDescription);
  }

  function test_getPortals_PortalNotRegistered() public {
    vm.expectRevert(PortalRegistry.PortalNotRegistered.selector);
    portalRegistry.getPortalByAddress(address(validPortal));
  }

  function test_isRegistered() public {
    assertEq(portalRegistry.isRegistered(address(validPortal)), false);
    portalRegistry.register(address(validPortal), expectedName, expectedDescription);
    assertEq(portalRegistry.isRegistered(address(validPortal)), true);
  }
}

contract ValidPortal is IPortal, IERC165 {
  function attest(bytes32 /*schemaId*/, bytes memory /*attestationData*/) external pure returns (bool) {
    return true;
  }

  function getModules() external pure returns (address[] memory) {
    address[] memory modules = new address[](2);
    modules[0] = address(0);
    modules[1] = address(1);
    return modules;
  }

  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return interfaceID == type(IPortal).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}

contract InvalidPortal {}
