// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { AttestationRegistry } from "../src/AttestationRegistry.sol";
import { PortalRegistryMock } from "./mocks/PortalRegistryMock.sol";
import { PortalRegistry } from "../src/PortalRegistry.sol";
import { SchemaRegistryMock } from "./mocks/SchemaRegistryMock.sol";
import { Attestation, AttestationPayload } from "../src/types/Structs.sol";
import { Router } from "../src/Router.sol";

contract AttestationRegistryTest is Test {
  address public portal = makeAddr("portal");
  address public user = makeAddr("user");
  address public attester = makeAddr("attester");
  Router public router;
  AttestationRegistry public attestationRegistry;
  address public portalRegistryAddress;
  address public schemaRegistryAddress;

  event Initialized(uint8 version);
  event AttestationRegistered(bytes32 indexed attestationId);
  event BulkAttestationsRegistered(Attestation[] attestations);
  event AttestationReplaced(bytes32 attestationId, bytes32 replacedBy);
  event AttestationRevoked(bytes32 attestationId);
  event BulkAttestationsRevoked(bytes32[] attestationId);
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

    PortalRegistry(portalRegistryAddress).register(portal, "Name", "Description", true, "Owner name");
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
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);

    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");

    Attestation memory attestation = _createAttestation(attestationPayload, 1);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered(attestation.attestationId);
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    _assertAttestation(attestation, registeredAttestation);
  }

  function test_attest_SchemaNotRegistered(AttestationPayload memory attestationPayload) public {
    vm.expectRevert(AttestationRegistry.SchemaNotRegistered.selector);
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, attester);
  }

  function test_attest_AttestationSubjectFieldEmpty(AttestationPayload memory attestationPayload) public {
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    attestationPayload.subject = "";

    vm.expectRevert(AttestationRegistry.AttestationSubjectFieldEmpty.selector);
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, attester);
  }

  function test_attest_AttestationDataFieldEmpty(AttestationPayload memory attestationPayload) public {
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");
    attestationPayload.subject = "subject";

    attestationPayload.attestationData = "";

    vm.expectRevert(AttestationRegistry.AttestationDataFieldEmpty.selector);
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, attester);
  }

  function test_attest_PortalNotRegistered(AttestationPayload memory attestationPayload) public {
    vm.expectRevert(AttestationRegistry.OnlyPortal.selector);
    vm.prank(user);
    attestationRegistry.attest(attestationPayload, attester);
  }

  function test_bulkAttest(AttestationPayload[2] memory attestationsPayloads) public {
    vm.assume(attestationsPayloads[0].subject.length != 0);
    vm.assume(attestationsPayloads[0].attestationData.length != 0);
    vm.assume(attestationsPayloads[1].subject.length != 0);
    vm.assume(attestationsPayloads[1].attestationData.length != 0);

    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationsPayloads[0].schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    attestationsPayloads[1].schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");

    Attestation memory attestation1 = _createAttestation(attestationsPayloads[0], 1);
    Attestation memory attestation2 = _createAttestation(attestationsPayloads[1], 2);

    Attestation[] memory attestations = new Attestation[](2);
    attestations[0] = attestation1;
    attestations[1] = attestation2;

    AttestationPayload[] memory payloadsToAttest = new AttestationPayload[](2);
    payloadsToAttest[0] = attestationsPayloads[0];
    payloadsToAttest[1] = attestationsPayloads[1];

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered(attestations[0].attestationId);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered(attestations[1].attestationId);
    vm.prank(portal);

    attestationRegistry.bulkAttest(payloadsToAttest, attester);
  }

  function test_massImport(AttestationPayload[2] memory attestationsPayloads) public {
    vm.assume(attestationsPayloads[0].subject.length != 0);
    vm.assume(attestationsPayloads[0].attestationData.length != 0);
    vm.assume(attestationsPayloads[1].subject.length != 0);
    vm.assume(attestationsPayloads[1].attestationData.length != 0);

    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationsPayloads[0].schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    attestationsPayloads[1].schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");

    AttestationPayload[] memory payloadsToAttest = new AttestationPayload[](2);
    payloadsToAttest[0] = attestationsPayloads[0];
    payloadsToAttest[1] = attestationsPayloads[1];

    bool isRegistered1 = attestationRegistry.isRegistered(bytes32(abi.encode(1)));
    assertFalse(isRegistered1);
    bool isRegistered2 = attestationRegistry.isRegistered(bytes32(abi.encode(2)));
    assertFalse(isRegistered2);

    vm.prank(address(0));
    attestationRegistry.massImport(payloadsToAttest, portal);

    isRegistered1 = attestationRegistry.isRegistered(bytes32(abi.encode(1)));
    assertTrue(isRegistered1);
    isRegistered2 = attestationRegistry.isRegistered(bytes32(abi.encode(2)));
    assertTrue(isRegistered2);
  }

  function test_replace(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);

    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");

    Attestation memory attestation = _createAttestation(attestationPayload, 1);
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    vm.prank(portal);
    vm.expectEmit(true, true, true, true);
    emit AttestationReplaced(attestation.attestationId, bytes32(abi.encode(2)));
    attestationRegistry.replace(attestation.attestationId, attestationPayload, attester);
  }

  function test_bulkReplace(AttestationPayload[2] memory attestationPayloads) public {
    vm.assume(attestationPayloads[0].subject.length != 0);
    vm.assume(attestationPayloads[0].attestationData.length != 0);
    vm.assume(attestationPayloads[1].subject.length != 0);
    vm.assume(attestationPayloads[1].attestationData.length != 0);

    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayloads[0].schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    attestationPayloads[1].schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");

    Attestation memory attestation1 = _createAttestation(attestationPayloads[0], 1);
    Attestation memory attestation2 = _createAttestation(attestationPayloads[1], 2);

    Attestation[] memory attestations = new Attestation[](2);
    attestations[0] = attestation1;
    attestations[1] = attestation2;

    AttestationPayload[] memory payloadsToAttest = new AttestationPayload[](2);
    payloadsToAttest[0] = attestationPayloads[0];
    payloadsToAttest[1] = attestationPayloads[1];

    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = attestation1.attestationId;
    attestationIds[1] = attestation2.attestationId;

    vm.startPrank(portal);
    attestationRegistry.bulkAttest(payloadsToAttest, attester);

    attestationRegistry.bulkReplace(attestationIds, payloadsToAttest, attester);
  }

  function test_revoke(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");
    vm.startPrank(portal, attester);
    attestationRegistry.attest(attestationPayload, attester);
    // Assert initial state is a valid attestation
    bytes32 attestationId = bytes32(abi.encode(1));
    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestationId);

    assertEq(registeredAttestation.attestationId, bytes32(abi.encode(1)));
    assertFalse(registeredAttestation.revoked);
    assertEq(registeredAttestation.revocationDate, 0);
    assertEq(registeredAttestation.portal, portal);
    assertEq(registeredAttestation.attester, attester);

    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(attestationId);
    attestationRegistry.revoke(attestationId);
    vm.stopPrank();

    // Assert final state is a revoked attestation
    Attestation memory revokedAttestation = attestationRegistry.getAttestation(bytes32(abi.encode(1)));
    assertTrue(revokedAttestation.revoked);
    assertEq(revokedAttestation.revocationDate, block.timestamp);
  }

  function test_revoke_AttestationAlreadyRevoked(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");
    vm.startPrank(portal, attester);
    attestationRegistry.attest(attestationPayload, attester);

    vm.expectEmit();
    emit AttestationRevoked(bytes32(abi.encode(1)));
    attestationRegistry.revoke(bytes32(abi.encode(1)));

    vm.expectRevert(AttestationRegistry.AlreadyRevoked.selector);
    attestationRegistry.revoke(bytes32(abi.encode(1)));

    vm.stopPrank();
  }

  function test_revoke_AttestationNotAttested() public {
    vm.expectRevert(AttestationRegistry.AttestationNotAttested.selector);
    attestationRegistry.revoke(bytes32(abi.encode(1)));
  }

  function test_revoke_OnlyAttestingPortal(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    vm.expectRevert(AttestationRegistry.OnlyAttestingPortal.selector);
    vm.prank(user);
    attestationRegistry.revoke(bytes32(abi.encode(1)));
  }

  function test_revoke_AttestationNotRevocable(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    address nonRevocablePortalAddress = makeAddr("nonRevocablePortalAddress");
    PortalRegistry(portalRegistryAddress).register(
      nonRevocablePortalAddress,
      "Name",
      "Description",
      false,
      "Owner name"
    );

    vm.startPrank(nonRevocablePortalAddress, attester);

    attestationRegistry.attest(attestationPayload, attester);

    vm.expectRevert(AttestationRegistry.AttestationNotRevocable.selector);
    attestationRegistry.revoke(bytes32(abi.encode(1)));

    vm.stopPrank();
  }

  function test_bulkRevoke(AttestationPayload[3] memory attestationPayloads) public {
    vm.assume(attestationPayloads[0].subject.length != 0);
    vm.assume(attestationPayloads[0].attestationData.length != 0);
    vm.assume(attestationPayloads[1].subject.length != 0);
    vm.assume(attestationPayloads[1].attestationData.length != 0);
    vm.assume(attestationPayloads[2].subject.length != 0);
    vm.assume(attestationPayloads[2].attestationData.length != 0);

    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayloads[0].schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    attestationPayloads[1].schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    attestationPayloads[2].schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");

    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    vm.startPrank(portal, attester);

    attestationRegistry.attest(attestationPayloads[0], attester);
    attestationRegistry.attest(attestationPayloads[1], attester);
    attestationRegistry.attest(attestationPayloads[2], attester);

    bytes32 attestationId1 = bytes32(abi.encode(1));
    bytes32 attestationId2 = bytes32(abi.encode(2));
    bytes32 attestationId3 = bytes32(abi.encode(3));

    // Assert initial state is a valid attestation
    Attestation memory registeredAttestation1 = attestationRegistry.getAttestation(attestationId1);

    assertEq(registeredAttestation1.attestationId, attestationId1);
    assertFalse(registeredAttestation1.revoked);
    assertEq(registeredAttestation1.revocationDate, 0);
    assertEq(registeredAttestation1.portal, portal);
    assertEq(registeredAttestation1.attester, attester);

    Attestation memory registeredAttestation2 = attestationRegistry.getAttestation(attestationId2);

    assertEq(registeredAttestation2.attestationId, attestationId2);
    assertFalse(registeredAttestation2.revoked);
    assertEq(registeredAttestation2.revocationDate, 0);
    assertEq(registeredAttestation2.portal, portal);
    assertEq(registeredAttestation2.attester, attester);

    bytes32[] memory attestationsToRevoke = new bytes32[](2);
    attestationsToRevoke[0] = attestationId1;
    attestationsToRevoke[1] = attestationId2;
    bytes32[] memory replacingAttestations = new bytes32[](2);
    replacingAttestations[0] = bytes32(0);
    replacingAttestations[1] = attestationId3;

    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(attestationsToRevoke[0]);
    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(attestationsToRevoke[1]);

    attestationRegistry.bulkRevoke(attestationsToRevoke);
    vm.stopPrank();

    // Assert final state is a revoked attestation and a replaced attestation
    Attestation memory revokedAttestation1 = attestationRegistry.getAttestation(attestationId1);
    assertTrue(revokedAttestation1.revoked);
    assertEq(revokedAttestation1.revocationDate, block.timestamp);

    Attestation memory revokedAttestation2 = attestationRegistry.getAttestation(attestationId2);
    assertTrue(revokedAttestation2.revoked);
    assertEq(revokedAttestation2.revocationDate, block.timestamp);
  }

  function test_isRevocable() public {
    bool isRevocable = attestationRegistry.isRevocable(portal);
    assertTrue(isRevocable);
  }

  function test_isNotRevocable() public {
    address nonRevocablePortal = makeAddr("nonRevocablePortal");
    PortalRegistry(portalRegistryAddress).register(nonRevocablePortal, "Name", "Description", false, "Owner name");

    bool isRevocable = attestationRegistry.isRevocable(nonRevocablePortal);
    assertFalse(isRevocable);
  }

  function test_isRegistered(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    bool isRegistered = attestationRegistry.isRegistered(bytes32(abi.encode(1)));
    assertFalse(isRegistered);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    Attestation memory attestation = _createAttestation(attestationPayload, 1);

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    isRegistered = attestationRegistry.isRegistered(attestation.attestationId);
    assertTrue(isRegistered);

    isRegistered = attestationRegistry.isRegistered(bytes32(0));
    assertFalse(isRegistered);
  }

  function test_getAttestation(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    Attestation memory attestation = _createAttestation(attestationPayload, 1);

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    _assertAttestation(attestation, registeredAttestation);
  }

  function test_getAttestation_AttestationNotAttested() public {
    vm.expectRevert(AttestationRegistry.AttestationNotAttested.selector);
    attestationRegistry.getAttestation(bytes32(abi.encode(1)));
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
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");
    uint32 version = attestationRegistry.getAttestationIdCounter();

    assertEq(version, 0);

    vm.startPrank(portal);

    attestationRegistry.attest(attestationPayload, attester);

    version = attestationRegistry.getAttestationIdCounter();
    assertEq(version, 1);

    attestationRegistry.attest(attestationPayload, attester);

    version = attestationRegistry.getAttestationIdCounter();
    assertEq(version, 2);

    vm.stopPrank();
  }

  function _createAttestation(
    AttestationPayload memory attestationPayload,
    uint256 id
  ) internal returns (Attestation memory) {
    uint16 versionNumber = attestationRegistry.getVersionNumber();
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");
    Attestation memory attestation = Attestation(
      bytes32(abi.encode(id)),
      attestationPayload.schemaId,
      bytes32(0),
      attester,
      portal,
      uint64(block.timestamp),
      attestationPayload.expirationDate,
      0,
      versionNumber,
      false,
      attestationPayload.subject,
      attestationPayload.attestationData
    );
    return attestation;
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
