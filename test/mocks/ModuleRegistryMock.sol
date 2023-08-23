// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationPayload } from "../../src/types/Structs.sol";

contract ModuleRegistryMock {
  event ModulesRunForAttestation();
  event ModulesBulkRunForAttestation();

  function test() public {}

  function runModules(address[] memory modulesAddresses, bytes[] memory validationPayload) public {}

  function bulkRunModules(address[] memory modulesAddresses, bytes[][] memory validationPayloads) public {
    require(modulesAddresses.length >= 0, "Invalid input for modulesAddresses");
    require(validationPayloads.length >= 0, "Invalid input for validationPayloads");
    emit ModulesBulkRunForAttestation();
  }
}
