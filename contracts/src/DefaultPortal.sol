// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortal } from "./abstracts/AbstractPortal.sol";

/**
 * @title Default Portal
 * @author Consensys
 * @notice This contract aims to provide a default portal
 * @dev This Portal does not add any logic to the AbstractPortal
 */
contract DefaultPortal is AbstractPortal {
  /**
   * @notice Contract constructor
   * @param modules list of modules to use for the portal (can be empty)
   * @param router the Router's address
   * @dev This sets the addresses for the AttestationRegistry, ModuleRegistry and PortalRegistry
   */
  constructor(address[] memory modules, address router) AbstractPortal(modules, router) {}

  /// @inheritdoc AbstractPortal
  function withdraw(address payable to, uint256 amount) external override {}
}
