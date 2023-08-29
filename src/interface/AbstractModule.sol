// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;
import { AttestationPayload } from "../types/Structs.sol";

abstract contract AbstractModule {
  function run(
    bytes[] memory validationPayload,
    address msgSender
  ) public virtual returns (bytes[] memory moduleValidationPayload);
}
