// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationPayload } from "../../src/types/Structs.sol";

contract ModuleRegistryMock {
  event ModulesRunForAttestation();
  event ModulesBulkRunForAttestation();

  function test() public {}

  function runModules(
    address[] memory /*modulesAddresses*/,
    AttestationPayload memory /*attestationPayload*/,
    bytes[] memory /*validationPayload*/,
    uint256 /*value*/
  ) public pure returns (bool[] memory) {
    bool[] memory results = new bool[](1);
    results[0] = true;
    return results;
  }

  function bulkRunModules(
    address[] memory modulesAddresses,
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) public returns (bool[][] memory) {
    require(modulesAddresses.length >= 0, "Invalid modulesAddresses");
    require(attestationsPayloads.length >= 0, "Invalid attestationsPayloads");
    require(validationPayloads.length >= 0, "Invalid validationPayloads");
    emit ModulesBulkRunForAttestation();
    bool[][] memory results = new bool[][](1);
    results[0] = new bool[](1);
    results[0][0] = true;
    return results;
  }
}
