// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { IssuersModule } from "../../src/portals/IssuersModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";

contract IssuersModuleTest is Test {
  IssuersModule private issuersModule;
  AttestationPayload private attestationPayload;
  PortalRegistryMock private portalRegistry;

  address private moduleOwner = makeAddr("moduleOwner");
  address private userIssuer = makeAddr("userIssuer");

  function setUp() public {
    vm.startPrank(moduleOwner);

    portalRegistry = new PortalRegistryMock();
    issuersModule = new IssuersModule(address(portalRegistry));

    attestationPayload = AttestationPayload(bytes32("schema1"), 0, new bytes(0), new bytes(0));

    portalRegistry.setIssuer(userIssuer);

    vm.stopPrank();
  }

  function test_run() public {
    issuersModule.run(attestationPayload, "", userIssuer, 0);
    issuersModule.run(attestationPayload, "", moduleOwner, 0);
  }

  function test_run_Unauthorized() public {
    address user = makeAddr("user");
    vm.expectRevert(IssuersModule.UnauthorizedSender.selector);
    issuersModule.run(attestationPayload, "", user, 0);
  }
}
