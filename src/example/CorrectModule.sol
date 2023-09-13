// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../interface/AbstractModule.sol";
import { AttestationPayload } from "../types/Structs.sol";

contract CorrectModule is AbstractModule {
  function test() public {}

  function run(
    AttestationPayload memory /*attestationPayload*/,
    bytes memory validationPayload,
    address /*txSender*/,
    uint256 /*value*/
  ) public pure override {}
}
