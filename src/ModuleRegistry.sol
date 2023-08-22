// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationPayload, Module } from "./types/Structs.sol";
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
  /// @notice Error thrown when attempting to run modules with no module addresses provided
  error ModulesAddressesMissing();
  /// @notice Error thrown when attempting to run modules with no attestation payload provided
  error AttestationPayloadMissing();
  /// @notice Error thrown when attempting to run modules with no validation payload provided
  error ValidationPayloadMissing();
  /// @notice Error thrown when module is not registered
  error ModuleNotRegistered();

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

  /** Execute run method from given Modules:
   * - mandatory list of modules
   * - the module must be registered
   * @param modulesAddresses the addresses of the registered modules
   * @dev check if modules are registered and execute run method for each module
   */
  function runModules(
    address[] memory modulesAddresses,
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload
  ) public {
    // Check if modules addresses are not missing
    if (modulesAddresses.length == 0) revert ModulesAddressesMissing();

    // Check if mandatory fields in attestation payload are not missing
    if (
      bytes32(attestationPayload.attestationId).length == 0 ||
      bytes32(attestationPayload.attestationId).length == 0 ||
      address(attestationPayload.attester) == address(0) ||
      bytes(attestationPayload.subject).length == 0
    ) revert AttestationPayloadMissing();

    // Check if validation payload is not missing
    if (validationPayload.length == 0) revert ValidationPayloadMissing();

    // For each module check if it is registered and call run method
    for (uint i = 0; i < modulesAddresses.length; i++) {
      if (bytes(modules[modulesAddresses[i]].name).length == 0) revert ModuleNotRegistered();
      AbstractModule(modulesAddresses[i]).run(attestationPayload, validationPayload, msg.sender);
    }
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
