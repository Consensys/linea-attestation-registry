// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { AbstractPortal } from "../src/abstracts/AbstractPortal.sol";
import { DefaultPortal } from "../src/DefaultPortal.sol";
import { AttestationPayload } from "../src/types/Structs.sol";
import { CorrectModule } from "./mocks/CorrectModuleMock.sol";
import { AttestationRegistryMock } from "./mocks/AttestationRegistryMock.sol";
import { ModuleRegistryMock } from "./mocks/ModuleRegistryMock.sol";
import { PortalRegistryMock } from "./mocks/PortalRegistryMock.sol";
import { ERC165Upgradeable } from "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import { Router } from "./../src/Router.sol";

contract DefaultPortalTest is Test {
  CorrectModule public correctModule = new CorrectModule();
  address[] public modules = new address[](1);
  DefaultPortal public defaultPortal;
  ModuleRegistryMock public moduleRegistryMock = new ModuleRegistryMock();
  PortalRegistryMock public portalRegistryMock = new PortalRegistryMock();
  AttestationRegistryMock public attestationRegistryMock = new AttestationRegistryMock();
  Router public router = new Router();
  address public portalOwner = makeAddr("portalOwner");

  event Initialized(uint8 version);
  event PortalRegistered(string name, string description, address portalAddress);
  event AttestationRegistered();
  event BulkAttestationsRegistered();
  event ModulesRunForAttestation();
  event ModulesBulkRunForAttestation();
  event ModulesBulkRunForAttestationV2();
  event AttestationRevoked(bytes32 attestationId);
  event BulkAttestationsRevoked(bytes32[] attestationId);

  function setUp() public {
    router.initialize();
    router.updateModuleRegistry(address(moduleRegistryMock));
    router.updateAttestationRegistry(address(attestationRegistryMock));
    router.updatePortalRegistry(address(portalRegistryMock));

    modules.push(address(correctModule));
    defaultPortal = new DefaultPortal(modules, address(router));

    vm.prank(portalOwner);
    portalRegistryMock.register(address(defaultPortal), "Name", "Description", true, "Owner name");
  }

  function test_setup() public view {
    assertEq(address(defaultPortal.modules(0)), address(modules[0]));
    assertEq(address(defaultPortal.moduleRegistry()), address(moduleRegistryMock));
    assertEq(address(defaultPortal.attestationRegistry()), address(attestationRegistryMock));
    assertEq(address(defaultPortal.portalRegistry()), address(portalRegistryMock));
    assertEq(portalRegistryMock.getPortalByAddress(address(defaultPortal)).ownerAddress, portalOwner);
  }

  function test_getModules() public view {
    address[] memory _modules = defaultPortal.getModules();
    assertEq(_modules, modules);
  }

  function test_attest() public {
    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      bytes("subject"),
      new bytes(1)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    defaultPortal.attest(attestationPayload, validationPayload);
  }

  function test_attestV2() public {
    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      bytes("subject"),
      new bytes(1)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    defaultPortal.attestV2(attestationPayload, validationPayload);
  }

  function test_bulkAttest(AttestationPayload[2] memory attestationsPayloads) public {
    vm.assume(bytes32(attestationsPayloads[0].schemaId) != 0);
    vm.assume(bytes32(attestationsPayloads[1].schemaId) != 0);
    // Create attestations payloads
    AttestationPayload[] memory payloadsToAttest = new AttestationPayload[](2);
    payloadsToAttest[0] = attestationsPayloads[0];
    payloadsToAttest[1] = attestationsPayloads[1];

    // Create validation payloads
    bytes[] memory validationPayload1 = new bytes[](1);
    bytes[] memory validationPayload2 = new bytes[](1);

    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload1;
    validationPayloads[1] = validationPayload2;

    vm.expectEmit(true, true, true, true);
    emit ModulesBulkRunForAttestation();
    vm.expectEmit(true, true, true, true);
    emit BulkAttestationsRegistered();
    defaultPortal.bulkAttest(payloadsToAttest, validationPayloads);
  }

  function test_bulkAttestV2(AttestationPayload[2] memory attestationsPayloads) public {
    vm.assume(bytes32(attestationsPayloads[0].schemaId) != 0);
    vm.assume(bytes32(attestationsPayloads[1].schemaId) != 0);
    // Create attestations payloads
    AttestationPayload[] memory payloadsToAttest = new AttestationPayload[](2);
    payloadsToAttest[0] = attestationsPayloads[0];
    payloadsToAttest[1] = attestationsPayloads[1];

    // Create validation payloads
    bytes[] memory validationPayload1 = new bytes[](1);
    bytes[] memory validationPayload2 = new bytes[](1);

    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload1;
    validationPayloads[1] = validationPayload2;

    vm.expectEmit(true, true, true, true);
    emit ModulesBulkRunForAttestationV2();
    vm.expectEmit(true, true, true, true);
    emit BulkAttestationsRegistered();
    defaultPortal.bulkAttestV2(payloadsToAttest, validationPayloads);
  }

  function test_replace() public {
    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      bytes("subject"),
      new bytes(1)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    defaultPortal.attest(attestationPayload, validationPayload);
    vm.prank(portalOwner);
    defaultPortal.replace(bytes32(abi.encode(1)), attestationPayload, validationPayload);
  }

  function test_replaceFail_OnlyOwner() public {
    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      bytes("subject"),
      new bytes(1)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    defaultPortal.attest(attestationPayload, validationPayload);
    vm.prank(makeAddr("random"));
    vm.expectRevert(AbstractPortal.OnlyPortalOwner.selector);
    defaultPortal.replace(bytes32(abi.encode(1)), attestationPayload, validationPayload);
  }

  function test_replaceV2() public {
    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      bytes("subject"),
      new bytes(1)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    defaultPortal.attestV2(attestationPayload, validationPayload);
    vm.prank(portalOwner);
    defaultPortal.replaceV2(bytes32(abi.encode(1)), attestationPayload, validationPayload);
  }

  function test_bulkReplace(AttestationPayload[2] memory attestationPayloads) public {
    vm.assume(bytes32(attestationPayloads[0].schemaId) != 0);
    vm.assume(bytes32(attestationPayloads[1].schemaId) != 0);
    // Create attestations payloads
    AttestationPayload[] memory payloadsToAttest = new AttestationPayload[](2);
    payloadsToAttest[0] = attestationPayloads[0];
    payloadsToAttest[1] = attestationPayloads[1];

    // Create validation payloads
    bytes[] memory validationPayload1 = new bytes[](1);
    bytes[] memory validationPayload2 = new bytes[](1);

    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload1;
    validationPayloads[1] = validationPayload2;

    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = bytes32(abi.encode(1));
    attestationIds[1] = bytes32(abi.encode(2));

    defaultPortal.bulkAttest(payloadsToAttest, validationPayloads);
    vm.prank(portalOwner);
    defaultPortal.bulkReplace(attestationIds, payloadsToAttest, validationPayloads);
  }

  function test_bulkReplaceFail_OnlyOwner(AttestationPayload[2] memory attestationPayloads) public {
    vm.assume(bytes32(attestationPayloads[0].schemaId) != 0);
    vm.assume(bytes32(attestationPayloads[1].schemaId) != 0);
    // Create attestations payloads
    AttestationPayload[] memory payloadsToAttest = new AttestationPayload[](2);
    payloadsToAttest[0] = attestationPayloads[0];
    payloadsToAttest[1] = attestationPayloads[1];

    // Create validation payloads
    bytes[] memory validationPayload1 = new bytes[](1);
    bytes[] memory validationPayload2 = new bytes[](1);

    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload1;
    validationPayloads[1] = validationPayload2;

    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = bytes32(abi.encode(1));
    attestationIds[1] = bytes32(abi.encode(2));

    defaultPortal.bulkAttest(payloadsToAttest, validationPayloads);
    vm.prank(makeAddr("random"));
    vm.expectRevert(AbstractPortal.OnlyPortalOwner.selector);
    defaultPortal.bulkReplace(attestationIds, payloadsToAttest, validationPayloads);
  }

  function test_bulkReplaceV2(AttestationPayload[2] memory attestationPayloads) public {
    vm.assume(bytes32(attestationPayloads[0].schemaId) != 0);
    vm.assume(bytes32(attestationPayloads[1].schemaId) != 0);
    // Create attestations payloads
    AttestationPayload[] memory payloadsToAttest = new AttestationPayload[](2);
    payloadsToAttest[0] = attestationPayloads[0];
    payloadsToAttest[1] = attestationPayloads[1];

    // Create validation payloads
    bytes[] memory validationPayload1 = new bytes[](1);
    bytes[] memory validationPayload2 = new bytes[](1);

    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload1;
    validationPayloads[1] = validationPayload2;

    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = bytes32(abi.encode(1));
    attestationIds[1] = bytes32(abi.encode(2));

    defaultPortal.bulkAttestV2(payloadsToAttest, validationPayloads);
    vm.prank(portalOwner);
    defaultPortal.bulkReplaceV2(attestationIds, payloadsToAttest, validationPayloads);
  }

  function test_revoke_byPortalOwner() public {
    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      bytes("subject"),
      new bytes(1)
    );

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);

    // Do register the attestation
    vm.prank(makeAddr("attester"));
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    defaultPortal.attest(attestationPayload, validationPayload);

    // Revoke the attestation as portal owner
    vm.prank(portalOwner);
    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(bytes32(abi.encode(1)));
    defaultPortal.revoke(bytes32(abi.encode(1)));
  }

  function test_revokeFail_OnlyOwner() public {
    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      bytes("subject"),
      new bytes(1)
    );

    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);

    // Do register the attestation
    vm.prank(makeAddr("attester"));
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    defaultPortal.attest(attestationPayload, validationPayload);

    // Revoke the attestation as a random user
    vm.prank(makeAddr("random"));
    vm.expectRevert(AbstractPortal.OnlyPortalOwner.selector);
    defaultPortal.revoke(bytes32(abi.encode(1)));
  }

  function test_bulkRevoke() public {
    bytes32[] memory attestationsToRevoke = new bytes32[](2);
    attestationsToRevoke[0] = bytes32("1");
    attestationsToRevoke[1] = bytes32("2");

    vm.expectEmit(true, true, true, true);
    emit BulkAttestationsRevoked(attestationsToRevoke);
    vm.prank(portalOwner);
    defaultPortal.bulkRevoke(attestationsToRevoke);
  }

  function test_supportsInterface() public view {
    bool isIERC165Supported = defaultPortal.supportsInterface(type(ERC165Upgradeable).interfaceId);
    assertEq(isIERC165Supported, true);
    bool isAbstractPortalSupported = defaultPortal.supportsInterface(type(AbstractPortal).interfaceId);
    assertEq(isAbstractPortalSupported, true);
  }
}
