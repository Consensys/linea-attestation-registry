// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Attestation, AttestationPayload, Attestation } from "../../src/types/Structs.sol";

contract AttestationRegistryMock {
  bytes32 public _attestationId;
  uint16 public version;

  event AttestationRegistered();
  event BulkAttestationsRegistered();
  event AttestationRevoked(bytes32 attestationId, bytes32 replacedBy);
  event BulkAttestationsRevoked(bytes32[] attestationId, bytes32[] replacedBy);

  function test() public {}

  function attest(AttestationPayload calldata attestationPayload) public returns (Attestation memory) {
    require(bytes32(attestationPayload.schemaId) != 0 && tx.origin != address(0), "Invalid attestation payload");
    Attestation memory attestation = Attestation(
      bytes32(keccak256(abi.encode((1)))),
      attestationPayload.schemaId,
      tx.origin,
      msg.sender,
      attestationPayload.subject,
      block.timestamp,
      attestationPayload.expirationDate,
      false,
      0,
      bytes32(0),
      version,
      attestationPayload.attestationData
    );
    emit AttestationRegistered();
    return attestation;
  }

  function bulkAttest(AttestationPayload[] calldata attestationsPayloads) public returns (Attestation[] memory) {
    require(attestationsPayloads.length > 0, "Invalid attestations payloads");
    emit BulkAttestationsRegistered();
    Attestation[] memory attestations = new Attestation[](1);
    return attestations;
  }

  function revoke(bytes32 attestationId, bytes32 replacedBy) public {
    require(bytes32(attestationId) != 0, "Invalid attestation");
    emit AttestationRevoked(attestationId, replacedBy);
  }

  function bulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) public {
    require(attestationIds.length > 0, "Invalid attestation");
    emit BulkAttestationsRevoked(attestationIds, replacedBy);
  }

  function getAttestationId() public view returns (bytes32) {
    return _attestationId;
  }

  function getVersionNumber() public view returns (uint16) {
    return version;
  }
}
