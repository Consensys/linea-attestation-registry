// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../../src/abstracts/AbstractModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

/**
 * @title Correct Module
 * @author Consensys
 * @notice This contract illustrates a valid Module that follows the AbstractModule interface
 */
contract CorrectModule is AbstractModule {
  /// @dev This empty method prevents Foundry from counting this contract in code coverage
  function test() public {}

  /// @inheritdoc AbstractModule
  function run(
    AttestationPayload memory /*attestationPayload*/,
    bytes memory /*validationPayload*/,
    address /*txSender*/,
    uint256 /*value*/
  ) public pure override {}
}
