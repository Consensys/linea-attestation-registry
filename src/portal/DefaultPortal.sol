// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

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
contract DefaultPortal is AbstractPortal {
  function _beforeAttest(AttestationPayload memory attestation, uint256 value) internal override {}

  function _afterAttest(Attestation memory attestation) internal override {}

  function _onRevoke(bytes32 attestationId, bytes32 replacedBy) internal override {}

  function _onBulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) internal override {}

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
}
