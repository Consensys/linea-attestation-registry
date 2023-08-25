// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { AttestationRegistry } from "../src/AttestationRegistry.sol";
import { PortalRegistryMock } from "./mocks/PortalRegistryMock.sol";
import { PortalRegistry } from "../src/PortalRegistry.sol";
import { SchemaRegistryMock } from "./mocks/SchemaRegistryMock.sol";
import { Attestation, AttestationPayload, Portal } from "../src/types/Structs.sol";
import { Router } from "../src/Router.sol";

contract AttestationRegistryTest is Test {
  address public portal = makeAddr("portal");
  address public user = makeAddr("user");
  Router public router;
  AttestationRegistry public attestationRegistry;
  address public portalRegistryAddress;
  address public schemaRegistryAddress;

  event Initialized(uint8 version);
  event AttestationRegistered(Attestation attestation);
  event AttestationRevoked(bytes32 attestationId, bytes32 replacedBy);
  event VersionUpdated(uint16 version);

  function setUp() public {
    router = new Router();
    router.initialize();

    attestationRegistry = new AttestationRegistry();
    router.updateAttestationRegistry(address(attestationRegistry));

    portalRegistryAddress = address(new PortalRegistryMock());
    schemaRegistryAddress = address(new SchemaRegistryMock());
    vm.prank(address(0));
    attestationRegistry.updateRouter(address(router));

    router.updatePortalRegistry(portalRegistryAddress);
    router.updateSchemaRegistry(schemaRegistryAddress);

    PortalRegistry(portalRegistryAddress).register(portal, "Name", "Description", true);
  }

  function test_initialize_ContractAlreadyInitialized() public {
    vm.expectRevert("Initializable: contract is already initialized");
    attestationRegistry.initialize();
  }

  function test_updateRouter() public {
    AttestationRegistry testAttestationRegistry = new AttestationRegistry();

    vm.prank(address(0));
    testAttestationRegistry.updateRouter(address(1));
    address routerAddress = address(testAttestationRegistry.router());
    assertEq(routerAddress, address(1));
  }

  function test_updateRouter_InvalidParameter() public {
    AttestationRegistry testAttestationRegistry = new AttestationRegistry();

    vm.expectRevert(AttestationRegistry.RouterInvalid.selector);
    vm.prank(address(0));
    testAttestationRegistry.updateRouter(address(0));
  }

  function test_attest(AttestationPayload memory attestationPayload) public {
    vm.expectEmit(true, true, true, true);
    Attestation memory attestation = Attestation(
      bytes32(keccak256(abi.encode((1)))),
      attestationPayload.schemaId,
      user,
      portal,
      attestationPayload.subject,
      block.timestamp,
      attestationPayload.expirationDate,
      false,
      0,
      bytes32(0),
      0,
      attestationPayload.attestationData
    );
    emit AttestationRegistered(attestation);
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, user);

    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    _assertAttestation(attestation, registeredAttestation);

    attestation = Attestation(
      bytes32(keccak256(abi.encode((2)))),
      attestationPayload.schemaId,
      user,
      portal,
      attestationPayload.subject,
      block.timestamp,
      attestationPayload.expirationDate,
      false,
      0,
      bytes32(0),
      0,
      attestationPayload.attestationData
    );
    emit AttestationRegistered(attestation);
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, user);

    registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    _assertAttestation(attestation, registeredAttestation);
  }

  function test_attest_PortalNotRegistered(AttestationPayload memory attestationPayload) public {
    vm.expectRevert(AttestationRegistry.OnlyPortal.selector);
    vm.prank(user);
    attestationRegistry.attest(attestationPayload, user);
  }

  function test_revoke(AttestationPayload memory attestationPayload) public {
    vm.startPrank(portal, user);

    attestationRegistry.attest(attestationPayload, user);

    // Assert initial state is a valid attestation
    Attestation memory registeredAttestation = attestationRegistry.getAttestation(bytes32(keccak256(abi.encode((1)))));

    assertEq(registeredAttestation.attestationId, bytes32(keccak256(abi.encode((1)))));
    assertFalse(registeredAttestation.revoked);
    assertEq(registeredAttestation.revocationDate, 0);
    assertEq(registeredAttestation.replacedBy, bytes32(0));
    assertEq(registeredAttestation.portal, portal);
    assertEq(registeredAttestation.attester, user);

    // Do revoke the attestation
    vm.expectEmit();
    emit AttestationRevoked(bytes32(keccak256(abi.encode((1)))), bytes32(0));
    attestationRegistry.revoke(bytes32(keccak256(abi.encode((1)))), bytes32(0));

    vm.stopPrank();

    // Assert final state is a revoked attestation
    Attestation memory revokedAttestation = attestationRegistry.getAttestation(bytes32(keccak256(abi.encode((1)))));
    assertTrue(revokedAttestation.revoked);
    assertEq(revokedAttestation.revocationDate, block.timestamp);
    assertEq(revokedAttestation.replacedBy, bytes32(0));
  }

  function test_revoke_AttestationAlreadyRevoked(AttestationPayload memory attestationPayload) public {
    vm.startPrank(portal, user);
    attestationRegistry.attest(attestationPayload, user);

    vm.expectEmit();
    emit AttestationRevoked(bytes32(keccak256(abi.encode((1)))), bytes32(0));
    attestationRegistry.revoke(bytes32(keccak256(abi.encode((1)))), "");

    vm.expectRevert(AttestationRegistry.AlreadyRevoked.selector);
    attestationRegistry.revoke(bytes32(keccak256(abi.encode((1)))), "");

    vm.stopPrank();
  }

  function test_revoke_AttestationNotAttested() public {
    vm.expectRevert(AttestationRegistry.AttestationNotAttested.selector);
    attestationRegistry.revoke(bytes32(keccak256(abi.encode((1)))), "");
  }

  function test_revoke_OnlyAttestingPortal(AttestationPayload memory attestationPayload) public {
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, user);

    vm.expectRevert(AttestationRegistry.OnlyAttestingPortal.selector);
    vm.prank(user);
    attestationRegistry.revoke(bytes32(keccak256(abi.encode((1)))), "");
  }

  function test_revoke_AttestationNotRevocable(AttestationPayload memory attestationPayload) public {
    address nonRevocablePortalAddress = makeAddr("nonRevocablePortalAddress");
    PortalRegistry(portalRegistryAddress).register(nonRevocablePortalAddress, "Name", "Description", false);

    vm.startPrank(nonRevocablePortalAddress, user);

    attestationRegistry.attest(attestationPayload, user);

    vm.expectRevert(AttestationRegistry.AttestationNotRevocable.selector);
    attestationRegistry.revoke(bytes32(keccak256(abi.encode((1)))), "");

    vm.stopPrank();
  }

  function test_revoke_OnlyAttester(AttestationPayload memory attestationPayload) public {
    vm.startPrank(portal);

    attestationRegistry.attest(attestationPayload, user);

    vm.expectRevert(AttestationRegistry.OnlyAttester.selector);
    attestationRegistry.revoke(bytes32(keccak256(abi.encode((1)))), "");

    vm.stopPrank();
  }

  function test_revokeAndReplace(
    AttestationPayload memory attestationPayloadOrigin,
    AttestationPayload memory attestationPayloadReplacement
  ) public {
    vm.startPrank(portal, user);

    attestationRegistry.attest(attestationPayloadOrigin, user);
    attestationRegistry.attest(attestationPayloadReplacement, user);

    // Do revert and replace the attestation
    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(bytes32(keccak256(abi.encode((1)))), bytes32(keccak256(abi.encode((2)))));
    attestationRegistry.revoke(bytes32(keccak256(abi.encode((1)))), bytes32(keccak256(abi.encode((2)))));

    vm.stopPrank();

    // Assert final state is a revoked and replaced attestation
    Attestation memory revokedAttestation = attestationRegistry.getAttestation(bytes32(keccak256(abi.encode((1)))));
    assertTrue(revokedAttestation.revoked);
    assertEq(revokedAttestation.revocationDate, block.timestamp);
    assertEq(revokedAttestation.replacedBy, bytes32(keccak256(abi.encode((2)))));
  }

  function test_isRevocable() public {
    bool isRevocable = attestationRegistry.isRevocable(portal);
    assertTrue(isRevocable);
  }

  function test_isNotRevocable() public {
    address nonRevocablePortal = makeAddr("nonRevocablePortal");
    PortalRegistry(portalRegistryAddress).register(nonRevocablePortal, "Name", "Description", false);

    bool isRevocable = attestationRegistry.isRevocable(nonRevocablePortal);
    assertFalse(isRevocable);
  }

  function test_isRegistered(AttestationPayload memory attestationPayload) public {
    bool isRegistered = attestationRegistry.isRegistered(bytes32(keccak256(abi.encode((1)))));
    assertFalse(isRegistered);

    Attestation memory attestation = Attestation(
      keccak256(abi.encode((1))),
      attestationPayload.schemaId,
      user,
      portal,
      attestationPayload.subject,
      block.timestamp,
      attestationPayload.expirationDate,
      false,
      0,
      bytes32(0),
      0,
      attestationPayload.attestationData
    );

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, user);

    isRegistered = attestationRegistry.isRegistered(attestation.attestationId);
    assertTrue(isRegistered);

    isRegistered = attestationRegistry.isRegistered(bytes32(0));
    assertFalse(isRegistered);
  }

  function test_getAttestation(AttestationPayload memory attestationPayload) public {
    Attestation memory attestation = Attestation(
      keccak256(abi.encode((1))),
      attestationPayload.schemaId,
      user,
      portal,
      attestationPayload.subject,
      block.timestamp,
      attestationPayload.expirationDate,
      false,
      0,
      bytes32(0),
      0,
      attestationPayload.attestationData
    );

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, user);

    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    _assertAttestation(attestation, registeredAttestation);
  }

  function test_getAttestation_AttestationNotAttested() public {
    vm.expectRevert(AttestationRegistry.AttestationNotAttested.selector);
    attestationRegistry.getAttestation(bytes32(keccak256(abi.encode((1)))));
  }

  function test_incrementVersionNumber() public {
    assertEq(attestationRegistry.getVersionNumber(), 0);
    for (uint16 i = 1; i <= 5; i++) {
      vm.expectEmit(true, true, true, true);
      emit VersionUpdated(i);
      vm.prank(address(0));
      uint256 version = attestationRegistry.incrementVersionNumber();
      assertEq(version, i);
      uint16 newVersion = attestationRegistry.getVersionNumber();
      assertEq(newVersion, i);
    }
  }

  function test_getAttestationIdCounter(AttestationPayload memory attestationPayload) public {
    uint version = attestationRegistry.getAttestationIdCounter();

    assertEq(version, 0);

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, user);

    version = attestationRegistry.getAttestationIdCounter();
    assertEq(version, 1);

    attestationRegistry.attest(attestationPayload, user);

    version = attestationRegistry.getAttestationIdCounter();
    assertEq(version, 2);

    vm.stopPrank();
  }

  function _assertAttestation(Attestation memory attestation1, Attestation memory attestation2) internal {
    assertEq(attestation1.attestationId, attestation2.attestationId);
    assertEq(attestation1.schemaId, attestation2.schemaId);
    assertEq(attestation1.portal, attestation2.portal);
    assertEq(attestation1.subject, attestation2.subject);
    assertEq(attestation1.attester, attestation2.attester);
    assertEq(attestation1.attestedDate, attestation2.attestedDate);
    assertEq(attestation1.expirationDate, attestation2.expirationDate);
    assertEq(attestation1.revoked, attestation2.revoked);
    assertEq(attestation1.version, attestation2.version);
    assertEq(attestation1.attestationData.length, attestation2.attestationData.length);
  }
}
