// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../abstracts/AbstractModule.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";
import { Ownable } from "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title Issuer Module
 * @author Consensys
 * @notice This is issuer module for Explorer listing
 */
contract IssuersModule is AbstractModule, Ownable {
  PortalRegistry public portalRegistry;

  /// @notice Error thrown when the transaction sender is is neither the issuer nor the contract owner
  error UnauthorizedSender();

  constructor(address _portalRegistry) {
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @inheritdoc AbstractModule
   * @notice If the transaction sender is neither the issuer nor the contract owner, an error is thrown
   */
  function run(
    AttestationPayload memory /*_attestationPayload*/,
    bytes memory /*_validationPayload*/,
    address _txSender,
    uint256 /*_value*/
  ) public view override {
    if (!portalRegistry.isIssuer(_txSender) && _txSender != owner()) {
      revert UnauthorizedSender();
    }
  }
}
