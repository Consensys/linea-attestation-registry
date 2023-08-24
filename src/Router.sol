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
  address private ATTESTATION_REGISTRY;
  address private MODULE_REGISTRY;
  address private PORTAL_REGISTRY;
  address private SCHEMA_REGISTRY;

  event AttestationRegistryUpdated(address indexed registryAddress);
  event ModuleRegistryUpdated(address indexed registryAddress);
  event PortalRegistryUpdated(address indexed registryAddress);
  event SchemaRegistryUpdated(address indexed registryAddress);

  function initialize() public initializer {
    __Ownable_init();
  }

  function getAttestationRegistry() external view override returns (address) {
    return ATTESTATION_REGISTRY;
  }

  function updateAttestationRegistry(address _attestationRegistry) public onlyOwner {
    ATTESTATION_REGISTRY = _attestationRegistry;
    emit AttestationRegistryUpdated(_attestationRegistry);
  }

  function getModuleRegistry() external view override returns (address) {
    return MODULE_REGISTRY;
  }

  function updateModuleRegistry(address _moduleRegistry) public onlyOwner {
    MODULE_REGISTRY = _moduleRegistry;
    emit ModuleRegistryUpdated(_moduleRegistry);
  }

  function getPortalRegistry() external view override returns (address) {
    return PORTAL_REGISTRY;
  }

  function updatePortalRegistry(address _portalRegistry) public onlyOwner {
    PORTAL_REGISTRY = _portalRegistry;
    emit PortalRegistryUpdated(_portalRegistry);
  }

  function getSchemaRegistry() external view override returns (address) {
    return SCHEMA_REGISTRY;
  }

  function updateSchemaRegistry(address _schemaRegistry) public onlyOwner {
    SCHEMA_REGISTRY = _schemaRegistry;
    emit SchemaRegistryUpdated(_schemaRegistry);
  }
}
