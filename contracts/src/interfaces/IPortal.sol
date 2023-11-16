// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

/**
 * @title IPortal
 * @author Consensys
 * @notice This contract is the interface to be implemented by any Portal.
 *         NOTE: A portal must implement this interface to registered on
 *         the PortalRegistry contract.
 */
interface IPortal is IERC165 {
  /**
   * @notice Get all the modules addresses used by the Portal
   * @return The list of modules addresses linked to the Portal
   */
  function getModules() external view returns (address[] memory);

  /**
   * @notice Defines the address of the entity issuing attestations to the subject
   * @dev We strongly encourage a reflection when implementing this method
   */
  function getAttester() external view returns (address);
}
