// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../../interface/AbstractModule.sol";
import { AttestationPayload } from "../../types/Structs.sol";

/**
 * @title Schema checker Module
 * @notice This contract illustrates a valid Module that is used to check the schema that an attestation is based on
 */
contract SchemaCheckerModule is AbstractModule {
  error InvalidSchemaId();
  struct Profile {
    address issuer;
    bytes32 schemaId;
    uint64 issueDate;
  }

  /**
   * @notice This method is used to run the module's validation logic
   * @param attestationPayload - AttestationPayload containing the user address as `subject` and nonce as `attestationData`
   * @param validationPayload - Payload encoded with abi.encode(uint256).toEthSignedMessageHash().sign(signer)
   */
  function run(
    AttestationPayload memory attestationPayload,
    bytes memory /*validationPayload*/,
    address /*txSender*/,
    uint256 /*value*/
  ) public view override {
    Profile memory issuerProfile;
    (issuerProfile.issuer, issuerProfile.schemaId, issuerProfile.issueDate) = abi.decode(
      attestationPayload.attestationData,
      (address, bytes32, uint64)
    );
    if (issuerProfile.schemaId != attestationPayload.schemaId) {
      revert InvalidSchemaId();
    }
  }
}
