// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationPayload, Attestation } from "../../src/types/Structs.sol";

contract AttestationRegistryMock {
  uint16 public version;
  uint32 private attestationIdCounter;
  mapping(bytes32 attestationId => Attestation attestation) private attestations;

  event AttestationRegistered();
  event AttestationReplaced();
  event BulkAttestationsRegistered();
  event AttestationRevoked(bytes32 attestationId);
  event BulkAttestationsRevoked(bytes32[] attestationId);

  function test() public {}

  function attest(AttestationPayload calldata attestationPayload, address attester) public {
    attestationIdCounter++;
    // Create attestation
    Attestation memory attestation = Attestation(
      bytes32(abi.encode(attestationIdCounter)),
      attestationPayload.schemaId,
      bytes32(0),
      attester,
      msg.sender,
      uint64(block.timestamp),
      attestationPayload.expirationDate,
      0,
      version,
      false,
      attestationPayload.subject,
      attestationPayload.attestationData
    );
    attestations[attestation.attestationId] = attestation;

    emit AttestationRegistered();
  }

  function bulkAttest(AttestationPayload[] calldata /*attestationsPayloads*/, address /*attester*/) public {
    emit BulkAttestationsRegistered();
  }

  function replace(
    bytes32 /*attestationId*/,
    AttestationPayload calldata /*attestationPayload*/,
    address /*replacer*/
  ) public {
    emit AttestationRegistered();
    emit AttestationReplaced();
  }

  function bulkReplace(
    bytes32[] calldata /*attestationId*/,
    AttestationPayload[] calldata /*attestationPayload*/,
    address /*replacer*/
  ) public {}

  function revoke(bytes32 attestationId, address /*revoker*/) public {
    emit AttestationRevoked(attestationId);
  }

  function bulkRevoke(bytes32[] memory attestationIds, address /*revoker*/) public {
    emit BulkAttestationsRevoked(attestationIds);
  }

  function getVersionNumber() public view returns (uint16) {
    return version;
  }

  function isRegistered(bytes32 attestationId) public pure returns (bool) {
    if (attestationId == bytes32("NotRegistered")) return false;
    return true;
  }

  function getAttestationIdCounter() public view returns (uint32) {
    return attestationIdCounter;
  }

  function getAttestation(bytes32 attestationId) public view returns (Attestation memory) {
    return attestations[attestationId];
  }
}
