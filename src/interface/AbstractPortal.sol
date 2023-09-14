// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { PortalRegistry } from "../PortalRegistry.sol";
import { AttestationPayload } from "../types/Structs.sol";
// solhint-disable-next-line max-line-length
import { IERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165Upgradeable.sol";
import { Initializable } from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
import { IRouter } from "../interface/IRouter.sol";

abstract contract AbstractPortal is Initializable, IERC165Upgradeable {
  IRouter public router;
  address[] public modules;
  ModuleRegistry public moduleRegistry;
  AttestationRegistry public attestationRegistry;
  PortalRegistry public portalRegistry;

  /// @notice Error thrown when someone else than the portal's owner is trying to revoke
  error OnlyPortalOwner();

  /**
   * @notice Contract initialization
   * @param _modules list of modules to use for the portal (can be empty)
   * @param _router Router's address
   */
  function initialize(address[] calldata _modules, address _router) public virtual initializer {
    // Store addresses for linked modules, ModuleRegistry and AttestationRegistry
    modules = _modules;
    router = IRouter(_router);
    attestationRegistry = AttestationRegistry(router.getAttestationRegistry());
    moduleRegistry = ModuleRegistry(router.getModuleRegistry());
    portalRegistry = PortalRegistry(router.getPortalRegistry());
  }

  /**
   * @notice Optional method to withdraw funds from the Portal
   * @param to the address to send the funds to
   * @param amount the amount to withdraw
   */
  function withdraw(address payable to, uint256 amount) external virtual;

  /**
   * @notice attest the schema with given attestationPayload and validationPayload
   * @param attestationPayload the payload to attest
   * @param validationPayloads the payloads to validate via the modules to issue the attestations
   * @dev Runs all modules for the portal and registers the attestation using AttestationRegistry
   */
  function attest(AttestationPayload memory attestationPayload, bytes[] memory validationPayloads) public payable {
    moduleRegistry.runModules(modules, attestationPayload, validationPayloads, msg.value);

    _onAttest(attestationPayload);

    attestationRegistry.attest(attestationPayload, _getAttester());
  }

  /**
   * @notice Bulk attest the schema with payloads to attest and validation payloads
   * @param attestationsPayloads the payloads to attest
   * @param validationPayloads the payloads to validate via the modules to issue the attestations
   */
  function bulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) public payable {
    moduleRegistry.bulkRunModules(modules, attestationsPayloads, validationPayloads);

    _onBulkAttest(attestationsPayloads, validationPayloads);

    attestationRegistry.bulkAttest(attestationsPayloads, _getAttester());
  }

  /**
   * @notice Replaces the attestation for the given identifier and replaces it with new attestation
   * @param attestationId the attestation ID to replace
   * @param attestationPayload the attestation payload to create attestation and register it
   * @param validationPayloads the payloads to validate via the modules to issue the attestations
   * @dev Runs all modules for the portal and registers the attestation using AttestationRegistry
   */
  function replace(
    bytes32 attestationId,
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayloads
  ) public payable {
    moduleRegistry.runModules(modules, attestationPayload, validationPayloads, msg.value);

    _onReplace(attestationId, attestationPayload);

    attestationRegistry.replace(attestationId, attestationPayload, _getAttester());
  }

  /**
   * @notice Bulk replaces the attestation for the given identifiers and replaces them with new attestations
   * @param attestationIds the attestation IDs to replace
   * @param attestationsPayloads the payloads to attest
   * @param validationPayloads the payloads to validate via the modules to issue the attestations
   */
  function bulkReplace(
    bytes32[] memory attestationIds,
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) public payable {
    moduleRegistry.bulkRunModules(modules, attestationsPayloads, validationPayloads);

    _onBulkReplace(attestationIds, attestationsPayloads, validationPayloads);

    attestationRegistry.bulkReplace(attestationIds, attestationsPayloads, _getAttester());
  }

  /**
   * @notice Revokes the attestation for the given identifier
   * @param attestationId the attestation ID to revoke
   * @dev By default, revocation is only possible by the portal owner
   * We strongly encourage implementing such a rule in your Portal if you intend on overriding this method
   */
  function revoke(bytes32 attestationId) public virtual {
    _onRevoke(attestationId);

    attestationRegistry.revoke(attestationId);
  }

  /**
   * @notice Bulk revokes attestations for given identifiers and can replace them by new ones
   * @param attestationIds the attestations IDs to revoke
   */
  function bulkRevoke(bytes32[] memory attestationIds) public virtual {
    _onBulkRevoke(attestationIds);

    attestationRegistry.bulkRevoke(attestationIds);
  }

  /**
   * @notice Get all the modules addresses used by the Portal
   * @return The list of modules addresses linked to the Portal
   */
  function getModules() external view returns (address[] memory) {
    return modules;
  }

  /**
   * @notice Verifies that a specific interface is implemented by the Portal, following ERC-165 specification
   * @param interfaceID the interface identifier checked in this call
   * @return The list of modules addresses linked to the Portal
   */
  function supportsInterface(bytes4 interfaceID) public pure virtual override returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165Upgradeable).interfaceId;
  }

  /**
   * @notice Defines the address of the entity issuing attestations to the subject
   * @dev We strongly encourage a reflection when overriding this rule: who should be set as the attester?
   */
  function _getAttester() public view virtual returns (address) {
    return msg.sender;
  }

  /**
   * @notice Optional method run before a payload is attested
   * @param attestationPayload the attestation payload supposed to be attested
   */
  function _onAttest(AttestationPayload memory attestationPayload) internal virtual {}

  /**
   * @notice Optional method run when an attestation is replaced
   * @param attestationId the ID of the attestation being replaced
   * @param attestationPayload the attestation payload to create attestation and register it
   */
  function _onReplace(bytes32 attestationId, AttestationPayload memory attestationPayload) internal virtual {}

  /**
   * @notice Optional method run when attesting a batch of payloads
   * @param attestationsPayloads the payloads to attest
   * @param validationPayloads the payloads to validate in order to issue the attestations
   */
  function _onBulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) internal virtual {}

  function _onBulkReplace(
    bytes32[] memory attestationIds,
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) internal virtual {}

  /**
   * @notice Optional method run when an attestation is revoked or replaced
   */
  function _onRevoke(bytes32 /*attestationId*/) internal virtual {
    if (msg.sender != portalRegistry.getPortalByAddress(address(this)).ownerAddress) revert OnlyPortalOwner();
  }

  /**
   * @notice Optional method run when a batch of attestations are revoked or replaced
   */
  function _onBulkRevoke(bytes32[] memory /*attestationIds*/) internal virtual {
    if (msg.sender != portalRegistry.getPortalByAddress(address(this)).ownerAddress) revert OnlyPortalOwner();
  }
}
