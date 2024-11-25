// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { RouterManager } from "../src/RouterManager.sol";
import { AttestationReader } from "../src/AttestationReader.sol";
import { AttestationRegistryMock } from "./mocks/AttestationRegistryMock.sol";
import { AttestationRegistry } from "../src/AttestationRegistry.sol";
import { PortalRegistryMock } from "./mocks/PortalRegistryMock.sol";
import { PortalRegistry } from "../src/PortalRegistry.sol";
import { EASRegistryMock } from "./mocks/EASRegistryMock.sol";
import { AttestationPayload } from "../src/types/Structs.sol";
import { Attestation as EASAttestation } from "../src/interfaces/IEAS.sol";
import { Router } from "../src/Router.sol";

contract AttestationReaderTest is Test {
  address public portal = makeAddr("portal");
  address public attester = makeAddr("attester");
  Router public router;
  AttestationReader public attestationReader;
  address public attestationRegistryAddress;
  address public portalRegistryAddress;
  address public easRegistryAddress;
  event RouterUpdated(address routerAddress);
  event EASRegistryAddressUpdated(address easRegistryAddress);

  function setUp() public {
    router = new Router();
    router.initialize();

    portalRegistryAddress = address(new PortalRegistryMock());
    attestationRegistryAddress = address(new AttestationRegistryMock());
    easRegistryAddress = address(new EASRegistryMock());
    vm.startPrank(address(0));
    attestationReader = new AttestationReader();
    attestationReader.updateRouter(address(router));
    attestationReader.updateEASRegistryAddress(easRegistryAddress);
    vm.stopPrank();
    router.updatePortalRegistry(portalRegistryAddress);
    router.updateAttestationRegistry(attestationRegistryAddress);

    PortalRegistry(portalRegistryAddress).register(portal, "Name", "Description", true, "Owner name");
  }

  function test_initialize_ContractAlreadyInitialized() public {
    vm.expectRevert("Initializable: contract is already initialized");
    attestationReader.initialize();
  }

  function test_updateRouter() public {
    AttestationReader testAttestationReader = new AttestationReader();

    vm.expectEmit(true, true, true, true);
    emit RouterUpdated(address(1));
    vm.prank(address(0));
    testAttestationReader.updateRouter(address(1));
    address routerAddress = address(testAttestationReader.router());
    assertEq(routerAddress, address(1));
  }

  function test_updateRouter_RouterInvalid() public {
    AttestationReader testAttestationReader = new AttestationReader();

    vm.expectRevert(RouterManager.RouterInvalid.selector);
    vm.prank(address(0));
    testAttestationReader.updateRouter(address(0));
  }

  function test_updateEASRegistryAddress() public {
    AttestationReader testAttestationReader = new AttestationReader();

    vm.expectEmit(true, true, true, true);
    emit EASRegistryAddressUpdated(address(1));
    vm.prank(address(0));
    testAttestationReader.updateEASRegistryAddress(address(1));
    address easRegistryAddressActual = address(testAttestationReader.easRegistry());
    assertEq(easRegistryAddressActual, address(1));
  }

  function test_updateEASRegistryAddress_EASAddressInvalid() public {
    AttestationReader testAttestationReader = new AttestationReader();

    vm.expectRevert(AttestationReader.EASAddressInvalid.selector);
    vm.prank(address(0));
    testAttestationReader.updateEASRegistryAddress(address(0));
  }

  function test_getAttestation_fromEAS() public {
    EASAttestation memory easAttestation = EASAttestation({
      uid: keccak256(abi.encodePacked("uniqueID")),
      schema: keccak256(abi.encodePacked("schemaID")),
      time: uint64(block.timestamp),
      expirationTime: uint64(block.timestamp + 1 weeks),
      revocationTime: 0,
      refUID: keccak256(abi.encodePacked("refUID")),
      recipient: msg.sender,
      attester: address(this),
      revocable: true,
      data: "Custom data"
    });

    EASRegistryMock easRegistry = EASRegistryMock(easRegistryAddress);
    easRegistry.addAttestation(easAttestation);

    EASAttestation memory registeredAttestation = attestationReader.getAttestation(easAttestation.uid);
    _assertAttestation(easAttestation, registeredAttestation);
  }

  function test_getAttestation_fromVerax(AttestationPayload memory attestationPayload) public {
    attestationPayload.subject = abi.encode(address(1));
    vm.assume(attestationPayload.attestationData.length != 0);
    EASAttestation memory attestation = _createAttestation(attestationPayload, 1);

    vm.startPrank(portal);
    AttestationRegistry attestationRegistry = AttestationRegistry(attestationRegistryAddress);
    attestationRegistry.attest(attestationPayload, attester);

    EASAttestation memory registeredAttestation = attestationReader.getAttestation(attestation.uid);
    _assertAttestation(attestation, registeredAttestation);
  }

  function _createAttestation(
    AttestationPayload memory attestationPayload,
    uint256 id
  ) internal view returns (EASAttestation memory) {
    EASAttestation memory attestation = EASAttestation(
      bytes32(abi.encode(id)),
      attestationPayload.schemaId,
      uint64(block.timestamp),
      attestationPayload.expirationDate,
      0,
      bytes32(0),
      abi.decode(attestationPayload.subject, (address)),
      attester,
      PortalRegistry(router.getPortalRegistry()).getPortalByAddress(portal).isRevocable,
      attestationPayload.attestationData
    );
    return attestation;
  }

  function _assertAttestation(EASAttestation memory attestation1, EASAttestation memory attestation2) internal pure {
    assertEq(attestation1.uid, attestation2.uid);
    assertEq(attestation1.schema, attestation2.schema);
    assertEq(attestation1.time, attestation2.time);
    assertEq(attestation1.expirationTime, attestation2.expirationTime);
    assertEq(attestation1.revocationTime, attestation2.revocationTime);
    assertEq(attestation1.refUID, attestation2.refUID);
    assertEq(attestation1.recipient, attestation2.recipient);
    assertEq(attestation1.attester, attestation2.attester);
    assertEq(attestation1.revocable, attestation2.revocable);
    assertEq(attestation1.data.length, attestation2.data.length);
  }
}
