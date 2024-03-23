// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test, Vm } from "forge-std/Test.sol";
import { Router } from "../../src/Router.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { AttestationRegistry } from "../../src/AttestationRegistry.sol";
import { ModuleRegistry } from "../../src/ModuleRegistry.sol";
import { SchemaRegistry } from "../../src/SchemaRegistry.sol";
import { PortalRegistry } from "../../src/PortalRegistry.sol";
import { IssuersModuleV2 } from "../../src/stdlib/IssuersModuleV2.sol";
import { SenderModuleV2 } from "../../src/stdlib/SenderModuleV2.sol";
import { DefaultPortal } from "../../src/DefaultPortal.sol";

contract IssuersPortalTest is Test {
  address public issuerAddress = makeAddr("issuer");
  Router public router = new Router();
  SchemaRegistry public schemaRegistry = new SchemaRegistry();
  PortalRegistry public portalRegistry = new PortalRegistry();
  ModuleRegistry public moduleRegistry = new ModuleRegistry();
  AttestationRegistry public attestationRegistry = new AttestationRegistry();
  IssuersModuleV2 public issuersModule;
  SenderModuleV2 public senderModule;
  bytes32 public schemaId = bytes32(0);
  DefaultPortal public issuersPortal;

  event Initialized(uint8 version);
  event AttestationRegistered(bytes32 indexed attestationId);
  event BulkAttestationsRegistered();

  function setUp() public {
    vm.startPrank(address(0));

    router.initialize();
    router.updateSchemaRegistry(address(schemaRegistry));
    router.updatePortalRegistry(address(portalRegistry));
    router.updateModuleRegistry(address(moduleRegistry));
    router.updateAttestationRegistry(address(attestationRegistry));

    schemaRegistry.updateRouter(address(router));
    portalRegistry.updateRouter(address(router));
    moduleRegistry.updateRouter(address(router));
    attestationRegistry.updateRouter(address(router));

    issuersModule = new IssuersModuleV2(address(portalRegistry));
    senderModule = new SenderModuleV2(address(portalRegistry));

    portalRegistry.setIssuer(address(0));
    portalRegistry.setIssuer(issuerAddress);

    moduleRegistry.register("IssuersModuleV2", "IssuersModule description", address(issuersModule));
    moduleRegistry.register("SenderModuleV2", "SenderModule description", address(senderModule));

    schemaId = schemaRegistry.getIdFromSchemaString(
      "(string name, string description, string logoURL, string[] keywords, string CTATitle, string CTALink)"
    );
    schemaRegistry.createSchema(
      "Issuer",
      "Describes an Issuer for the Verax Attestation Registry",
      "https://schema.org/Property",
      "(string name, string description, string logoURL, string[] keywords, string CTATitle, string CTALink)"
    );

    address[] memory modules = new address[](2);
    modules[0] = address(senderModule);
    modules[1] = address(issuersModule);

    vm.recordLogs();
    portalRegistry.deployDefaultPortal(modules, "IssuersPortal", "IssuersPortal description", true, "Verax");
    Vm.Log[] memory entries = vm.getRecordedLogs();

    // Get the address of the Portal that was just deployed and registered
    (, , address portalAddress) = abi.decode(entries[0].data, (string, string, address));
    issuersPortal = DefaultPortal(portalAddress);

    address[] memory senders = new address[](1);
    senders[0] = address(0);
    bool[] memory statuses = new bool[](1);
    statuses[0] = true;

    senderModule.setAuthorizedSenders(address(issuersPortal), senders, statuses);

    vm.stopPrank();
  }

  function test_attestV2() public {
    string memory name = "Issuer name";
    string memory description = "Issuer name";
    string memory logoURL = "https://example.com/logo";
    string[] memory keywords = new string[](1);
    keywords[0] = "Keyword 1";
    string memory CTATitle = "Issuer CTA";
    string memory CTALink = "https://example.com/cta";

    AttestationPayload memory attestationPayload = AttestationPayload(
      schemaId,
      0,
      abi.encode(issuerAddress),
      abi.encode(name, description, logoURL, keywords, CTATitle, CTALink)
    );

    bytes[] memory validationPayload = new bytes[](2);
    validationPayload[0] = abi.encode(address(issuersPortal));

    vm.prank(address(0), address(0));
    vm.expectEmit(address(attestationRegistry));
    emit AttestationRegistered(0x0000000000000000000000000000000000000000000000000000000000000001);
    issuersPortal.attestV2(attestationPayload, validationPayload);
  }
}
