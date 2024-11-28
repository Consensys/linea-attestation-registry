// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

/**
 * @title Router
 * @author Consensys
 * @notice This contract aims to provides a single entrypoint for the Verax registries
 */
interface IRouter {
  /**
   * @notice Gives the address for the AttestationRegistry contract
   * @return The current address of the AttestationRegistry contract
   */
  function getAttestationRegistry() external view returns (address);

  /**
   * @notice Gives the address for the ModuleRegistry contract
   * @return The current address of the ModuleRegistry contract
   */
  function getModuleRegistry() external view returns (address);

  /**
   * @notice Gives the address for the PortalRegistry contract
   * @return The current address of the PortalRegistry contract
   */
  function getPortalRegistry() external view returns (address);

  /**
   * @notice Gives the address for the SchemaRegistry contract
   * @return The current address of the SchemaRegistry contract
   */
  function getSchemaRegistry() external view returns (address);
}
