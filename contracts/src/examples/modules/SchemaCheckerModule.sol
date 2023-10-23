// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../../interface/AbstractModule.sol";
import { AttestationPayload } from "../../types/Structs.sol";

contract SchemaCheckerModule is AbstractModule {

  error InvalidSchemaId();
  struct Profile {
    address issuer;
    bytes32 schemaId;
    uint64 issueDate;
  }
  function run(
    AttestationPayload memory attestationPayload,
    bytes memory /*validationPayload*/,
    address /*txSender*/,
    uint256 /*value*/
  ) public view override {
    Profile memory issuerProfile;
    (issuerProfile.issuer, issuerProfile.schemaId, issuerProfile.issueDate) = 
      abi.decode(attestationPayload.attestationData, (address, bytes32, uint64));
    if (issuerProfile.schemaId != attestationPayload.schemaId) {
      revert InvalidSchemaId();
    }
  }
}
