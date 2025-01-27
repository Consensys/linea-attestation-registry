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
import { DefaultPortalV2 } from "../../src/DefaultPortalV2.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract IssuersPortalTest is Test {
  address public issuerAddress = makeAddr("issuer");
  Router public router = new Router();
  SchemaRegistry public schemaRegistry;
  PortalRegistry public portalRegistry;
  ModuleRegistry public moduleRegistry;
  AttestationRegistry public attestationRegistry;
  IssuersModuleV2 public issuersModule;
  SenderModuleV2 public senderModule;
  bytes32 public schemaId = bytes32(0);
  DefaultPortalV2 public issuersPortal;

  event Initialized(uint8 version);
  event AttestationRegistered(bytes32 indexed attestationId);
  event BulkAttestationsRegistered();

  function setUp() public {
    router.initialize();

    address proxyAdmin = makeAddr("proxyAdmin");

    TransparentUpgradeableProxy proxyAttestationRegistry = new TransparentUpgradeableProxy(
      address(new AttestationRegistry()),
      address(proxyAdmin),
      abi.encodeWithSelector(AttestationRegistry.initialize.selector, address(router))
    );

    attestationRegistry = AttestationRegistry(payable(address(proxyAttestationRegistry)));
    router.updateAttestationRegistry(address(attestationRegistry));

    TransparentUpgradeableProxy proxyPortalRegistry = new TransparentUpgradeableProxy(
      address(new PortalRegistry()),
      address(proxyAdmin),
      abi.encodeWithSelector(PortalRegistry.initialize.selector, address(router), false)
    );

    portalRegistry = PortalRegistry(payable(address(proxyPortalRegistry)));
    router.updatePortalRegistry(address(portalRegistry));

    TransparentUpgradeableProxy proxySchemaRegistry = new TransparentUpgradeableProxy(
      address(new SchemaRegistry()),
      address(proxyAdmin),
      abi.encodeWithSelector(SchemaRegistry.initialize.selector, address(router))
    );

    schemaRegistry = SchemaRegistry(payable(address(proxySchemaRegistry)));
    router.updateSchemaRegistry(address(proxySchemaRegistry));

    TransparentUpgradeableProxy proxyModuleRegistry = new TransparentUpgradeableProxy(
      address(new ModuleRegistry()),
      address(proxyAdmin),
      abi.encodeWithSelector(ModuleRegistry.initialize.selector, address(router))
    );

    moduleRegistry = ModuleRegistry(payable(address(proxyModuleRegistry)));
    router.updateModuleRegistry(address(moduleRegistry));

    issuersModule = new IssuersModuleV2(address(portalRegistry));
    senderModule = new SenderModuleV2(address(portalRegistry));

    portalRegistry.setIssuer(issuerAddress);
    vm.stopPrank();

    vm.startPrank(issuerAddress);
    moduleRegistry.register("IssuersModule", "IssuersModule description", address(issuersModule));
    moduleRegistry.register("SenderModule", "SenderModule description", address(senderModule));

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
    issuersPortal = DefaultPortalV2(portalAddress);

    address[] memory senders = new address[](1);
    senders[0] = address(0);
    bool[] memory statuses = new bool[](1);
    statuses[0] = true;

    senderModule.setAuthorizedSenders(address(issuersPortal), senders, statuses);

    vm.stopPrank();
  }

  function test_attest() public {
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
    issuersPortal.attest(attestationPayload, validationPayload);
  }
}
