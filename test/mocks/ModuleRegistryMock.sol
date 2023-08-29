// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationPayload } from "../../src/types/Structs.sol";

contract ModuleRegistryMock {
  event ModulesRunForAttestation();
  event ModulesBulkRunForAttestation();

  function test() public {}

  function runModules(address[] memory modulesAddresses, bytes[] memory validationPayload) public {
    require(modulesAddresses.length > 0 && validationPayload.length >= 0, "Invalid input");
    emit ModulesRunForAttestation();
  }

  function bulkRunModules(address[] memory modulesAddresses, bytes[][] memory validationPayloads) public {
    require(modulesAddresses.length > 0 && validationPayloads.length >= 0, "Invalid input");
    emit ModulesBulkRunForAttestation();
  }
}
