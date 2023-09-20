// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import { IRouter } from "./interface/IRouter.sol";

/**
 * @title Router
 * @author Consensys
 * @notice This contract aims to provides a single entrypoint for the Verax registries
 */
contract Router is IRouter, OwnableUpgradeable {
  address private _attestationRegistry;
  address private _moduleRegistry;
  address private _portalRegistry;
  address private _schemaRegistry;

  event AttestationRegistryUpdated(address indexed registryAddress);
  event ModuleRegistryUpdated(address indexed registryAddress);
  event PortalRegistryUpdated(address indexed registryAddress);
  event SchemaRegistryUpdated(address indexed registryAddress);

  function initialize() public initializer {
    __Ownable_init();
  }

  function getAttestationRegistry() external view override returns (address) {
    return _attestationRegistry;
  }

  function updateAttestationRegistry(address attestationRegistry) public onlyOwner {
    _attestationRegistry = attestationRegistry;
    emit AttestationRegistryUpdated(_attestationRegistry);
  }

  function getModuleRegistry() external view override returns (address) {
    return _moduleRegistry;
  }

  function updateModuleRegistry(address moduleRegistry) public onlyOwner {
    _moduleRegistry = moduleRegistry;
    emit ModuleRegistryUpdated(_moduleRegistry);
  }

  function getPortalRegistry() external view override returns (address) {
    return _portalRegistry;
  }

  function updatePortalRegistry(address portalRegistry) public onlyOwner {
    _portalRegistry = portalRegistry;
    emit PortalRegistryUpdated(_portalRegistry);
  }

  function getSchemaRegistry() external view override returns (address) {
    return _schemaRegistry;
  }

  function updateSchemaRegistry(address schemaRegistry) public onlyOwner {
    _schemaRegistry = schemaRegistry;
    emit SchemaRegistryUpdated(_schemaRegistry);
  }
}
