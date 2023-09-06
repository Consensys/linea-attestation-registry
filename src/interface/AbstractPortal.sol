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

  /// @notice Error thrown when the numbers of modules to go through and payloads for them is not the same
  error ModulePayloadMismatch();
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
   * @notice attest the schema with given attestationPayload and validationPayload
   * @param attestationPayload the payload to attest
   * @param validationPayload the payload to validate via the modules to issue the attestations
   * @dev Runs all modules for the portal and registers the attestation using AttestationRegistry
   */
  function attest(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload
  ) public payable virtual {
    if (modules.length != 0) _runModules(attestationPayload, validationPayload);

    _beforeAttest(attestationPayload, msg.value);

    attestationRegistry.attest(attestationPayload, _getAttester());

    _afterAttest();
  }

  /**
   * @notice Bulk attest the schema with payloads to attest and validation payloads
   * @param attestationsPayloads the payloads to attest
   * @param validationPayloads the payloads to validate via the modules to issue the attestations
   */
  function bulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) public payable virtual {
    _onBulkAttest(attestationsPayloads, validationPayloads);
    // Run all modules for all payloads
    moduleRegistry.bulkRunModules(modules, attestationsPayloads, validationPayloads);
    // Register attestations using the attestation registry
    attestationRegistry.bulkAttest(attestationsPayloads, _getAttester());
  }

  /**
   * @notice Revokes the attestation for the given identifier and can replace it by a new one
   * @param attestationId the attestation ID to revoke
   * @param replacedBy the replacing attestation ID (leave empty to just revoke)
   * @dev By default, revocation is only possible by the portal owner
   * We strongly encourage implementing such a rule in your Portal if you intend on overriding this method
   */
  function revoke(bytes32 attestationId, bytes32 replacedBy) public virtual {
    if (msg.sender != portalRegistry.getPortalByAddress(address(this)).ownerAddress) revert OnlyPortalOwner();
    _onRevoke(attestationId, replacedBy);
    attestationRegistry.revoke(attestationId, replacedBy);
  }

  /**
   * @notice Bulk revokes attestations for given identifiers and can replace them by new ones
   * @param attestationIds the attestations IDs to revoke
   * @param replacedBy the replacing attestations IDs (leave an ID empty to just revoke)
   */
  function bulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) public virtual {
    _onBulkRevoke(attestationIds, replacedBy);
    attestationRegistry.bulkRevoke(attestationIds, replacedBy);
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
   * @notice Runs all the modules linked to the Portal to check their logic against the validation payload
   * @param attestationPayload the attestation payload supposed to be attested
   * @param validationPayload the list of payloads used by modules
   * @dev Each module must have its own item in the list of validation payloads
   */
  function _runModules(AttestationPayload memory attestationPayload, bytes[] memory validationPayload) internal {
    if (modules.length != validationPayload.length) revert ModulePayloadMismatch();
    moduleRegistry.runModules(modules, attestationPayload, validationPayload);
  }

  /**
   * @notice Optional method run before a payload is attested
   * @param attestationPayload the attestation payload supposed to be attested
   * @param value the optional ETH value paid for this attestation
   */
  function _beforeAttest(AttestationPayload memory attestationPayload, uint256 value) internal virtual;

  /**
   * @notice Optional method run after a payload is attested
   */
  function _afterAttest() internal virtual;

  /**
   * @notice Optional method run when attesting a batch of payloads
   * @param attestationsPayloads the payloads to attest
   * @param validationPayloads the payloads to validate in order to issue the attestations
   */
  function _onBulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) internal virtual;

  /**
   * @notice Optional method run when an attestation is revoked or replaced
   * @param attestationId the attestation ID to revoke
   * @param replacedBy the replacing attestation ID
   */
  function _onRevoke(bytes32 attestationId, bytes32 replacedBy) internal virtual;

  /**
   * @notice Optional method run when a batch of attestations are revoked or replaced
   * @param attestationIds the attestations IDs to revoke
   * @param replacedBy the replacing attestations IDs
   */
  function _onBulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) internal virtual;

  /**
   * @notice Defines the address of the entity issuing attestations to the subject
   * @dev We strongly encourage a reflection when overriding this rule: who should be set as the attester?
   */
  function _getAttester() public view virtual returns (address) {
    return msg.sender;
  }
}
