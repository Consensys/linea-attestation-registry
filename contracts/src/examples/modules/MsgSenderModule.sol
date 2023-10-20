// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../../interface/AbstractModule.sol";
import { AttestationPayload } from "../../types/Structs.sol";

/**
 * @title Msg Sender Module
 * @author Consensys
 * @notice This contract is an example of a module, able to check if the transaction sender is a given address
 * @dev A module should not be initializable (to prevent it from being upgradeable)
 */
contract MsgSenderModule is AbstractModule {
  /// @dev The address expected by this module
  address public expectedMsgSender;

  /// @notice Error thrown when the transaction sender is not the expected address
  error WrongTransactionSender();

  /**
   * @param _expectedMsgSender the expected caller to be validated against
   */
  constructor(address _expectedMsgSender) {
    expectedMsgSender = _expectedMsgSender;
  }

  /**
   * @inheritdoc AbstractModule
   * @notice If the transaction sender is not the expected address, an error is thrown
   */
  function run(
    AttestationPayload memory /*_attestationPayload*/,
    bytes memory /*_validationPayload*/,
    address _txSender,
    uint256 /*_value*/
  ) public view override {
    if (_txSender != expectedMsgSender) {
      revert WrongTransactionSender();
    }
  }
}
