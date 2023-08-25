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
}
