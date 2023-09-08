// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

interface IRouter {
  function getAttestationRegistry() external view returns (address);

  function getModuleRegistry() external view returns (address);

  function getPortalRegistry() external view returns (address);

  function getSchemaRegistry() external view returns (address);
}
