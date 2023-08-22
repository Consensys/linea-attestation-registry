// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { PortalRegistry } from "../src/PortalRegistry.sol";
import { AbstractPortal } from "../src/interface/AbstractPortal.sol";
import { CorrectModule } from "../src/example/CorrectModule.sol";
import { AttestationPayload, Portal } from "../src/types/Structs.sol";
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
  event DefaultPortalInitialized(address[] modules);

  function setUp() public {
    portalRegistry = new PortalRegistry();
  }

  function test_initialize() public {
    vm.expectEmit();
    emit Initialized(1);
    portalRegistry.initialize(address(1), address(2));

    vm.expectRevert("Initializable: contract is already initialized");
    portalRegistry.initialize(address(1), address(2));
  }

  function test_register() public {
    vm.expectEmit();
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

  function test_deployDefaultPortal() public {
    CorrectModule correctModule = new CorrectModule();
    address[] memory modules = new address[](1);
    modules[0] = address(correctModule);
    vm.expectEmit();
    emit DefaultPortalInitialized(modules);
    portalRegistry.deployDefaultPortal(modules, expectedName, expectedDescription);

    // vm.expectEmit(true, true, true, true);
    //     emit PortalRegistered(expectedName, expectedDescription, address(validPortal));
    //     uint256 portalCount = portalRegistry.getPortalsCount();
    //     assertEq(portalCount, 1);

    //     Portal memory portal = portalRegistry.getPortalByAddress(address(validPortal));
    //     assertEq(portal.name, expectedName);
    //     assertEq(portal.description, expectedDescription);
    //     assertEq(portal.modules.length, 2);
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

contract ValidPortal is AbstractPortal, IERC165 {
  function test() public {}

  function attest(
    AttestationPayload memory /*attestationPayload*/,
    bytes[] memory /*validationPayload*/
  ) external payable override {}

  function getModules() external pure override returns (address[] memory) {
    address[] memory modules = new address[](2);
    modules[0] = address(0);
    modules[1] = address(1);
    return modules;
  }

  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}

contract InvalidPortal {
  function test() public {}
}
