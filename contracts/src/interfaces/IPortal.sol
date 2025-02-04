// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

/**
 * @title IPortal
 * @author Consensys
 * @notice This contract is the interface to be implemented by any Portal.
 *         NOTE: A portal must implement this interface to registered on
 *         the PortalRegistry contract.
 */
interface IPortal {
  /**
   * @notice Get all the modules addresses used by the Portal
   * @return The list of modules addresses linked to the Portal
   */
  function getModules() external view returns (address[] memory);
}
