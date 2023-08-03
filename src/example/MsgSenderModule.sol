// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Module } from "../interface/Module.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";
import { Initializable } from "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";

contract MsgSenderModule is IERC165, Module, Initializable {
  address public expectedMsgSender;

  /**
   * @notice Contract initialization
   */
  function initialize(address _expectedMsgSender) public initializer {
    expectedMsgSender = _expectedMsgSender;
  }

  function run(
    bytes memory _attestationPayload,
    bytes memory _validationPayload,
    bytes32 _schemaId,
    address _msgSender
  )
    external
    view
    returns (
      bytes memory attestationPayload,
      bytes memory validationPayload,
      bytes32 schemaId,
      address msgSender,
      bool isValid
    )
  {
    attestationPayload = _attestationPayload;
    validationPayload = _validationPayload;
    schemaId = _schemaId;
    msgSender = _msgSender;
    isValid = false;

    if (_msgSender == expectedMsgSender) {
      isValid = true;
    }
  }

  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return interfaceID == type(Module).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}
