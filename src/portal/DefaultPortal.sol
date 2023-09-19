// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortal } from "../interface/AbstractPortal.sol";

/**
 * @title Default Portal
 * @author Consensys
 * @notice This contract aims to provide a default portal
 * @dev This Portal does not add any logic to the AbstractPortal
 */
contract DefaultPortal is AbstractPortal {
  constructor(address[] memory modules, address router) AbstractPortal(modules, router) {}

  function withdraw(address payable to, uint256 amount) external override {}
}
