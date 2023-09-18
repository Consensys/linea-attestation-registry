// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortal } from "../../src/interface/AbstractPortal.sol";

contract ValidPortalMock is AbstractPortal {
  function test() public {}

  function withdraw(address payable to, uint256 amount) external override {}
}
