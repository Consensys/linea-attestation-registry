// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Initializable } from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
// solhint-disable-next-line max-line-length
import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { AbstractPortal } from "../interface/AbstractPortal.sol";
import { Attestation, AttestationPayload, Portal } from "../types/Structs.sol";

/**
 * @title Default Portal
 * @author Consensys
 * @notice This contract aims to provide a default portal
 */
contract DefaultPortal is Initializable, AbstractPortal {
  constructor(
    address[] memory _modules,
    address _moduleRegistry,
    address _attestationRegistry
  ) AbstractPortal(_modules, _moduleRegistry, _attestationRegistry) {
    _disableInitializers();
  }

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

  function _beforeAttest(AttestationPayload memory attestation, uint256 value) internal override {}

  function _afterAttest(Attestation memory attestation, uint256 value) internal override {}

  /**
   * @notice attest the schema with given attestationPayload and validationPayload
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
   * @notice Revokes an attestation for given identifier and can replace it by an other one
   * @param attestationId the attestation ID to revoke
   * @param replacedBy the replacing attestation ID
   */
  function revoke(bytes32 attestationId, bytes32 replacedBy) external override {
    attestationRegistry.revoke(attestationId, replacedBy);
  }

  /**
   * @notice Implements supports interface method declaring it is an AbstractPortal
   */
  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165Upgradeable).interfaceId;
  }
}
