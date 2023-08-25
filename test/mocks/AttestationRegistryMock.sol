// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { AttestationPayload, Attestation } from "../../src/types/Structs.sol";

contract AttestationRegistryMock {
  bytes32 public _attestationId;
  uint16 public version;

  event AttestationRegistered();
  event AttestationRevoked(bytes32 attestationId, bytes32 replacedBy);

  function test() public {}

  function attest(
    AttestationPayload calldata attestationPayload,
    address attester
  ) public returns (Attestation memory) {
    require(bytes32(attestationPayload.schemaId) != 0 && attester != address(0), "Invalid attestation");
    Attestation memory attestation = Attestation(
      bytes32(keccak256(abi.encode((1)))),
      attestationPayload.schemaId,
      attester,
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

  function revoke(bytes32 attestationId, bytes32 replacedBy) public {
    require(bytes32(attestationId) != 0, "Invalid attestation");
    require(bytes32(replacedBy) != 0, "Invalid replacement attestation");
    emit AttestationRevoked(attestationId, replacedBy);
  }

  function getAttestationId() public view returns (bytes32) {
    return _attestationId;
  }

  function getVersionNumber() public view returns (uint16) {
    return version;
  }
}
