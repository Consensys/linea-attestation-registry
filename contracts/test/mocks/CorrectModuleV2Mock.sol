// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "../../src/abstracts/AbstractModuleV2.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

/**
 * @title Correct Module V2
 * @author Consensys
 * @notice This contract illustrates a valid Module that follows the AbstractModule interface
 */
contract CorrectModuleV2 is AbstractModuleV2 {
  /// @dev This empty method prevents Foundry from counting this contract in code coverage
  function test() public {}

  /// @inheritdoc AbstractModuleV2
  function run(
    AttestationPayload memory /*attestationPayload*/,
    bytes memory /*validationPayload*/,
    address /*initialCaller*/,
    uint256 /*value*/,
    address /*attester*/,
    address /*portal*/
  ) public pure override {}
}
