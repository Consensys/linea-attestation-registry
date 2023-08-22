// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;
import { Attestation } from "../../src/types/Structs.sol";

contract AttestationRegistryMock {
  event AttestationRegistered();

  function test() public {}

  function attest(Attestation memory attestation) public {
    require(bytes32(attestation.attestationId) != 0, "Invalid attestation");
    emit AttestationRegistered();
  }
}
