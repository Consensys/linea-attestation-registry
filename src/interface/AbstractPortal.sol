// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

//TODO: Add hooks with basic implementation
abstract contract AbstractPortal {
  function attest(
    bytes32 schemaId,
    bytes memory attestationPayload,
    bytes memory validationPayload
  ) external virtual returns (bool);

  function getModules() external virtual returns (address[] memory);
}
