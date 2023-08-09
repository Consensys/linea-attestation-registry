// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

abstract contract AbstractModule {
  function run(
    bytes memory attestationPayload,
    bytes memory validationPayload,
    bytes32 schemaId,
    address msgSender
  ) public virtual returns (bytes memory moduleAttestationPayload, bytes memory moduleValidationPayload);
}
