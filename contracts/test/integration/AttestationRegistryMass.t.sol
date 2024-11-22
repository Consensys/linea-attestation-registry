// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { AttestationRegistry } from "../../src/AttestationRegistry.sol";
import { PortalRegistry } from "../../src/PortalRegistry.sol";
import { SchemaRegistry } from "../../src/SchemaRegistry.sol";
import { ModuleRegistry } from "../../src/ModuleRegistry.sol";
import { DefaultPortalV2 } from "../../src/DefaultPortalV2.sol";
import { Attestation, AttestationPayload } from "../../src/types/Structs.sol";
import { Router } from "../../src/Router.sol";

contract AttestationRegistryMassTest is Test {
  address public portalOwner = makeAddr("portalOwner");
  Router public router;
  AttestationRegistry public attestationRegistry;
  PortalRegistry public portalRegistry;
  SchemaRegistry public schemaRegistry;
  ModuleRegistry public moduleRegistry;
  bytes32 public schemaId;
  AttestationPayload[] public payloadsToAttest;
  bytes[][] public validationPayloads;
  DefaultPortalV2 public defaultPortal;

  event Initialized(uint8 version);
  event AttestationRegistered(bytes32 indexed attestationId);
  event BulkAttestationsRegistered(Attestation[] attestations);
  event AttestationRevoked(bytes32 attestationId, bytes32 replacedBy);
  event BulkAttestationsRevoked(bytes32[] attestationId, bytes32[] replacedBy);
  event VersionUpdated(uint16 version);

  function setUp() public {
    router = new Router();
    router.initialize();

    attestationRegistry = new AttestationRegistry();
    router.updateAttestationRegistry(address(attestationRegistry));
    vm.prank(address(0));
    attestationRegistry.updateRouter(address(router));

    portalRegistry = new PortalRegistry(false);
    router.updatePortalRegistry(address(portalRegistry));
    vm.prank(address(0));
    portalRegistry.updateRouter(address(router));

    schemaRegistry = new SchemaRegistry();
    router.updateSchemaRegistry(address(schemaRegistry));
    vm.prank(address(0));
    schemaRegistry.updateRouter(address(router));

    moduleRegistry = new ModuleRegistry();
    router.updateModuleRegistry(address(moduleRegistry));
    vm.prank(address(0));
    moduleRegistry.updateRouter(address(router));

    vm.prank(address(0));
    portalRegistry.setIssuer(portalOwner);
    vm.prank(portalOwner);
    address[] memory modules = new address[](0);
    defaultPortal = new DefaultPortalV2(modules, address(router));

    vm.prank(portalOwner);
    portalRegistry.register(address(defaultPortal), "Name", "Description", true, "Linea");

    schemaId = schemaRegistry.getIdFromSchemaString("uint8 tier");
    vm.prank(portalOwner);
    schemaRegistry.createSchema("name", "description", "context", "uint8 tier");

    AttestationPayload memory attestationPayload = AttestationPayload(
      schemaId,
      1794160904,
      bytes(abi.encode(address(0x809e815596AbEB3764aBf81BE2DC39fBBAcc9949))),
      bytes(abi.encode(uint8(4)))
    );

    bytes[] memory validationPayload = new bytes[](1);

    for (uint256 i = 0; i < 100; i++) {
      payloadsToAttest.push(attestationPayload);
      validationPayloads.push(validationPayload);
    }
  }

  function test_bulkAttest() public {
    vm.prank(address(defaultPortal));
    attestationRegistry.bulkAttest(payloadsToAttest, address(this));
  }

  function test_bulkAttestThroughPortal() public {
    vm.prank(address(0));
    defaultPortal.bulkAttest(payloadsToAttest, validationPayloads);
  }

  function test_massImport() public {
    vm.prank(address(0));
    attestationRegistry.massImport(payloadsToAttest, address(defaultPortal));
  }
}
