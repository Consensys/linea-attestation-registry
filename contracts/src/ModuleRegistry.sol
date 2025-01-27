// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { OperationType } from "./types/Enums.sol";
import { AttestationPayload, Module } from "./types/Structs.sol";
import { AbstractModule } from "./abstracts/AbstractModule.sol";
import { AbstractModuleV2 } from "./abstracts/AbstractModuleV2.sol";
// solhint-disable-next-line max-line-length
import { ERC165CheckerUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol";
import { PortalRegistry } from "./PortalRegistry.sol";
import { IRouter } from "./interfaces/IRouter.sol";
import { uncheckedInc32 } from "./Common.sol";

/**
 * @title Module Registry
 * @author Consensys
 * @notice This contract aims to manage the Modules used by the Portals, including their discoverability
 */
contract ModuleRegistry is OwnableUpgradeable {
  IRouter public router;
  /// @dev The list of Modules, accessed by their address
  mapping(address id => Module module) public modules;
  /**
   * @dev [DEPRECATED] This field is no longer used or updated.
   * It previously stored the list of Module addresses, but its functionality has been deprecated.
   * While this variable cannot be removed due to storage layout constraints in upgradeable contracts,
   * it should not be relied upon as it no longer serves any purpose.
   */
  address[] private moduleAddresses;

  /// @notice Error thrown when a non-allowlisted user tries to call a forbidden method
  error OnlyAllowlisted();
  /// @notice Error thrown when an identical Module was already registered
  error ModuleAlreadyExists();
  /// @notice Error thrown when attempting to add a Module without a name
  error ModuleNameMissing();
  /// @notice Error thrown when attempting to add a Module without an address of deployed smart contract
  error ModuleAddressInvalid();
  /// @notice Error thrown when attempting to add a Module which has not implemented the IModule interface
  error ModuleInvalid();
  /// @notice Error thrown when attempting to run modules with no attestation payload provided
  error AttestationPayloadMissing();
  /// @notice Error thrown when module is not registered
  error ModuleNotRegistered();
  /// @notice Error thrown when module addresses and validation payload length mismatch
  error ModuleValidationPayloadMismatch();

  /// @notice Event emitted when a Module is registered
  event ModuleRegistered(string name, string description, address moduleAddress);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice Contract initialization
   * @param _router the address of the Router contract
   */
  function initialize(address _router) public initializer {
    __Ownable_init();
    router = IRouter(_router);
  }

  /**
   * @notice Checks if the caller is allowlisted.
   * @param user the user address
   */
  modifier onlyAllowlisted(address user) {
    if (!PortalRegistry(router.getPortalRegistry()).isAllowlisted(user)) revert OnlyAllowlisted();
    _;
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
   * @notice Registers a Module, with its metadata and run some checks:
   * - mandatory name
   * - mandatory module's deployed smart contract address
   * - the module must be unique
   * @param name the module name
   * @param description the module description
   * @param moduleAddress the address of the deployed smart contract
   * @dev the module is stored in a mapping, the number of modules is incremented and an event is emitted
   */
  function register(
    string memory name,
    string memory description,
    address moduleAddress
  ) public onlyAllowlisted(msg.sender) {
    if (bytes(name).length == 0) revert ModuleNameMissing();
    // Check if moduleAddress is a smart contract address
    if (!isContractAddress(moduleAddress)) revert ModuleAddressInvalid();
    // Check if module has implemented AbstractModule or AbstractModuleV2
    if (!ERC165CheckerUpgradeable.supportsInterface(moduleAddress, type(AbstractModuleV2).interfaceId)) {
      revert ModuleInvalid();
    }
    // Module address is used to identify uniqueness of the module
    if (bytes(modules[moduleAddress].name).length > 0) revert ModuleAlreadyExists();

    modules[moduleAddress] = Module(moduleAddress, name, description);
    emit ModuleRegistered(name, description, moduleAddress);
  }

  /**
   * @notice Executes the run method for all given Modules that are registered
   * @param modulesAddresses the addresses of the registered modules
   * @param attestationPayload the payload to attest
   * @param validationPayloads the payloads to check for each module (one payload per module)
   * @dev check if modules are registered and execute run method for each module
   */
  function runModules(
    address[] memory modulesAddresses,
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayloads,
    uint256 value
  ) public {
    // If no module provided, bypass module validation
    if (modulesAddresses.length == 0) return;
    // Each module involved must have a corresponding item from the validation payload
    if (modulesAddresses.length != validationPayloads.length) revert ModuleValidationPayloadMismatch();

    // For each module, check if it is registered and call its run method
    for (uint32 i = 0; i < modulesAddresses.length; i = uncheckedInc32(i)) {
      if (!isRegistered(modulesAddresses[i])) revert ModuleNotRegistered();
      // solhint-disable avoid-tx-origin
      AbstractModule(modulesAddresses[i]).run(attestationPayload, validationPayloads[i], tx.origin, value);
    }
  }

  /**
   * @notice Executes the V2 run method for all given Modules that are registered
   * @param modulesAddresses the addresses of the registered modules
   * @param attestationPayload the payload to attest
   * @param validationPayloads the payloads to check for each module (one payload per module)
   * @param value the value (ETH) optionally passed in the attesting transaction
   * @param initialCaller the address of the initial caller (transaction sender)
   * @param attester the address defined by the Portal as the attester for this payload
   * @dev check if modules are registered and execute the V2 run method for each module
   */
  function runModulesV2(
    address[] memory modulesAddresses,
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayloads,
    uint256 value,
    address initialCaller,
    address attester,
    OperationType operationType
  ) public {
    // If no module provided, bypass module validation
    if (modulesAddresses.length == 0) return;
    // Each module involved must have a corresponding item from the validation payload
    if (modulesAddresses.length != validationPayloads.length) revert ModuleValidationPayloadMismatch();

    // For each module, check if it is registered and call its run method
    for (uint32 i = 0; i < modulesAddresses.length; i = uncheckedInc32(i)) {
      if (!isRegistered(modulesAddresses[i])) revert ModuleNotRegistered();
      AbstractModuleV2(modulesAddresses[i]).run(
        attestationPayload,
        validationPayloads[i],
        initialCaller,
        value,
        attester,
        msg.sender,
        operationType
      );
    }
  }

  /**
   * @notice Executes the modules validation for all attestations payloads for all given Modules that are registered
   * @param modulesAddresses the addresses of the registered modules
   * @param attestationsPayloads the payloads to attest
   * @param validationPayloads the payloads to check for each module
   * @dev NOTE: Currently the bulk run modules does not handle payable modules
   *            a default value of 0 is used.
   * @dev DISCLAIMER: This method may have unexpected behavior if one of the checks is done on the attestation ID
   *                  as this ID won't be incremented before the end of the transaction.
   *                  If you need to check the attestation ID, please use the `attest` method.
   */
  function bulkRunModules(
    address[] memory modulesAddresses,
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) public {
    for (uint32 i = 0; i < attestationsPayloads.length; i = uncheckedInc32(i)) {
      runModules(modulesAddresses, attestationsPayloads[i], validationPayloads[i], 0);
    }
  }

  /**
   * @notice Executes the V2 modules validation for all attestations payloads for all given V2 Modules that are registered
   * @param modulesAddresses the addresses of the registered modules
   * @param attestationPayloads the payloads to attest
   * @param validationPayloads the payloads to check for each module
   * @dev NOTE: Currently the bulk run modules does not handle payable modules
   *            a default value of 0 is used.
   * @dev DISCLAIMER: This method may have unexpected behavior if one of the checks is done on the attestation ID
   *                  as this ID won't be incremented before the end of the transaction.
   *                  If you need to check the attestation ID, please use the `attestV2` method.
   */
  function bulkRunModulesV2(
    address[] memory modulesAddresses,
    AttestationPayload[] memory attestationPayloads,
    bytes[][] memory validationPayloads,
    address initialCaller,
    address attester,
    OperationType operationType
  ) public {
    for (uint32 i = 0; i < attestationPayloads.length; i = uncheckedInc32(i)) {
      runModulesV2(
        modulesAddresses,
        attestationPayloads[i],
        validationPayloads[i],
        0,
        initialCaller,
        attester,
        operationType
      );
    }
  }

  /**
   * @notice Checks that a module is registered in the module registry
   * @param moduleAddress The address of the Module to check
   * @return True if the Module is registered, False otherwise
   */
  function isRegistered(address moduleAddress) public view returns (bool) {
    return bytes(modules[moduleAddress].name).length > 0;
  }
}
