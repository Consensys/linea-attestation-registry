// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

abstract contract AbstractModule {
  function run(
    bytes[] memory validationPayload,
    address txSender
  ) public virtual returns (bytes[] memory moduleValidationPayload);
}
