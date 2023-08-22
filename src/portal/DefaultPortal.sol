// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Initializable } from "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";
import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { AbstractPortal } from "../interface/AbstractPortal.sol";
import { Attestation, AttestationPayload, Portal } from "../types/Structs.sol";

/**
 * @title Default Portal
 * @author Consensys
 * @notice This contract aims to provide a default portal
 */
contract DefaultPortal is Initializable, AbstractPortal, IERC165 {
  address[] public modules;
  ModuleRegistry public moduleRegistry;
  AttestationRegistry public attestationRegistry;

  /// @notice Error thown when attempting to initialize the default portal twice
  error PortalAlreadyInitialized();

  /// @notice Event emitted when a clone of default portal is initialized
  event DefaultPortalInitialized(address[] modules);

  /**
   * @notice Contract initialization
   */
  function initialize(
    address[] calldata _modules,
    address _moduleRegistry,
    address _attestationRegistry
  ) public initializer {
    // Store module registry and attestation registry addresses and modules
    attestationRegistry = AttestationRegistry(_attestationRegistry);
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
   * @dev Runs all modules for the portal and stores the attestation in AttestationRegistry
   */
  function attest(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload
  ) external payable override {
    moduleRegistry.runModules(modules, validationPayload);

    Attestation memory attestation = _buildAttestation(attestationPayload);

    attestationRegistry.attest(attestation);
  }

  /**
   * @notice Implements supports interface method declaring it is an AbstractPortal
   */
  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165).interfaceId;
  }

  /**
   * @notice Implements supports interface method declaring it is an AbstractPortal
   */
  function _buildAttestation(
    AttestationPayload memory attestationPayload
  ) private view returns (Attestation memory attestation) {
    //TODO: Add validations for attestation payload
    attestation = Attestation(
      attestationPayload.attestationId,
      attestationPayload.schemaId,
      attestationPayload.attester,
      address(this),
      attestationPayload.subject,
      block.timestamp,
      attestationPayload.expirationDate,
      false,
      1,
      attestationPayload.attestationData
    );

    return attestation;
  }
}
