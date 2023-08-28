// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { AttestationPayload } from "../../src/types/Structs.sol";

contract AttestationRegistryMock {
  event AttestationRegistered();
  event BulkAttestationRegistered();
  event AttestationRevoked(bytes32 attestationId, bytes32 replacedBy);

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
    require(bytes32(replacedBy) != 0, "Invalid replacement attestation");
    emit AttestationRevoked(attestationId, replacedBy);
  }
}
