// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortal } from "../abstracts/AbstractPortal.sol";

/**
 * @title Issuer Portal
 * @author Consensys
 * @notice This is issuer portal for Explorer listing
 */
contract IssuersPortal is AbstractPortal {
  constructor(address[] memory modules, address router) AbstractPortal(modules, router) {}

  /// @inheritdoc AbstractPortal
  function withdraw(address payable to, uint256 amount) external override {}
}
