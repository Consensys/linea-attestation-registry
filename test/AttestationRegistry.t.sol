// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Vm } from "forge-std/Vm.sol";
import { Test } from "forge-std/Test.sol";
import { AttestationRegistry } from "../src/AttestationRegistry.sol";
import { PortalRegistryMock } from "./mocks/PortalRegistryMock.sol";
import { PortalRegistry } from "../src/PortalRegistry.sol";
import { SchemaRegistryMock } from "./mocks/SchemaRegistryMock.sol";
import { Attestation } from "../src/types/Structs.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

contract AttestationRegistryTest is Test {
  address public portal = makeAddr("portal");
  address public user = makeAddr("user");
  AttestationRegistry public attestationRegistry;
  address portalRegistryAddress;
  address schemaRegistryAddress;

  event Initialized(uint8 version);
  event AttestationRegistered(Attestation attestation);
  event AttestationRevoked(bytes32 attestationId);

  function setUp() public {
    attestationRegistry = new AttestationRegistry();
    portalRegistryAddress = address(new PortalRegistryMock());
    schemaRegistryAddress = address(new SchemaRegistryMock());
    attestationRegistry.initialize(portalRegistryAddress, schemaRegistryAddress);

    PortalRegistry(portalRegistryAddress).register(portal, "Portal", "Portal");
  }

  function test_initialize_ContractAlreadyInitialized() public {
    vm.expectEmit();
    emit Initialized(1);
    AttestationRegistry testAttestationRegistry = new AttestationRegistry();
    testAttestationRegistry.initialize(portalRegistryAddress, schemaRegistryAddress);
    vm.expectRevert("Initializable: contract is already initialized");
    attestationRegistry.initialize(portalRegistryAddress, schemaRegistryAddress);
  }

  function test_initialize_InvalidParameters() public {
    AttestationRegistry testAttestationRegistry = new AttestationRegistry();

    vm.expectRevert(AttestationRegistry.PortalRegistryInvalid.selector);
    testAttestationRegistry.initialize(address(0), schemaRegistryAddress);

    vm.expectRevert(AttestationRegistry.SchemaRegistryInvalid.selector);
    testAttestationRegistry.initialize(portalRegistryAddress, address(0));
  }

  function test_attest(Attestation memory attestation) public {
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered(attestation);
    vm.prank(portal);
    attestationRegistry.attest(attestation);

    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    _assertAttestation(attestation, registeredAttestation);
  }

  function test_attest_PortalNotRegistered(Attestation memory attestation) public {
    vm.expectRevert(AttestationRegistry.OnlyPortal.selector);
    vm.prank(user);
    attestationRegistry.attest(attestation);
  }

  function test_revoke(Attestation memory attestation) public {
    vm.assume(attestation.attestationId != bytes32(0));
    attestation.portal = portal;

    vm.startPrank(portal);
    attestationRegistry.attest(attestation);

    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(attestation.attestationId);
    attestationRegistry.revoke(attestation.attestationId);
    vm.stopPrank();

    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    assertEq(registeredAttestation.revoked, true);
  }

  function test_revoke_AttestationNotAttested(Attestation memory attestation) public {
    vm.expectRevert(AttestationRegistry.AttestationNotAttested.selector);
    attestationRegistry.revoke(attestation.attestationId);
  }

  function test_revoke_OnlyAttestingPortal(Attestation memory attestation) public {
    vm.prank(portal);
    attestationRegistry.attest(attestation);

    vm.expectRevert(AttestationRegistry.OnlyAttestingPortal.selector);
    vm.prank(user);
    attestationRegistry.revoke(attestation.attestationId);
  }

  function test_isRegistered(Attestation memory attestation) public {
    vm.assume(attestation.attestationId != bytes32(0));
    attestation.portal = portal;

    bool isRegistered = attestationRegistry.isRegistered(attestation.attestationId);
    assertEq(isRegistered, false);

    vm.startPrank(portal);
    attestationRegistry.attest(attestation);

    isRegistered = attestationRegistry.isRegistered(attestation.attestationId);
    assertEq(isRegistered, true);
  }

  function test_getAttestation(Attestation memory attestation) public {
    vm.assume(attestation.attestationId != bytes32(0));
    attestation.portal = portal;

    vm.startPrank(portal);
    attestationRegistry.attest(attestation);

    Attestation memory registeredAttestation = attestationRegistry.getAttestation(attestation.attestationId);
    _assertAttestation(attestation, registeredAttestation);
  }

  function test_getAttestation_AttestationNotAttested(Attestation memory attestation) public {
    vm.expectRevert(AttestationRegistry.AttestationNotAttested.selector);
    attestationRegistry.getAttestation(attestation.attestationId);
  }

  function _assertAttestation(Attestation memory attestation1, Attestation memory attestation2) internal {
    assertEq(attestation1.attestationId, attestation2.attestationId);
    assertEq(attestation1.schemaId, attestation2.schemaId);
    assertEq(attestation1.portal, attestation2.portal);
    assertEq(attestation1.attestee, attestation2.attestee);
    assertEq(attestation1.attestor, attestation2.attestor);
    assertEq(attestation1.attestedDate, attestation2.attestedDate);
    assertEq(attestation1.expirationDate, attestation2.expirationDate);
    assertEq(attestation1.revoked, attestation2.revoked);
    assertEq(attestation1.attestationData.length, attestation2.attestationData.length);
  }
}
