// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Module } from "./struct/Module.sol";
import "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import "openzeppelin-contracts/contracts/utils/introspection/ERC165Checker.sol";

/**
 * @title Module Registry
 * @author Consensys
 * @notice This contract aims to manage the Modules used by the Portals, including their discoverability
 */
contract ModuleRegistry is Initializable {
  /// @dev The contract administrator
  address private admin;
  /// @dev The list of Modules, accessed by their ID
  mapping(address id => Module module) public modules;
  /// @dev The number of Modules already registered
  uint256 public numberOfModules = 0;

  /// @notice Error thrown when an identical Module was already registered
  error ModuleAlreadyExists();
  /// @notice Error thrown when attempting to add a Module without a name
  error ModuleNameMissing();
  /// @notice Error thrown when attempting to add a Module without an address of deployed smart contract
  error ModuleAddressInvalid();
  /// @notice Error thrown when attempting to add a Module which has not implemented the IModule interface
  error ModuleInvalid();

  /// @notice Event emitted when a Module is created and registered
  event ModuleCreated(string name, string description, address moduleAddress);

  /**
   * @notice Contract initialization
   * @param _admin The administrator of the contract
   */
  function initialize(address _admin) public initializer {
    admin = _admin;
  }

  /**
   * Check if address is smart contract and not EOA
   * @param contractAddress address to be verified
   * @return the result as true if it is a smart contract else false
   */
  function isContractAddress(address contractAddress) public view returns (bool) {
    return contractAddress.code.length > 0;
  }

  /**
   * @notice Get the administrator address for this contract
   * @return The contract's administrator address
   */
  function getAdmin() public view returns (address) {
    return admin;
  }

  /** Create a Module, with its metadata and run some checks:
   * - mandatory name
   * - mandatory module's deployed smart contract address
   * - the module must be unique
   * @param name the module name
   * @param description the module description
   * @param moduleAddress the address of the deployed smart contract
   * @dev the module is stored in a mapping, the number of modules is incremented and an event is emitted
   */
  function createModule(string memory name, string memory description, address moduleAddress) public {
    if (bytes(name).length == 0) {
      revert ModuleNameMissing();
    }

    // Check if moduleAddress is a smart contract address
    if (!isContractAddress(moduleAddress)) {
      revert ModuleAddressInvalid();
    }

    // Check if module has implemented ModuleInterface
    if (!ERC165Checker.supportsInterface(moduleAddress, type(ModuleInterface).interfaceId)) {
      revert ModuleInvalid();
    }

    // Module address is used to identify uniqueness of the module
    if (bytes(modules[moduleAddress].name).length > 0) {
      revert ModuleAlreadyExists();
    }

    modules[moduleAddress] = Module(name, description, moduleAddress);
    numberOfModules++;
    emit ModuleCreated(name, description, moduleAddress);
  }
}

//TODO: Replace this interface with proper module interface in future user story
interface ModuleInterface {
  function run() external view returns (bool);
}
