// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OperationType } from "../../src/types/Enums.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

contract ModuleRegistryMock {
  event ModulesRunForAttestation();
  event ModulesBulkRunForAttestation();
  event ModulesBulkRunForAttestationV2();

  function test() public {}

  function runModules(
    address[] memory /*modulesAddresses*/,
    AttestationPayload memory /*attestationPayload*/,
    bytes[] memory /*validationPayload*/,
    uint256 /*value*/
  ) public {}

  function runModulesV2(
    address[] memory /*modulesAddresses*/,
    AttestationPayload memory /*attestationPayload*/,
    bytes[] memory /*validationPayloads*/,
    uint256 /*value*/,
    address /*initialCaller*/,
    address /*attester*/,
    OperationType /*operationType*/
  ) public {}

  function bulkRunModules(
    address[] memory /*modulesAddresses*/,
    AttestationPayload[] memory /*attestationsPayloads*/,
    bytes[][] memory /*validationPayloads*/
  ) public {
    emit ModulesBulkRunForAttestation();
  }

  function bulkRunModulesV2(
    address[] memory /*modulesAddresses*/,
    AttestationPayload[] memory /*attestationPayloads*/,
    bytes[][] memory /*validationPayloads*/,
    address /*initialCaller*/,
    address /*attester*/,
    OperationType /*operationType*/
  ) public {
    emit ModulesBulkRunForAttestationV2();
  }
}
