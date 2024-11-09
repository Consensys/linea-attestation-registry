// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import { IndexerModuleV2 } from "../../src/stdlib/IndexerModuleV2.sol";
import { OperationType } from "../../src/types/Enums.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";
import { AttestationRegistryMock } from "../mocks/AttestationRegistryMock.sol";
import { SchemaRegistryMock } from "../mocks/SchemaRegistryMock.sol";
import { Router } from "../../src/Router.sol";
import { ValidPortalMock } from "../mocks/ValidPortalMock.sol";

contract IndexerModuleV2Test is Test {
  using ECDSA for bytes32;

  IndexerModuleV2 private indexerModule;
  AttestationPayload private attestationPayload;
  PortalRegistryMock private portalRegistry;
  AttestationRegistryMock private attestationRegistry;
  SchemaRegistryMock private schemaRegistry;
  Router private router;

  address private user = makeAddr("user");
  address private portal = makeAddr("portal");
  address private portalOwner = makeAddr("portalOwner");

  AttestationPayload private payload1;
  AttestationPayload private payload2;
  AttestationPayload private payload3;

  event AttestationIndexed(bytes32 attestationId);

  function setUp() public {
    vm.startPrank(portalOwner);
    // add portal to mock registry
    portalRegistry = new PortalRegistryMock();
    portalRegistry.register(address(portal), "portal", "portal", false, "portal");

    attestationRegistry = new AttestationRegistryMock();

    router = new Router();
    router.initialize();
    router.updatePortalRegistry(address(portalRegistry));
    router.updateAttestationRegistry(address(attestationRegistry));
    router.updateSchemaRegistry(address(schemaRegistry));

    payload1 = AttestationPayload(bytes32("1"), 0, bytes(""), bytes(""));
    payload2 = AttestationPayload(bytes32("1"), 0, bytes(""), bytes(""));
    payload3 = AttestationPayload(bytes32("2"), 0, bytes(""), bytes(""));

    attestationRegistry.attest(payload1, user);
    attestationRegistry.attest(payload2, user);

    indexerModule = new IndexerModuleV2(address(router));

    indexerModule.indexAttestation(bytes32(abi.encode(1)));

    vm.stopPrank();
  }

  function test_run() public {
    address[] memory modules = new address[](0);
    bytes32 expectedAtttestationId = attestationRegistry.getNextAttestationId();
    ValidPortalMock validPortal = new ValidPortalMock(modules, address(router));
    vm.prank(address(validPortal));
    vm.expectEmit({ emitter: address(indexerModule) });
    emit AttestationIndexed(expectedAtttestationId);
    indexerModule.run(
      payload3,
      bytes(""),
      address(0),
      0,
      address(makeAddr("attester")),
      address(validPortal),
      OperationType.Attest
    );
    assertEq(indexerModule.getIndexedAttestationStatus(expectedAtttestationId), true);
  }

  function test_indexAttestation() public {
    vm.expectEmit({ emitter: address(indexerModule) });
    emit AttestationIndexed(bytes32(abi.encode(2)));
    indexerModule.indexAttestation(bytes32(abi.encode(2)));
  }

  function test_indexAttestations() public {
    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = bytes32(abi.encode(1));
    attestationIds[1] = bytes32(abi.encode(2));
    indexerModule.indexAttestations(attestationIds);
    assertEq(indexerModule.getIndexedAttestationStatus(attestationIds[0]), true);
    assertEq(indexerModule.getIndexedAttestationStatus(attestationIds[1]), true);
  }

  function test_indexAttestation_CannotBeIndexedTwice() public {
    vm.expectEmit({ emitter: address(indexerModule) });
    emit AttestationIndexed(bytes32(abi.encode(2)));
    indexerModule.indexAttestation(bytes32(abi.encode(2)));
    indexerModule.indexAttestation(bytes32(abi.encode(2)));

    bytes32[] memory attestationIds = indexerModule.getAttestationIdsBySubject(payload1.subject);
    assertEq(attestationIds.length, 2);
  }

  function test_getAttestationIdsBySubject() public view {
    bytes32[] memory attestationIds = indexerModule.getAttestationIdsBySubject(payload1.subject);
    assertEq(attestationIds[0], bytes32(abi.encode(1)));
  }

  function test_getAttestationIdsBySubjectBySchema() public view {
    bytes32[] memory attestationIds = indexerModule.getAttestationIdsBySubjectBySchema(
      payload1.subject,
      payload1.schemaId
    );
    assertEq(attestationIds[0], bytes32(abi.encode(1)));
  }

  function test_getAttestationIdsByAttester() public view {
    bytes32[] memory attestationIds = indexerModule.getAttestationIdsByAttester(user);
    assertEq(attestationIds[0], bytes32(abi.encode(1)));
  }

  function test_getAttestationIdsBySchema() public view {
    bytes32[] memory attestationIds = indexerModule.getAttestationIdsBySchema(payload1.schemaId);
    assertEq(attestationIds[0], bytes32(abi.encode(1)));
  }

  function test_getAttestationIdsByPortal() public view {
    bytes32[] memory attestationIds = indexerModule.getAttestationIdsByPortal(portalOwner);
    assertEq(attestationIds[0], bytes32(abi.encode(1)));
  }

  function test_getAttestationByPortalBySubject() public view {
    bytes32[] memory attestationIds = indexerModule.getAttestationIdsByPortalBySubject(portalOwner, payload1.subject);
    assertEq(attestationIds[0], bytes32(abi.encode(1)));
  }

  function test_getIndexedAttestationStatus() public view {
    bool status = indexerModule.getIndexedAttestationStatus(bytes32(abi.encode(1)));
    assertEq(status, true);
  }
}
