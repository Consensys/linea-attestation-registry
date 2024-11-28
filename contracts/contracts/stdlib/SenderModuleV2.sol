// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "../abstracts/AbstractModuleV2.sol";
import { OperationType } from "../types/Enums.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { PortalRegistry } from "../PortalRegistry.sol";

/**
 * @title Sender Module V2
 * @author Consensys
 * @notice This Module checks if the transaction sender is authorized for a specific Portal
 */
contract SenderModuleV2 is AbstractModuleV2 {
  PortalRegistry public portalRegistry;

  mapping(address portal => mapping(address sender => bool authorized)) public authorizedSenders;

  /// @notice Error thrown when an array length mismatch occurs
  error ArrayLengthMismatch();
  /// @notice Error thrown when the transaction sender is not authorized
  error UnauthorizedSender();

  /// @notice Event emitted when the authorized senders are set
  event SendersAuthorized(address indexed portal, address[] senders, bool[] authorizedStatus);

  modifier onlyPortalOwner(address portal) {
    if (msg.sender != portalRegistry.getPortalOwner(portal)) revert OnlyPortalOwner();
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
   * @dev The length of `senders` and `authorizedStatus` must be the same
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

    emit SendersAuthorized(portal, senders, authorizedStatus);
  }

  /**
   * @inheritdoc AbstractModuleV2
   * @param initialCaller The initial transaction sender
   * @param portal The Portal issuing the attestation
   * @notice If the transaction sender is not the expected address, an error is thrown
   */
  function run(
    AttestationPayload memory /*attestationPayload*/,
    bytes memory /*validationPayload*/,
    address initialCaller,
    uint256 /*value*/,
    address /*attester*/,
    address portal,
    OperationType /*operationType*/
  ) public view override {
    if (!authorizedSenders[portal][initialCaller]) revert UnauthorizedSender();
  }
}
