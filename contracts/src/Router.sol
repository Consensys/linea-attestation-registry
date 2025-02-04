// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { IRouter } from "./interfaces/IRouter.sol";

/**
 * @title Router
 * @author Consensys
 * @notice This contract aims to register the addresses of the Verax registries
 */
contract Router is IRouter, OwnableUpgradeable {
  address private ATTESTATION_REGISTRY;
  address private MODULE_REGISTRY;
  address private PORTAL_REGISTRY;
  address private SCHEMA_REGISTRY;

  error RegistryAlreadySet();

  event AttestationRegistryUpdated(address indexed registryAddress);
  event ModuleRegistryUpdated(address indexed registryAddress);
  event PortalRegistryUpdated(address indexed registryAddress);
  event SchemaRegistryUpdated(address indexed registryAddress);

  function initialize() public initializer {
    __Ownable_init();
  }

  /// @inheritdoc IRouter
  function getAttestationRegistry() external view override returns (address) {
    return ATTESTATION_REGISTRY;
  }

  /**
   * @notice Changes the address for the AttestationRegistry contract
   * @param _attestationRegistry The new address of the AttestationRegistry contract
   */
  function updateAttestationRegistry(address _attestationRegistry) public onlyOwner {
    if (ATTESTATION_REGISTRY != address(0)) revert RegistryAlreadySet();
    ATTESTATION_REGISTRY = _attestationRegistry;
    emit AttestationRegistryUpdated(_attestationRegistry);
  }

  /// @inheritdoc IRouter
  function getModuleRegistry() external view override returns (address) {
    return MODULE_REGISTRY;
  }

  /**
   * @notice Changes the address for the ModuleRegistry contract
   * @param _moduleRegistry The new address of the ModuleRegistry contract
   */
  function updateModuleRegistry(address _moduleRegistry) public onlyOwner {
    if (MODULE_REGISTRY != address(0)) revert RegistryAlreadySet();
    MODULE_REGISTRY = _moduleRegistry;
    emit ModuleRegistryUpdated(_moduleRegistry);
  }

  /// @inheritdoc IRouter
  function getPortalRegistry() external view override returns (address) {
    return PORTAL_REGISTRY;
  }

  /**
   * @notice Changes the address for the PortalRegistry contract
   * @param _portalRegistry The new address of the PortalRegistry contract
   */
  function updatePortalRegistry(address _portalRegistry) public onlyOwner {
    if (PORTAL_REGISTRY != address(0)) revert RegistryAlreadySet();
    PORTAL_REGISTRY = _portalRegistry;
    emit PortalRegistryUpdated(_portalRegistry);
  }

  /// @inheritdoc IRouter
  function getSchemaRegistry() external view override returns (address) {
    return SCHEMA_REGISTRY;
  }

  /**
   * @notice Changes the address for the SchemaRegistry contract
   * @param _schemaRegistry The new address of the SchemaRegistry contract
   */
  function updateSchemaRegistry(address _schemaRegistry) public onlyOwner {
    if (SCHEMA_REGISTRY != address(0)) revert RegistryAlreadySet();
    SCHEMA_REGISTRY = _schemaRegistry;
    emit SchemaRegistryUpdated(_schemaRegistry);
  }
}
