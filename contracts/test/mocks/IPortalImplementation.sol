// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { IPortal } from "../../src/interfaces/IPortal.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

contract IPortalImplementation is IPortal {
  function test() public {}

  function getModules() external pure override returns (address[] memory) {
    return new address[](0);
  }

  function getAttester() external view override returns (address) {
    return msg.sender;
  }

  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(IPortal).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}
