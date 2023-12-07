// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../abstracts/AbstractModule.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";

/**
 * @title Issuers Module
 * @author Consensys
 * @notice This Modules checks if the subject of an Attestation is registered as an Issuer
 */
contract IssuersModule is AbstractModule {
  PortalRegistry public portalRegistry;

  /// @notice Error thrown when the subject of an Attestation is not an Issuer
  error UnauthorizedSubject();

  constructor(address _portalRegistry) {
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @inheritdoc AbstractModule
   * @notice If the Attestation subject is not an Issuer, an error is thrown
   */
  function run(
    AttestationPayload memory _attestationPayload,
    bytes memory /*_validationPayload*/,
    address /*_txSender*/,
    uint256 /*_value*/
  ) public view override {
    address subject = address(0);

    if (_attestationPayload.subject.length == 32) subject = abi.decode(_attestationPayload.subject, (address));
    if (_attestationPayload.subject.length == 20) subject = address(uint160(bytes20(_attestationPayload.subject)));

    if (!portalRegistry.isIssuer(subject)) revert UnauthorizedSubject();
  }
}
