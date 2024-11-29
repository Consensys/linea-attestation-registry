// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { RouterManager } from "../src/RouterManager.sol";
import { AttestationRegistry } from "../src/AttestationRegistry.sol";
import { PortalRegistryMock } from "./mocks/PortalRegistryMock.sol";
import { PortalRegistry } from "../src/PortalRegistry.sol";
import { SchemaRegistryMock } from "./mocks/SchemaRegistryMock.sol";
import { Attestation, AttestationPayload } from "../src/types/Structs.sol";
import { Router } from "../src/Router.sol";
import { AttestationRegistryHarness } from "./harness/AttestationRegistryHarness.sol";

contract AttestationRegistryTest is Test {
  address public portal = makeAddr("portal");
  address public user = makeAddr("user");
  address public attester = makeAddr("attester");
  Router public router;
  AttestationRegistry public attestationRegistry;
  AttestationRegistryHarness public attestationRegistryHarness;
  address public portalRegistryAddress;
  address public schemaRegistryAddress;
  uint256 public initialChainPrefix = 0x0003000000000000000000000000000000000000000000000000000000000000;

  event Initialized(uint8 version);
  event AttestationRegistered(bytes32 indexed attestationId);
  event BulkAttestationsRegistered(Attestation[] attestations);
  event AttestationReplaced(bytes32 attestationId, bytes32 replacedBy);
  event AttestationRevoked(bytes32 attestationId);
  event BulkAttestationsRevoked(bytes32[] attestationId);
  event VersionUpdated(uint16 version);
  event RouterUpdated(address routerAddress);
  event ChainPrefixUpdated(uint256 chainPrefix);

  function setUp() public {
    router = new Router();
    router.initialize();

    attestationRegistryHarness = new AttestationRegistryHarness();
    attestationRegistry = new AttestationRegistry();
    router.updateAttestationRegistry(address(attestationRegistry));

    portalRegistryAddress = address(new PortalRegistryMock());
    schemaRegistryAddress = address(new SchemaRegistryMock());
    vm.prank(address(0));
    attestationRegistry.updateRouter(address(router));
    vm.prank(address(0));
    attestationRegistry.updateChainPrefix(initialChainPrefix);
    vm.prank(address(0));
    attestationRegistryHarness.updateChainPrefix(initialChainPrefix);

    router.updatePortalRegistry(portalRegistryAddress);
    router.updateSchemaRegistry(schemaRegistryAddress);

    PortalRegistry(portalRegistryAddress).register(portal, "Name", "Description", true, "Owner name");
  }

  function test_setup() public view {
    // Check Router address
    address routerAddress = address(attestationRegistry.router());
    assertEq(routerAddress, address(router));

    // Check Chain Prefix value in the tested contract
    uint256 chainPrefix = attestationRegistry.getChainPrefix();
    assertEq(chainPrefix, initialChainPrefix);

    // Check Chain Prefix value in the harness contract
    uint256 chainPrefixHarness = attestationRegistryHarness.getChainPrefix();
    assertEq(chainPrefixHarness, initialChainPrefix);

    // Check AttestationRegistry address
    address testAttestationRegistry = address(router.getAttestationRegistry());
    assertEq(testAttestationRegistry, address(attestationRegistry));

    // Check PortalRegistry address
    address testPortalRegistry = address(router.getPortalRegistry());
    assertEq(testPortalRegistry, portalRegistryAddress);

    // Check SchemaRegistry address
    address testSchemaRegistry = address(router.getSchemaRegistry());
    assertEq(testSchemaRegistry, schemaRegistryAddress);
  }

  function test_initialize_ContractAlreadyInitialized() public {
    vm.expectRevert("Initializable: contract is already initialized");
    attestationRegistry.initialize();
  }

  function test_updateRouter() public {
    AttestationRegistry testAttestationRegistry = new AttestationRegistry();

    vm.expectEmit(true, true, true, true);
    emit RouterUpdated(address(1));
    vm.prank(address(0));
    testAttestationRegistry.updateRouter(address(1));
    address routerAddress = address(testAttestationRegistry.router());
    assertEq(routerAddress, address(1));
  }

  function test_updateRouter_InvalidParameter() public {
    AttestationRegistry testAttestationRegistry = new AttestationRegistry();

    vm.expectRevert(RouterManager.RouterInvalid.selector);
    vm.prank(address(0));
    testAttestationRegistry.updateRouter(address(0));
  }

  function test_updateRouter_RouterAlreadyUpdated() public {
    AttestationRegistry testAttestationRegistry = new AttestationRegistry();
    vm.expectEmit(true, true, true, true);
    emit RouterUpdated(address(1));
    vm.prank(address(0));
    testAttestationRegistry.updateRouter(address(1));

    vm.expectRevert(AttestationRegistry.RouterAlreadyUpdated.selector);
    vm.prank(address(0));
    testAttestationRegistry.updateRouter(address(1));
  }

  function test_updateChainPrefix() public {
    AttestationRegistry testAttestationRegistry = new AttestationRegistry();

    vm.expectEmit(true, true, true, true);
    emit ChainPrefixUpdated(initialChainPrefix);
    vm.prank(address(0));
    testAttestationRegistry.updateChainPrefix(initialChainPrefix);

    uint256 chainPrefix = testAttestationRegistry.getChainPrefix();
    assertEq(chainPrefix, initialChainPrefix);

    vm.expectEmit(true, true, true, true);
    emit ChainPrefixUpdated(0x0001000000000000000000000000000000000000000000000000000000000000);
    vm.prank(address(0));
    testAttestationRegistry.updateChainPrefix(0x0001000000000000000000000000000000000000000000000000000000000000);

    chainPrefix = testAttestationRegistry.getChainPrefix();
    assertEq(chainPrefix, 0x0001000000000000000000000000000000000000000000000000000000000000);
  }

  function test_updateChainPrefix_ChainPrefixAlreadyUpdated() public {
    AttestationRegistry testAttestationRegistry = new AttestationRegistry();

    vm.expectEmit(true, true, true, true);
    emit ChainPrefixUpdated(initialChainPrefix);
    vm.prank(address(0));
    testAttestationRegistry.updateChainPrefix(initialChainPrefix);

    vm.expectRevert(AttestationRegistry.ChainPrefixAlreadyUpdated.selector);
    vm.prank(address(0));
    testAttestationRegistry.updateChainPrefix(initialChainPrefix);
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

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered(attestationRegistryHarness.exposed_generateAttestationId(1));
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered(attestationRegistryHarness.exposed_generateAttestationId(2));
    vm.prank(address(0));
    attestationRegistry.massImport(payloadsToAttest, portal);
  }

  function test_replace(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);

    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");

    Attestation memory attestation = _createAttestation(attestationPayload, 1);
    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    bytes32 attestationIdReplacing = attestationRegistryHarness.exposed_generateAttestationId(2);

    vm.prank(portal);
    vm.expectEmit(true, true, true, true);
    emit AttestationReplaced(attestation.attestationId, attestationIdReplacing);
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

  function test_bulkReplace_ArrayLengthMismatch(AttestationPayload[2] memory attestationPayloads) public {
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

    bytes32[] memory attestationIds = new bytes32[](3);
    attestationIds[0] = attestation1.attestationId;
    attestationIds[1] = attestation2.attestationId;
    attestationIds[2] = attestationRegistryHarness.exposed_generateAttestationId((3));

    vm.startPrank(portal);
    attestationRegistry.bulkAttest(payloadsToAttest, attester);

    vm.expectRevert(AttestationRegistry.ArrayLengthMismatch.selector);
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
    bytes32 attestationId = attestationRegistryHarness.exposed_generateAttestationId((1));
    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestationId);

    assertEq(registeredAttestation.attestationId, attestationRegistryHarness.exposed_generateAttestationId(1));
    assertFalse(registeredAttestation.revoked);
    assertEq(registeredAttestation.revocationDate, 0);
    assertEq(registeredAttestation.portal, portal);
    assertEq(registeredAttestation.attester, attester);

    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(attestationId);
    attestationRegistry.revoke(attestationId);
    vm.stopPrank();

    // Assert final state is a revoked attestation
    Attestation memory revokedAttestation = attestationRegistry.getAttestation(
      attestationRegistryHarness.exposed_generateAttestationId(1)
    );
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

    bytes32 attestationIdToRevoke = attestationRegistryHarness.exposed_generateAttestationId(1);

    vm.expectEmit();
    emit AttestationRevoked(attestationIdToRevoke);
    attestationRegistry.revoke(attestationIdToRevoke);

    vm.expectRevert(AttestationRegistry.AlreadyRevoked.selector);
    attestationRegistry.revoke(attestationIdToRevoke);

    vm.stopPrank();
  }

  function test_revoke_AttestationNotAttested() public {
    bytes32 attestationIdToRevoke = attestationRegistryHarness.exposed_generateAttestationId(1);
    vm.expectRevert(AttestationRegistry.AttestationNotAttested.selector);
    attestationRegistry.revoke(attestationIdToRevoke);
  }

  function test_revoke_OnlyAttestingPortal(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    vm.prank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    bytes32 attestationIdToRevoke = attestationRegistryHarness.exposed_generateAttestationId(1);
    vm.expectRevert(AttestationRegistry.OnlyAttestingPortal.selector);
    vm.prank(user);
    attestationRegistry.revoke(attestationIdToRevoke);
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

    bytes32 attestationIdToRevoke = attestationRegistryHarness.exposed_generateAttestationId(1);

    vm.expectRevert(AttestationRegistry.AttestationNotRevocable.selector);
    attestationRegistry.revoke(attestationIdToRevoke);

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

    bytes32 attestationId1 = attestationRegistryHarness.exposed_generateAttestationId((1));
    bytes32 attestationId2 = attestationRegistryHarness.exposed_generateAttestationId((2));
    bytes32 attestationId3 = attestationRegistryHarness.exposed_generateAttestationId((3));

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

  function test_isRevocable() public view {
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
    bool isRegistered = attestationRegistry.isRegistered(attestationRegistryHarness.exposed_generateAttestationId(1));
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
    bytes32 attestationIdNotAttested = attestationRegistryHarness.exposed_generateAttestationId((1));
    vm.expectRevert(AttestationRegistry.AttestationNotAttested.selector);
    attestationRegistry.getAttestation(attestationIdNotAttested);
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
    uint32 attestationIdCounter = attestationRegistry.getAttestationIdCounter();

    assertEq(attestationIdCounter, 0);

    vm.startPrank(portal);

    attestationRegistry.attest(attestationPayload, attester);

    attestationIdCounter = attestationRegistry.getAttestationIdCounter();
    assertEq(attestationIdCounter, 1);

    attestationRegistry.attest(attestationPayload, attester);

    attestationIdCounter = attestationRegistry.getAttestationIdCounter();
    assertEq(attestationIdCounter, 2);

    vm.stopPrank();
  }

  function test_balanceOf_attestationNotFound(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    vm.startPrank(portal);
    attestationPayload.subject = abi.encode(address(1));
    attestationRegistry.attest(attestationPayload, attester);

    uint256 balance = attestationRegistry.balanceOf(address(1), 1234);
    assertEq(balance, 0);
  }

  function test_balanceOf_attestationRevoked() public {
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    AttestationPayload memory attestationPayload;
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    attestationPayload.expirationDate = 0;
    attestationPayload.subject = abi.encode(address(1));
    attestationPayload.attestationData = abi.encode("data");

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, attester);
    vm.startPrank(portal);
    attestationRegistry.revoke(0x0003000000000000000000000000000000000000000000000000000000000001);

    uint256 balance = attestationRegistry.balanceOf(address(1), 1);
    assertEq(balance, 0);
  }

  function test_balanceOf_attestationExpired() public {
    // Sets the block timestamp to 1641070800
    vm.warp(1641070800);

    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    AttestationPayload memory attestationPayload;
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    attestationPayload.expirationDate = block.timestamp > 1 days ? uint64(block.timestamp - 1 days) : 0;
    attestationPayload.subject = abi.encode(address(1));
    attestationPayload.attestationData = abi.encode("data");

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    uint256 balance = attestationRegistry.balanceOf(address(1), 1);
    assertEq(balance, 0);
  }

  function test_balanceOf_subjectNotFound() public {
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    AttestationPayload memory attestationPayload;
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    attestationPayload.expirationDate = 0;
    attestationPayload.subject = abi.encode(address(1234));
    attestationPayload.attestationData = abi.encode("data");

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    uint256 balance = attestationRegistry.balanceOf(address(1), 1);
    assertEq(balance, 0);
  }

  function test_balanceOf_subjectEncodedAddress() public {
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    AttestationPayload memory attestationPayload;
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    attestationPayload.expirationDate = 0;
    attestationPayload.subject = abi.encode(address(1));
    attestationPayload.attestationData = abi.encode("data");

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    uint256 balance = attestationRegistry.balanceOf(address(1), 1);
    assertEq(balance, 1);
  }

  function test_balanceOf_subjectPackedEncodedAddress() public {
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    AttestationPayload memory attestationPayload;
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    attestationPayload.expirationDate = 0;
    attestationPayload.subject = abi.encodePacked(address(1));
    attestationPayload.attestationData = abi.encode("data");

    vm.startPrank(portal);
    attestationRegistry.attest(attestationPayload, attester);

    uint256 balance = attestationRegistry.balanceOf(address(1), 1);
    assertEq(balance, 1);
  }

  function test_balanceOfBatch(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");

    address[] memory owners = new address[](2);
    owners[0] = address(1);
    owners[1] = address(2);

    vm.startPrank(portal);
    attestationPayload.subject = abi.encode(owners[0]); // Address fully encoded
    attestationRegistry.attest(attestationPayload, attester);

    attestationPayload.subject = abi.encodePacked(owners[1]);
    attestationRegistry.attest(attestationPayload, attester); // Address as subject

    uint256[] memory ids = new uint256[](2);
    ids[0] = 1;
    ids[1] = 2;
    uint256[] memory balance = attestationRegistry.balanceOfBatch(owners, ids);
    assertEq(balance[0], 1);
    assertEq(balance[1], 1);
  }

  function test_balanceOfBatch_ArrayLengthMismatch() public {
    address[] memory owners = new address[](2);
    owners[0] = address(1);
    owners[1] = address(2);
    uint256[] memory ids = new uint256[](1);
    ids[0] = 1;
    vm.expectRevert(AttestationRegistry.ArrayLengthMismatch.selector);
    attestationRegistry.balanceOfBatch(owners, ids);
  }

  function test_attestationRegistry() public view {
    bytes32 attestationId = attestationRegistryHarness.exposed_generateAttestationId(0);
    assertEq(attestationId, 0x0003000000000000000000000000000000000000000000000000000000000000);

    attestationId = attestationRegistryHarness.exposed_generateAttestationId(10);
    assertEq(attestationId, 0x000300000000000000000000000000000000000000000000000000000000000a);
  }

  function test_getNextAttestationId(AttestationPayload memory attestationPayload) public {
    vm.assume(attestationPayload.subject.length != 0);
    vm.assume(attestationPayload.attestationData.length != 0);
    SchemaRegistryMock schemaRegistryMock = SchemaRegistryMock(router.getSchemaRegistry());
    attestationPayload.schemaId = schemaRegistryMock.getIdFromSchemaString("schemaString");
    schemaRegistryMock.createSchema("name", "description", "context", "schemaString");
    bytes32 nextAttestationId = attestationRegistry.getNextAttestationId();

    bytes32 expectedNextAttestationId = bytes32(abi.encode(initialChainPrefix + 1));
    assertEq(nextAttestationId, expectedNextAttestationId);

    vm.startPrank(portal);

    attestationRegistry.attest(attestationPayload, attester);

    expectedNextAttestationId = bytes32(abi.encode(initialChainPrefix + 2));
    nextAttestationId = attestationRegistry.getNextAttestationId();

    assertEq(nextAttestationId, expectedNextAttestationId);

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
      attestationRegistryHarness.exposed_generateAttestationId(id),
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

  function _assertAttestation(Attestation memory attestation1, Attestation memory attestation2) internal pure {
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
