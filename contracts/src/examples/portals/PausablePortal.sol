// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Pausable } from "@openzeppelin/contracts/security/Pausable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import { AbstractPortal } from "../../abstracts/AbstractPortal.sol";
import { Attestation, AttestationPayload } from "../../types/Structs.sol";
import { IPortal } from "../../interfaces/IPortal.sol";

/**
 * @title Pausable Portal
 * @author Consensys
 * @notice This Portal aims to be pausable to prevent any attestation to be added in case of emergency
 */
contract PausablePortal is AbstractPortal, Pausable, Ownable {
  /**
   * @notice Contract constructor
   * @param modules list of modules to use for the portal (can be empty)
   * @param router Router's address
   * @dev This sets the addresses for the AttestationRegistry, ModuleRegistry and PortalRegistry
   */
  constructor(address[] memory modules, address router) AbstractPortal(modules, router) Ownable() {}

  /**
   * @dev Pauses the contract.
   * See {Pausable-_pause}.
   * Can only be called by the owner.
   */
  function pause() external onlyOwner {
    _pause();
  }

  /**
   * @dev Unpauses the contract.
   * See {Pausable-_unpause}.
   * Can only be called by the owner.
   */
  function unpause() external onlyOwner {
    _unpause();
  }

  /**
   * @inheritdoc AbstractPortal
   * @dev By default, this Portal does not have any withdrawal logic
   */
  function withdraw(address payable to, uint256 amount) external virtual override {}

  /**
   * @inheritdoc AbstractPortal
   */
  function _onAttest(
    AttestationPayload memory attestationPayload,
    address attester,
    uint256 value
  ) internal virtual override whenNotPaused {}

  /**
   * @inheritdoc AbstractPortal
   */
  function _onAttestV2(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayloads,
    uint256 value
  ) internal virtual override whenNotPaused {}

  /**
   * @inheritdoc AbstractPortal
   */
  function _onBulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) internal virtual override whenNotPaused {}

  /**
   * @inheritdoc AbstractPortal
   * @dev Only the owner of the portal can replace an attestation
   */
  function _onReplace(
    bytes32 /*attestationId*/,
    AttestationPayload memory /*attestationPayload*/,
    address /*attester*/,
    uint256 /*value*/
  ) internal virtual override whenNotPaused {
    if (msg.sender != portalRegistry.getPortalByAddress(address(this)).ownerAddress) revert OnlyPortalOwner();
  }

  /**
   * @inheritdoc AbstractPortal
   * @dev Only the owner of the portal can bulk replace attestations
   */
  function _onBulkReplace(
    bytes32[] memory /*attestationIds*/,
    AttestationPayload[] memory /*attestationsPayloads*/,
    bytes[][] memory /*validationPayloads*/
  ) internal virtual override whenNotPaused {
    if (msg.sender != portalRegistry.getPortalByAddress(address(this)).ownerAddress) revert OnlyPortalOwner();
  }

  /**
   * @inheritdoc AbstractPortal
   * @dev Only the owner of the portal can revoke an attestation
   */
  function _onRevoke(bytes32 /*attestationId*/) internal virtual override whenNotPaused {
    if (msg.sender != portalRegistry.getPortalByAddress(address(this)).ownerAddress) revert OnlyPortalOwner();
  }

  /**
   * @inheritdoc AbstractPortal
   * @dev Only the owner of the portal can bulk revoke attestations
   */
  function _onBulkRevoke(bytes32[] memory /*attestationIds*/) internal virtual override whenNotPaused {
    if (msg.sender != portalRegistry.getPortalByAddress(address(this)).ownerAddress) revert OnlyPortalOwner();
  }
}
