// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { IssuersModule } from "../../../src/stdlib/IssuersModule.sol";
import { AttestationPayload } from "../../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";

contract IssuersModuleTest is Test {
  IssuersModule private issuersModule;
  PortalRegistryMock private portalRegistry;

  address private issuerAddress = makeAddr("issuer");

  function setUp() public {
    vm.startPrank(address(0));

    portalRegistry = new PortalRegistryMock();
    issuersModule = new IssuersModule(address(portalRegistry));

    portalRegistry.setIssuer(issuerAddress);

    vm.stopPrank();
  }

  function test_setup() public view {
    assertEq(portalRegistry.isIssuer(issuerAddress), true);
  }

  function test_run_encodedSubject() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("schema1"),
      0,
      abi.encode(issuerAddress),
      new bytes(0)
    );
    issuersModule.run(attestationPayload, "", makeAddr("sender"), 0);
  }

  function test_run_rawSubject() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("schema1"),
      0,
      abi.encodePacked(issuerAddress),
      new bytes(0)
    );
    issuersModule.run(attestationPayload, "", makeAddr("sender"), 0);
  }

  function test_run_unauthorized_encodedSubject() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("schema1"),
      0,
      abi.encode(makeAddr("user")),
      new bytes(0)
    );
    vm.expectRevert(IssuersModule.UnauthorizedSubject.selector);
    issuersModule.run(attestationPayload, "", makeAddr("sender"), 0);
  }

  function test_run_unauthorized_rawSubject() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("schema1"),
      0,
      abi.encodePacked(makeAddr("user")),
      new bytes(0)
    );
    vm.expectRevert(IssuersModule.UnauthorizedSubject.selector);
    issuersModule.run(attestationPayload, "", makeAddr("sender"), 0);
  }

  function test_run_unauthorized_InvalidSubject() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("schema1"),
      0,
      abi.encode("randomString"),
      new bytes(0)
    );
    vm.expectRevert(IssuersModule.UnauthorizedSubject.selector);
    issuersModule.run(attestationPayload, "", makeAddr("sender"), 0);
    vm.stopPrank();
  }
}
