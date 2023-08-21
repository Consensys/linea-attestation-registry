// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Attestation } from "../types/Structs.sol";

//TODO: Add hooks with basic implementation
abstract contract AbstractPortal {
  function attest(
    bytes32 schemaId,
    bytes memory attestationPayload,
    bytes memory validationPayload
  ) external payable virtual returns (bool);

  function getModules() external virtual returns (address[] memory);

  function _beforeAttest(
    Attestation memory attestation,
    uint256 value,
    bytes memory attestationPayload
  ) internal virtual {}

  function _afterAttest(
    Attestation memory attestation,
    uint256 value,
    bytes memory attestationPayload
  ) internal virtual {}
}
