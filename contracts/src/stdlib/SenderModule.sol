// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../abstracts/AbstractModule.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";

/**
 * @title Sender Module
 * @author Consensys
 * @notice This Module checks if the transaction sender is authorized for a specific Portal
 */
contract SenderModule is AbstractModule {
  PortalRegistry public portalRegistry;

  mapping(address portal => mapping(address sender => bool authorized)) public authorizedSenders;

  /// @notice Error thrown when an array length mismatch occurs
  error ArrayLengthMismatch();
  /// @notice Error thrown when the transaction sender is not authorized
  error UnauthorizedSender();

  modifier onlyPortalOwner(address portal) {
    if (msg.sender != portalRegistry.getPortalByAddress(portal).ownerAddress) revert OnlyPortalOwner();
    _;
  }

  /**
   * @notice Contract constructor sets the portal registry
   */
  constructor(address _portalRegistry) {
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @notice Set the authorized status of senders
   * @param senders The senders to be set
   * @param authorizedStatus The authorized status of senders
   */
  function setAuthorizedSenders(
    address portal,
    address[] memory senders,
    bool[] memory authorizedStatus
  ) public onlyPortalOwner(portal) {
    if (senders.length != authorizedStatus.length) revert ArrayLengthMismatch();

    for (uint256 i = 0; i < senders.length; i++) {
      authorizedSenders[portal][senders[i]] = authorizedStatus[i];
    }
  }

  /**
   * @inheritdoc AbstractModule
   * @notice If the transaction sender is not the expected address, an error is thrown
   */
  function run(
    AttestationPayload memory /*_attestationPayload*/,
    bytes memory _validationPayload,
    address _txSender,
    uint256 /*_value*/
  ) public view override {
    address portalAddress = address(0);

    if (_validationPayload.length == 32) portalAddress = abi.decode(_validationPayload, (address));
    if (_validationPayload.length == 20) portalAddress = address(uint160(bytes20(_validationPayload)));

    if (!authorizedSenders[portalAddress][_txSender]) revert UnauthorizedSender();
  }
}
