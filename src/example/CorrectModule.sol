// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { AbstractModule } from "../interface/AbstractModule.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

contract CorrectModule is AbstractModule, IERC165 {
  function test() public {}

  function run(
    bytes memory attestationPayload,
    bytes memory validationPayload,
    bytes32 schemaId,
    address msgSender
  ) public pure override returns (bytes memory, bytes memory) {
    require(schemaId != "" && msgSender != address(0), "require schemaId and msgSender");
    return (attestationPayload, validationPayload);
  }

  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractModule).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}
