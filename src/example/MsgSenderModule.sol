// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../interface/AbstractModule.sol";
// solhint-disable-next-line max-line-length
import { IERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/IERC165Upgradeable.sol";
import { Initializable } from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import { AttestationPayload } from "../types/Structs.sol";

/**
 * @title Msg Sender Module
 * @author Consensys
 * @notice This contract is an example of a module, able to check if the transaction sender is a given address
 */
contract MsgSenderModule is IERC165Upgradeable, AbstractModule, Initializable {
  /// @dev The address expected by this module
  address public expectedMsgSender;

  /// @notice Error thrown when the transaction sender is not the expected address
  error WrongTransactionSender();

  /**
   * @notice Contract initialization
   */
  function initialize(address _expectedMsgSender) public initializer {
    expectedMsgSender = _expectedMsgSender;
  }

  /**
   * @notice The main method for the module, running the check
   */
  function run(
    AttestationPayload memory /*_attestationPayload*/,
    bytes[] memory _validationPayload,
    address _txSender
  ) public view override returns (bytes[] memory validationPayload) {
    validationPayload = _validationPayload;
    if (_txSender != expectedMsgSender) {
      revert WrongTransactionSender();
    }
  }

  /**
   * @notice To check this contract implements the Module interface
   */
  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return interfaceID == type(AbstractModule).interfaceId || interfaceID == type(IERC165Upgradeable).interfaceId;
  }
}
