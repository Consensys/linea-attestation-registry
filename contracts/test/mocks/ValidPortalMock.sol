// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortalV2 } from "../../src/abstracts/AbstractPortalV2.sol";

contract ValidPortalMock is AbstractPortalV2 {
  constructor(address[] memory modules, address router) AbstractPortalV2(modules, router) {}

  function test() public {}

  function withdraw(address payable to, uint256 amount) external override {}
}
