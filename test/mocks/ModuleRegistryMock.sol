// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationPayload } from "../../src/types/Structs.sol";

contract ModuleRegistryMock {
  event ModulesRunForAttestation();
  event ModulesBulkRunForAttestation();

  function test() public {}

  function runModules(
    address[] memory modulesAddresses,
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload
  ) public {}

  function bulkRunModules(
    address[] memory modulesAddresses,
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) public {
    require(modulesAddresses.length >= 0, "Invalid input for modulesAddresses");
    require(attestationsPayloads.length >= 0, "Invalid input for attestationsPayloads");
    require(validationPayloads.length >= 0, "Invalid input for validationPayloads");
    emit ModulesBulkRunForAttestation();
  }
}
