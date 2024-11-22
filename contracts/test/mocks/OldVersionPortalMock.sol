// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortal } from "../../src/abstracts/AbstractPortal.sol";

contract OldVersionPortalMock is AbstractPortal {
  constructor(address[] memory modules, address router) AbstractPortal(modules, router) {}

  function test() public {}

  function withdraw(address payable to, uint256 amount) external override {}
}
