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
    uint attestationIdCounter = attestationRegistry.getAttestationIdCounter();
    uint16 versionNumber = attestationRegistry.getVersionNumber();
    Attestation memory attestation = Attestation(
      bytes32(keccak256(abi.encode((attestationIdCounter++)))),
      attestationPayload.schemaId,
      user,
      portal,
      attestationPayload.subject,
      block.timestamp,
      attestationPayload.expirationDate,
      false,
      versionNumber,
      attestationPayload.attestationData
    );
    emit AttestationRegistered(attestation);
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, user);

    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    _assertAttestation(attestation, registeredAttestation);
  }

  function test_attest_PortalNotRegistered(AttestationPayload memory attestationPayload) public {
    vm.expectRevert(AttestationRegistry.OnlyPortal.selector);
    vm.prank(user);
    attestationRegistry.attest(attestationPayload, user);
  }

  function test_revoke(AttestationPayload memory attestationPayload) public {
    uint attestationIdCounter = attestationRegistry.getAttestationIdCounter();

  vm.assume(attestation.attestationId != bytes32(0));
    attestation.portal = portal;
    attestation.attester = tx.origin;
    attestation.revoked = false;
    attestation.revocationDate = 0;
    attestation.replacedBy = bytes32(0);

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, user);
    bytes32 attestationId = bytes32(keccak256(abi.encode((attestationIdCounter))));

    // Assert initial state is a valid attestation
    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    assertFalse(registeredAttestation.revoked);
    assertEq(registeredAttestation.revocationDate, 0);
    assertEq(registeredAttestation.replacedBy, bytes32(0));

    // Do revoke the attestation
    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(attestationId, bytes32(0));
    attestationRegistry.revoke(attestationId, bytes32(0));
    vm.stopPrank();

    // Assert final state is a revoked attestation
    Attestation memory revokedAttestation = attestationRegistry.getAttestation(attestationId);
    assertTrue(revokedAttestation.revoked);
    assertEq(revokedAttestation.revocationDate, block.timestamp);
    assertEq(revokedAttestation.replacedBy, bytes32(0));
  }

  function test_revoke_AttestationNotAttested() public {
    vm.expectRevert(AttestationRegistry.AttestationNotAttested.selector);
    attestationRegistry.revoke(bytes32(uint256(1)),"");
  }

  function test_revoke_OnlyAttestingPortal(AttestationPayload memory attestationPayload) public {
    uint attestationIdCounter = attestationRegistry.getAttestationIdCounter();
    uint16 versionNumber = attestationRegistry.getVersionNumber();
    Attestation memory attestation = Attestation(
      bytes32(keccak256(abi.encode((attestationIdCounter++)))),
      attestationPayload.schemaId,
      user,
      portal,
      attestationPayload.subject,
      block.timestamp,
      attestationPayload.expirationDate,
      false,
      versionNumber,
      attestationPayload.attestationData
    );
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, user);

    vm.expectRevert(AttestationRegistry.OnlyAttestingPortal.selector);
    vm.prank(user);
    attestationRegistry.revoke(attestation.attestationId, "");
  }

  function test_revoke_AttestationNotRevocable(Attestation memory attestation) public {
    address nonRevocablePortalAddress = makeAddr("portal2");
    PortalRegistry(portalRegistryAddress).register(nonRevocablePortalAddress, "Name", "Description", false);

    vm.assume(attestation.attestationId != bytes32(0));
    attestation.portal = nonRevocablePortalAddress;
    attestation.attester = tx.origin;
    attestation.revoked = false;
    attestation.revocationDate = 0;
    attestation.replacedBy = bytes32(0);

    vm.startPrank(nonRevocablePortalAddress);
    attestationRegistry.attest(attestation);

    vm.expectRevert(AttestationRegistry.AttestationNotRevocable.selector);
    attestationRegistry.revoke(attestation.attestationId, "");
    vm.stopPrank();
  }

  function test_revoke_OnlyAttester(Attestation memory attestation) public {
    attestation.portal = portal;
    attestation.attester = user;

    vm.startPrank(portal);
    attestationRegistry.attest(attestation);

    vm.expectRevert(AttestationRegistry.OnlyAttester.selector);
    attestationRegistry.revoke(attestation.attestationId, "");
    vm.stopPrank();
  }

  function test_revokeAndReplace(
    Attestation memory attestationOrigin,
    Attestation memory attestationReplacement
  ) public {
    vm.assume(attestationOrigin.attestationId != bytes32(0));
    attestationOrigin.portal = portal;
    attestationOrigin.attester = tx.origin;
    attestationOrigin.revoked = false;
    attestationOrigin.revocationDate = 0;
    attestationOrigin.replacedBy = bytes32(0);

    vm.startPrank(portal);
    attestationRegistry.attest(attestationOrigin);
    attestationRegistry.attest(attestationReplacement);

    // Do revert and replace the attestation
    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(attestationOrigin.attestationId, attestationReplacement.attestationId);
    attestationRegistry.revoke(attestationOrigin.attestationId, attestationReplacement.attestationId);
    vm.stopPrank();

    // Assert final state is a revoked and replaced attestation
    Attestation memory revokedAttestation = attestationRegistry.getAttestation(attestationOrigin.attestationId);
    assertTrue(revokedAttestation.revoked);
    assertEq(revokedAttestation.revocationDate, block.timestamp);
    assertEq(revokedAttestation.replacedBy, attestationReplacement.attestationId);
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
    bool isRegistered = attestationRegistry.isRegistered(bytes32(uint256(1)));
    assertFalse(isRegistered);

    uint attestationIdCounter = attestationRegistry.getAttestationIdCounter();
    uint16 versionNumber = attestationRegistry.getVersionNumber();
    Attestation memory attestation = Attestation(
      keccak256(abi.encode((attestationIdCounter++))),
      attestationPayload.schemaId,
      user,
      portal,
      attestationPayload.subject,
      block.timestamp,
      attestationPayload.expirationDate,
      false,
      versionNumber,
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
    uint attestationIdCounter = attestationRegistry.getAttestationIdCounter();
    uint16 versionNumber = attestationRegistry.getVersionNumber();
    Attestation memory attestation = Attestation(
      keccak256(abi.encode((attestationIdCounter++))),
      attestationPayload.schemaId,
      user,
      portal,
      attestationPayload.subject,
      block.timestamp,
      attestationPayload.expirationDate,
      false,
      versionNumber,
      attestationPayload.attestationData
    );

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, user);

    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    _assertAttestation(attestation, registeredAttestation);
  }

  function test_getAttestation_AttestationNotAttested() public {
    vm.expectRevert(AttestationRegistry.AttestationNotAttested.selector);
    attestationRegistry.getAttestation(bytes32(uint256(1)));
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
