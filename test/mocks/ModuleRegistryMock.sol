// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;
import { AttestationPayload } from "../../src/types/Structs.sol";

contract ModuleRegistryMock {
  event ModulesRunForAttestation();

  function test() public {}

  function runModules(address[] memory modulesAddresses, bytes[] memory validationPayload) public {
    require(modulesAddresses.length > 0 && validationPayload.length >= 0, "Invalid input");
    emit ModulesRunForAttestation();
  }
}
