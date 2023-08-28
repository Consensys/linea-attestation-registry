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
}
