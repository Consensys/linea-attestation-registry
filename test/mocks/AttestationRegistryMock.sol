// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;
import { AttestationPayload } from "../../src/types/Structs.sol";

contract AttestationRegistryMock {
  event AttestationRegistered();

  function test() public {}

  function attest(AttestationPayload calldata attestationPayload) public {
    require(bytes32(attestationPayload.schemaId) != 0, "Invalid attestation");
    emit AttestationRegistered();
  }
}
