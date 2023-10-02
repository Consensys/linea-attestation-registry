// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { IEAS, Attestation } from "../../src/interface/IEAS.sol";

contract EASRegistryMock is IEAS {
  mapping(bytes32 attestationId => Attestation attestation) private attestations;

  function getAttestation(bytes32 uid) external view override returns (Attestation memory) {
    return attestations[uid];
  }

  function addAttestation(Attestation memory attestation) external {
    attestations[attestation.uid] = attestation;
  }
}
