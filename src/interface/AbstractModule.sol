// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationPayload } from "../types/Structs.sol";

abstract contract AbstractModule {
  function run(
    AttestationPayload memory attestationPayload,
    bytes memory validationPayload,
    address txSender,
    uint256 value
  ) public virtual;
}
