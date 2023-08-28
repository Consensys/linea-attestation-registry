// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { AbstractPortal } from "../../src/interface/AbstractPortal.sol";
import { DefaultPortal } from "../../src/portal/DefaultPortal.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { CorrectModule } from "../../src/example/CorrectModule.sol";
import { AttestationRegistryMock } from "../mocks/AttestationRegistryMock.sol";
import { ModuleRegistryMock } from "../mocks/ModuleRegistryMock.sol";
import { ERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165Upgradeable.sol";
import { SchemaRegistryMock } from "../mocks/SchemaRegistryMock.sol";

contract DefaultPortalTest is Test {
  CorrectModule public correctModule = new CorrectModule();
  address[] public modules = new address[](1);
  DefaultPortal public defaultPortal;
  ModuleRegistryMock public moduleRegistryMock = new ModuleRegistryMock();
  AttestationRegistryMock public attestationRegistryMock = new AttestationRegistryMock();
  SchemaRegistryMock public schemaRegistryMock = new SchemaRegistryMock();

  event Initialized(uint8 version);
  event PortalRegistered(string name, string description, address portalAddress);
  event AttestationRegistered();
  event BulkAttestationsRegistered();
  event ModulesRunForAttestation();
  event ModulesBulkRunForAttestation();
  event AttestationRevoked(bytes32 attestationId, bytes32 replacedBy);
  event BulkAttestationsRevoked(bytes32[] attestationId, bytes32[] replacedBy);

  function setUp() public {
    defaultPortal = new DefaultPortal();
    modules.push(address(correctModule));
    defaultPortal.initialize(modules, address(moduleRegistryMock), address(attestationRegistryMock));
  }

  function test_initialize() public {
    DefaultPortal defaultPortalTest = new DefaultPortal();
    vm.expectEmit();
    emit Initialized(1);
    defaultPortalTest.initialize(modules, address(1), address(2));

    vm.expectRevert("Initializable: contract is already initialized");
    defaultPortalTest.initialize(modules, address(1), address(2));
  }

  function test_getModules() public {
    address[] memory _modules = defaultPortal.getModules();
    assertEq(_modules, modules);
  }

  function test_attest() public {
    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      bytes("subject"),
      block.timestamp + 1 days,
      new bytes(1)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](2);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    defaultPortal.attest(attestationPayload, validationPayload);
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

  function test_revoke() public {
    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(bytes32("1"), bytes32("2"));
    defaultPortal.revoke(bytes32("1"), bytes32("2"));
  }

  function test_bulkRevoke() public {
    bytes32[] memory attestationsToRevoke = new bytes32[](2);
    attestationsToRevoke[0] = bytes32("1");
    attestationsToRevoke[1] = bytes32("2");
    bytes32[] memory replacingAttestations = new bytes32[](2);
    replacingAttestations[0] = bytes32(0);
    replacingAttestations[1] = bytes32(0);

    vm.expectEmit(true, true, true, true);
    emit BulkAttestationsRevoked(attestationsToRevoke, replacingAttestations);
    defaultPortal.bulkRevoke(attestationsToRevoke, replacingAttestations);
  }

  function testSupportsInterface() public {
    bool isIERC165Supported = defaultPortal.supportsInterface(type(ERC165Upgradeable).interfaceId);
    assertEq(isIERC165Supported, true);
    bool isAbstractPortalSupported = defaultPortal.supportsInterface(type(AbstractPortal).interfaceId);
    assertEq(isAbstractPortalSupported, true);
  }
}
