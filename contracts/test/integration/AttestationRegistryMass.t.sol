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
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

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

    address proxyAdmin = makeAddr("proxyAdmin");

    TransparentUpgradeableProxy proxyAttestationRegistry = new TransparentUpgradeableProxy(
      address(new AttestationRegistry()),
      proxyAdmin,
      abi.encodeWithSelector(AttestationRegistry.initialize.selector, address(router))
    );

    attestationRegistry = AttestationRegistry(payable(address(proxyAttestationRegistry)));
    router.updateAttestationRegistry(address(attestationRegistry));

    TransparentUpgradeableProxy proxyPortalRegistry = new TransparentUpgradeableProxy(
      address(new PortalRegistry()),
      proxyAdmin,
      abi.encodeWithSelector(PortalRegistry.initialize.selector, address(router), false)
    );

    portalRegistry = PortalRegistry(payable(address(proxyPortalRegistry)));
    router.updatePortalRegistry(address(portalRegistry));

    TransparentUpgradeableProxy proxySchemaRegistry = new TransparentUpgradeableProxy(
      address(new SchemaRegistry()),
      proxyAdmin,
      abi.encodeWithSelector(SchemaRegistry.initialize.selector, address(router))
    );

    schemaRegistry = SchemaRegistry(payable(address(proxySchemaRegistry)));
    router.updateSchemaRegistry(address(proxySchemaRegistry));

    TransparentUpgradeableProxy proxyModuleRegistry = new TransparentUpgradeableProxy(
      address(new ModuleRegistry()),
      proxyAdmin,
      abi.encodeWithSelector(ModuleRegistry.initialize.selector, address(router))
    );

    moduleRegistry = ModuleRegistry(payable(address(proxyModuleRegistry)));
    router.updateModuleRegistry(address(moduleRegistry));

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
    defaultPortal.bulkAttest(payloadsToAttest, validationPayloads);
  }

  function test_massImport() public {
    attestationRegistry.massImport(payloadsToAttest, address(defaultPortal));
  }
}
