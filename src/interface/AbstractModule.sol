// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;
import { AttestationPayload } from "../types/Structs.sol";

abstract contract AbstractModule {
  function run(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload,
    address msgSender
  ) public virtual returns (AttestationPayload memory moduleAttestationPayload, bytes[] memory moduleValidationPayload);
}
