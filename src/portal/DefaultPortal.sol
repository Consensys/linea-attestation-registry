// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Initializable } from "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { AbstractPortal } from "../interface/AbstractPortal.sol";
import { Portal } from "../struct/Portal.sol";

/**
 * @title Default Portal
 * @author Consensys
 * @notice This contract aims to provide a default portal
 */
contract DefaultPortal is Initializable, AbstractPortal, IERC165 {
  address[] public modules;
  ModuleRegistry public moduleRegistry;

  /// @notice Error thown when attempting to initialize the default portal twice
  error PortalAlreadyInitialized();

  /// @notice Event emitted when a clone of default portal is initialized
  event DefaultPortalInitialized(address[] modules);

  /**
   * @notice Contract initialization
   */
  function initialize(address[] calldata _modules, address _moduleRegistry) public initializer {
    // Store module registry address and modules
    moduleRegistry = ModuleRegistry(_moduleRegistry);
    modules = _modules;
    // Emit event
    emit DefaultPortalInitialized(modules);
  }

  /**
   * @notice Get all modules from the default portal clone
   * @return The Modules
   */
  function getModules() external view override returns (address[] memory) {
    return modules;
  }

  /**
   * @notice attest the schema with given attestationPayload and validationPayload
   * @return The result of attestation success or failure
   * @dev Runs all modules for the portal and stores the attestation in AttestationRegistry
   */
  function attest(
    bytes32 schemaId,
    bytes memory attestationPayload,
    bytes memory validationPayload
  ) external override returns (bool) {
    moduleRegistry.runModules(modules, schemaId, attestationPayload, validationPayload);
    //TODO : store the attestation on the AttestationRegistry
    return true;
  }

  /**
   * @notice Implements supports interface method declaring it is an AbstractPortal
   */
  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}
