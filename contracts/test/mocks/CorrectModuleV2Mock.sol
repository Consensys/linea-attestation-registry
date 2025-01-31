// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "../../src/abstracts/AbstractModuleV2.sol";
import { OperationType } from "../../src/types/Enums.sol";
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
    AttestationPayload calldata /*attestationPayload*/,
    bytes calldata /*validationPayload*/,
    address /*initialCaller*/,
    uint256 /*value*/,
    address /*attester*/,
    address /*portal*/,
    OperationType /*operationType*/
  ) public pure override {}
}
