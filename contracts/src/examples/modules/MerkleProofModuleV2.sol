// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "../../abstracts/AbstractModuleV2.sol";
import { OperationType } from "../../types/Enums.sol";
import { AttestationPayload } from "../../types/Structs.sol";
import { uncheckedInc256 } from "../../Common.sol";

contract MerkleProofModuleV2 is AbstractModuleV2 {
  error MerkelProofVerifyFailed();

  /**
   * @inheritdoc AbstractModuleV2
   * @notice This method is used to run the module's validation logic
   * @param attestationPayload - AttestationPayload containing the user address as `subject`
   *                             and nonce as `attestationData`
   * @param validationPayload - validationPayload containing the serialized hash.The last one is the 'Root'.
   */
  function run(
    AttestationPayload calldata attestationPayload,
    bytes calldata validationPayload,
    address /*initialCaller*/,
    uint256 /*value*/,
    address /*attester*/,
    address /*portal*/,
    OperationType /*operationType*/
  ) public pure override {
    bytes32[] memory proof = abi.decode(validationPayload, (bytes32[]));
    bytes32 hash = bytes32(attestationPayload.attestationData);
    /*
     * @notice We send the hardcoded third leaf to verify.
     */
    uint256 index = 2;
    for (uint256 i = index + 1; i < proof.length; i = uncheckedInc256(i)) {
      bytes32 proofElement = proof[i];

      if (index % 2 == 0) {
        hash = keccak256(abi.encodePacked(hash, proofElement));
      } else {
        hash = keccak256(abi.encodePacked(proofElement, hash));
      }
      index = index / 2;
      if (index == 0) {
        break;
      }
    }

    if (hash != proof[proof.length - 1]) {
      revert MerkelProofVerifyFailed();
    }
  }
}
