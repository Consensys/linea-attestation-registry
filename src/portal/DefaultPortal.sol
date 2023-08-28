// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Initializable } from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
// solhint-disable-next-line max-line-length
import { IERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165Upgradeable.sol";
import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { AbstractPortal } from "../interface/AbstractPortal.sol";
import { Attestation, AttestationPayload, Portal } from "../types/Structs.sol";

/**
 * @title Default Portal
 * @author Consensys
 * @notice This contract aims to provide a default portal
 */
contract DefaultPortal is Initializable, AbstractPortal, IERC165Upgradeable {
  address[] public modules;
  ModuleRegistry public moduleRegistry;
  AttestationRegistry public attestationRegistry;

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
   * @param attestationPayload the payload to attest
   * @param validationPayload the payload to validate in order to issue the attestation
   * @dev Runs all modules for the portal and registers the attestation using AttestationRegistry
   */
  function attest(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload
  ) external payable override {
    // Run all modules
    moduleRegistry.runModules(modules, validationPayload);
    // Register attestation using attestation registry
    attestationRegistry.attest(attestationPayload);
  }

  /**
   * @notice Bulk attest the schema with payloads to attest and validation payloads
   * @param attestationsPayloads the payloads to attest
   * @param validationPayloads the payloads to validate in order to issue the attestations
   */
  function bulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) external payable override {
    // Run all modules for all payloads
    moduleRegistry.bulkRunModules(modules, validationPayloads);
    // Register attestations using the attestation registry
    attestationRegistry.bulkAttest(attestationsPayloads);
  }

  /**
   * @notice Revokes an attestation for given identifier and can replace it by an other one
   * @param attestationId the attestation ID to revoke
   * @param replacedBy the replacing attestation ID
   */
  function revoke(bytes32 attestationId, bytes32 replacedBy) external override {
    attestationRegistry.revoke(attestationId, replacedBy);
  }

  /**
   * @notice Bulk revokes attestations for given identifiers and can replace them by new ones
   * @param attestationIds the attestations IDs to revoke
   * @param replacedBy the replacing attestations IDs (leave an ID empty to just revoke)
   */
  function bulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) external override {
    attestationRegistry.bulkRevoke(attestationIds, replacedBy);
  }

  /**
   * @notice Implements supports interface method declaring it is an AbstractPortal
   */
  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165Upgradeable).interfaceId;
  }
}
