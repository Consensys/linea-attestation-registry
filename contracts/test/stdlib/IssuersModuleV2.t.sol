// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { IssuersModuleV2 } from "../../../src/stdlib/IssuersModuleV2.sol";
import { OperationType } from "../../../src/types/Enums.sol";
import { AttestationPayload } from "../../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";

contract IssuersModuleV2Test is Test {
  IssuersModuleV2 private issuersModule;
  PortalRegistryMock private portalRegistry;

  address private issuerAddress = makeAddr("issuer");
  address private portal = makeAddr("portal");

  function setUp() public {
    vm.startPrank(address(0));

    portalRegistry = new PortalRegistryMock();
    issuersModule = new IssuersModuleV2(address(portalRegistry));

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
    issuersModule.run(
      attestationPayload,
      "",
      makeAddr("sender"),
      0,
      address(makeAddr("attester")),
      portal,
      OperationType.Attest
    );
  }

  function test_run_rawSubject() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("schema1"),
      0,
      abi.encodePacked(issuerAddress),
      new bytes(0)
    );
    issuersModule.run(
      attestationPayload,
      "",
      makeAddr("sender"),
      0,
      address(makeAddr("attester")),
      portal,
      OperationType.Attest
    );
  }

  function test_run_unauthorized_encodedSubject() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("schema1"),
      0,
      abi.encode(makeAddr("user")),
      new bytes(0)
    );
    vm.expectRevert(IssuersModuleV2.UnauthorizedSubject.selector);
    issuersModule.run(
      attestationPayload,
      "",
      makeAddr("sender"),
      0,
      address(makeAddr("attester")),
      portal,
      OperationType.Attest
    );
  }

  function test_run_unauthorized_rawSubject() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("schema1"),
      0,
      abi.encodePacked(makeAddr("user")),
      new bytes(0)
    );
    vm.expectRevert(IssuersModuleV2.UnauthorizedSubject.selector);
    issuersModule.run(
      attestationPayload,
      "",
      makeAddr("sender"),
      0,
      address(makeAddr("attester")),
      portal,
      OperationType.Attest
    );
  }
}
