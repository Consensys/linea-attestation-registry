// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { Attestation, AttestationPayload } from "../types/Structs.sol";
// solhint-disable-next-line max-line-length
import { IERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165Upgradeable.sol";
import { Initializable } from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";

abstract contract AbstractPortal is Initializable, IERC165Upgradeable {
  address[] public modules;
  ModuleRegistry public moduleRegistry;
  AttestationRegistry public attestationRegistry;
  error ModulePayloadMismatch();

  /**
   * @notice Contract initialization
   */
  function initialize(
    address[] calldata _modules,
    address _moduleRegistry,
    address _attestationRegistry
  ) public virtual initializer {
    // Store module registry and attestation registry addresses and modules
    attestationRegistry = AttestationRegistry(_attestationRegistry);
    moduleRegistry = ModuleRegistry(_moduleRegistry);
    modules = _modules;
  }

  /**
   * @notice attest the schema with given attestationPayload and validationPayload
   * @dev Runs all modules for the portal and registers the attestation using AttestationRegistry
   */
  function attest(AttestationPayload memory attestationPayload, bytes[] memory validationPayload) external payable {
    if (modules.length != 0) _runModules(validationPayload);

    _beforeAttest(attestationPayload, msg.value);

    Attestation memory attestation = attestationRegistry.attest(attestationPayload);

    _afterAttest(attestation);
  }

  function revoke(bytes32 attestationId, bytes32 replacedBy) external {
    _onRevoke(attestationId, replacedBy);
    attestationRegistry.revoke(attestationId, replacedBy);
  }

  /**
   * @notice Bulk attest the schema with payloads to attest and validation payloads
   * @param attestationsPayloads the payloads to attest
   * @param validationPayloads the payloads to validate in order to issue the attestations
   */
  function bulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) external payable {
    _onBulkAttest(attestationsPayloads, validationPayloads);
    // Run all modules for all payloads
    moduleRegistry.bulkRunModules(modules, validationPayloads);
    // Register attestations using the attestation registry
    attestationRegistry.bulkAttest(attestationsPayloads);
  }

  /**
   * @notice Bulk revokes attestations for given identifiers and can replace them by new ones
   * @param attestationIds the attestations IDs to revoke
   * @param replacedBy the replacing attestations IDs (leave an ID empty to just revoke)
   */
  function bulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) external {
    _onBulkRevoke(attestationIds, replacedBy);
    attestationRegistry.bulkRevoke(attestationIds, replacedBy);
  }

  function getModules() external view returns (address[] memory) {
    return modules;
  }

  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165Upgradeable).interfaceId;
  }

  function _runModules(bytes[] memory validationPayload) internal {
    if (modules.length != validationPayload.length) revert ModulePayloadMismatch();
    moduleRegistry.runModules(modules, validationPayload);
  }

  function _beforeAttest(AttestationPayload memory attestationPayload, uint256 value) internal virtual;

  function _afterAttest(Attestation memory attestation) internal virtual;

  function _onRevoke(bytes32 attestationId, bytes32 replacedBy) internal virtual;

  function _onBulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) internal virtual;

  function _onBulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) internal virtual;
}
