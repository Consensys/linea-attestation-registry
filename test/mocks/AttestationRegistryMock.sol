// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationPayload, Attestation } from "../../src/types/Structs.sol";

contract AttestationRegistryMock {
  uint16 public version;
  uint32 private attestationIdCounter;
  mapping(bytes32 attestationId => Attestation attestation) private attestations;

  event AttestationRegistered();
  event BulkAttestationsRegistered();
  event AttestationRevoked(bytes32 attestationId, bytes32 replacedBy);
  event BulkAttestationsRevoked(bytes32[] attestationId, bytes32[] replacedBy);

  function test() public {}

  function attest(AttestationPayload calldata attestationPayload, address attester) public {
    require(bytes32(attestationPayload.schemaId) != 0, "Invalid attestationPayload");
    require(attester != address(0), "Invalid attester");

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

  function bulkAttest(AttestationPayload[] calldata attestationsPayloads, address attester) public {
    require(attestationsPayloads.length > 0, "Invalid attestationsPayloads");
    require(attester != address(0), "Invalid attester");
    emit BulkAttestationsRegistered();
  }

  function revoke(bytes32 attestationId, bytes32 replacedBy) public {
    require(bytes32(attestationId) != 0, "Invalid attestation");
    emit AttestationRevoked(attestationId, replacedBy);
  }

  function bulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) public {
    require(attestationIds.length > 0, "Invalid attestation");
    emit BulkAttestationsRevoked(attestationIds, replacedBy);
  }

  function getVersionNumber() public view returns (uint16) {
    return version;
  }

  function getAttestation(bytes32 attestationId) public view returns (Attestation memory) {
    return attestations[attestationId];
  }
}
