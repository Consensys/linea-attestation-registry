// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { AbstractModule } from "../interface/AbstractModule.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";
import { Initializable } from "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";

contract MsgSenderModule is IERC165, AbstractModule, Initializable {
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
    bytes32 /*_schemaId*/,
    address _msgSender
  ) public view override returns (bytes memory attestationPayload, bytes memory validationPayload) {
    attestationPayload = _attestationPayload;
    validationPayload = _validationPayload;
    if (_msgSender != expectedMsgSender) {
      revert("Incorrect message sender");
    }
  }

  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return interfaceID == type(AbstractModule).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}
