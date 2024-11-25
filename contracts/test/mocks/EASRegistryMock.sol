// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { IEAS, Attestation } from "../../src/interfaces/IEAS.sol";

contract EASRegistryMock is IEAS {
  /// @dev This empty method prevents Foundry from counting this contract in code coverage
  function test() public {}

  mapping(bytes32 attestationId => Attestation attestation) private attestations;

  function getAttestation(bytes32 uid) external view override returns (Attestation memory) {
    return attestations[uid];
  }

  function addAttestation(Attestation calldata attestation) external {
    attestations[attestation.uid] = attestation;
  }
}
