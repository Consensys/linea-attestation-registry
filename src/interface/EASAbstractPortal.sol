// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Attestation, AttestationRequest } from "../types/Structs.sol";

//TODO: Add hooks with basic implementation
abstract contract EASAbstractPortal {
  function attest(AttestationRequest memory attestationRequest) external payable virtual;

  function getModules() external virtual returns (address[] memory);
}
