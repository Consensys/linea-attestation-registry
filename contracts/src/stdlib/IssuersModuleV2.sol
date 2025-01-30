// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "../abstracts/AbstractModuleV2.sol";
import { OperationType } from "../types/Enums.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";

/**
 * @title Issuers Module V2
 * @notice This Modules checks if the subject of an Attestation is registered as an Issuer
 */
contract IssuersModuleV2 is AbstractModuleV2 {
  PortalRegistry public portalRegistry;

  /// @notice Error thrown when the subject of an Attestation is not an Issuer
  error UnauthorizedSubject();

  /// @notice Error thrown when the subject of an Attestation is not a valid address
  error InvalidSubjectFormat();

  constructor(address _portalRegistry) {
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @inheritdoc AbstractModuleV2
   * @notice If the Attestation subject is not an Issuer, an error is thrown
   */
  function run(
    AttestationPayload memory attestationPayload,
    bytes memory /*validationPayload*/,
    address /*initialCaller*/,
    uint256 /*value*/,
    address /*attester*/,
    address /*portal*/,
    OperationType /*operationType*/
  ) public view override {
    address subject = address(0);

    if (attestationPayload.subject.length != 32 && attestationPayload.subject.length != 20)
      revert UnauthorizedSubject();

    if (attestationPayload.subject.length == 32) {
      // Check if the first 12 bytes are zero
      bytes memory rawSubject = bytes(attestationPayload.subject);
      if (uint96(bytes12(rawSubject)) != 0) {
        revert InvalidSubjectFormat();
      }
      subject = abi.decode(rawSubject, (address));
    }
    if (attestationPayload.subject.length == 20) subject = address(uint160(bytes20(attestationPayload.subject)));

    if (!portalRegistry.isIssuer(subject)) revert UnauthorizedSubject();
  }
}
