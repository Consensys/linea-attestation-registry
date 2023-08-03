// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { ModuleInterface } from "../interface/ModuleInterface.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

contract CorrectModule is ModuleInterface, IERC165 {
  function run() external pure returns (bool) {
    return true;
  }

  function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
    return interfaceID == type(ModuleInterface).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}
