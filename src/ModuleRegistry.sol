// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Module } from "./struct/Module.sol";
import { AbstractModule } from "./interface/AbstractModule.sol";
import { Initializable } from "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import { ERC165Checker } from "openzeppelin-contracts/contracts/utils/introspection/ERC165Checker.sol";

/**
 * @title Module Registry
 * @author Consensys
 * @notice This contract aims to manage the Modules used by the Portals, including their discoverability
 */
contract ModuleRegistry is Initializable {
  /// @dev The list of Modules, accessed by their address
  mapping(address id => Module module) public modules;
  /// @dev The list of Module addresses
  address[] public moduleAddresses;

  /// @notice Error thrown when an identical Module was already registered
  error ModuleAlreadyExists();
  /// @notice Error thrown when attempting to add a Module without a name
  error ModuleNameMissing();
  /// @notice Error thrown when attempting to add a Module without an address of deployed smart contract
  error ModuleAddressInvalid();
  /// @notice Error thrown when attempting to add a Module which has not implemented the IModule interface
  error ModuleInvalid();

  /// @notice Event emitted when a Module is registered
  event ModuleRegistered(string name, string description, address moduleAddress);

  /**
   * @notice Contract initialization
   */
  function initialize() public initializer {}

  /**
   * Check if address is smart contract and not EOA
   * @param contractAddress address to be verified
   * @return the result as true if it is a smart contract else false
   */
  function isContractAddress(address contractAddress) public view returns (bool) {
    return contractAddress.code.length > 0;
  }

  /** Register a Module, with its metadata and run some checks:
   * - mandatory name
   * - mandatory module's deployed smart contract address
   * - the module must be unique
   * @param name the module name
   * @param description the module description
   * @param moduleAddress the address of the deployed smart contract
   * @dev the module is stored in a mapping, the number of modules is incremented and an event is emitted
   */
  function register(string memory name, string memory description, address moduleAddress) public {
    if (bytes(name).length == 0) {
      revert ModuleNameMissing();
    }

    // Check if moduleAddress is a smart contract address
    if (!isContractAddress(moduleAddress)) {
      revert ModuleAddressInvalid();
    }

    // Check if module has implemented AbstractModule
    if (!ERC165Checker.supportsInterface(moduleAddress, type(AbstractModule).interfaceId)) {
      revert ModuleInvalid();
    }

    // Module address is used to identify uniqueness of the module
    if (bytes(modules[moduleAddress].name).length > 0) {
      revert ModuleAlreadyExists();
    }

    modules[moduleAddress] = Module(name, description, moduleAddress);
    moduleAddresses.push(moduleAddress);
    emit ModuleRegistered(name, description, moduleAddress);
  }

  /**
   * @notice Get the number of Modules managed by the contract
   * @return The number of Modules already registered
   * @dev Returns the length of the `moduleAddresses` array
   */
  function getModulesNumber() public view returns (uint256) {
    return moduleAddresses.length;
  }
}
