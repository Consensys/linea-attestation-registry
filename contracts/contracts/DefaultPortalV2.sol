// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortalV2 } from "./abstracts/AbstractPortalV2.sol";

/**
 * @title Default Portal V2
 * @author Consensys
 * @notice This contract aims to provide a default portal compatible with the V2 version of Abstract Portal
 * @dev This Portal does not add any logic to the AbstractPortalV2
 */
contract DefaultPortalV2 is AbstractPortalV2 {
  /**
   * @notice Contract constructor
   * @param modules list of modules to use for the portal (can be empty). The modules should be based on AbstractModuleV2
   * @param router the Router's address
   * @dev This sets the addresses for the AttestationRegistry, ModuleRegistry and PortalRegistry
   */
  constructor(address[] memory modules, address router) AbstractPortalV2(modules, router) {}
}
