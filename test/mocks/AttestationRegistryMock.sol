// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { AttestationPayload } from "../../src/types/Structs.sol";

contract AttestationRegistryMock {
  event AttestationRegistered();
  event BulkAttestationRegistered();
  event AttestationRevoked(bytes32 attestationId, bytes32 replacedBy);
  event BulkAttestationsRevoked(bytes32[] attestationId, bytes32[] replacedBy);

  function test() public {}

  function attest(AttestationPayload calldata attestationPayload) public {
    require(bytes32(attestationPayload.schemaId) != 0, "Invalid attestation payload");
    emit AttestationRegistered();
  }

  function bulkAttest(AttestationPayload[] calldata attestationsPayloads) public {
    require(attestationsPayloads.length > 0, "Invalid attestations payloads");
    emit BulkAttestationRegistered();
  }

  function revoke(bytes32 attestationId, bytes32 replacedBy) public {
    require(bytes32(attestationId) != 0, "Invalid attestation");
    emit AttestationRevoked(attestationId, replacedBy);
  }

  function bulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) public {
    require(attestationIds.length > 0, "Invalid attestation");
    emit BulkAttestationsRevoked(attestationIds, replacedBy);
  }
}
