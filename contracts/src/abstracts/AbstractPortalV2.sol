// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { PortalRegistry } from "../PortalRegistry.sol";
import { OperationType } from "../types/Enums.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import { IRouter } from "../interfaces/IRouter.sol";
import { IPortal } from "../interfaces/IPortal.sol";

/**
 * @title Abstract Portal V2
 * @author Consensys
 * @notice This contract is an abstracts contract with basic Portal logic
 *         to be inherited. We strongly encourage all Portals to implement
 *         this contract.
 */
abstract contract AbstractPortalV2 is IPortal, ERC165 {
  IRouter public router;
  address[] public modules;
  ModuleRegistry public moduleRegistry;
  AttestationRegistry public attestationRegistry;
  PortalRegistry public portalRegistry;

  /// @notice Error thrown when someone else than the portal's owner is trying to revoke
  error OnlyPortalOwner();

  /// @notice Error thrown when withdrawing funds fails
  error WithdrawFail();

  /**
   * @notice Contract constructor
   * @param _modules list of modules to use for the portal (can be empty)
   * @param _router Router's address
   * @dev This sets the addresses for the AttestationRegistry, ModuleRegistry and PortalRegistry
   */
  constructor(address[] memory _modules, address _router) {
    modules = _modules;
    router = IRouter(_router);
    attestationRegistry = AttestationRegistry(router.getAttestationRegistry());
    moduleRegistry = ModuleRegistry(router.getModuleRegistry());
    portalRegistry = PortalRegistry(router.getPortalRegistry());
  }

  /**
   * @notice Modifier to enforce only the portal owner can perform certain actions.
   */
  modifier onlyPortalOwner() {
    if (msg.sender != portalRegistry.getPortalByAddress(address(this)).ownerAddress) revert OnlyPortalOwner();
    _;
  }

  /**
   * @notice Withdraw funds from the Portal
   * @param to the address to send the funds to
   * @param amount the amount to withdraw
   * @dev Only the Portal owner can withdraw funds
   */
  function withdraw(address payable to, uint256 amount) external virtual onlyPortalOwner {
    (bool s, ) = to.call{ value: amount }("");
    if (!s) revert WithdrawFail();
  }

  /**
   * @notice Attest the schema with given attestationPayload and validationPayload
   * @param attestationPayload the payload to attest
   * @param validationPayloads the payloads to validate via the modules to issue the attestations
   * @dev Runs all modules for the portal and registers the attestation using AttestationRegistry
   */
  function attest(AttestationPayload memory attestationPayload, bytes[] memory validationPayloads) public payable {
    moduleRegistry.runModulesV2(
      modules,
      attestationPayload,
      validationPayloads,
      msg.value,
      msg.sender,
      getAttester(),
      OperationType.Attest
    );

    _onAttest(attestationPayload, validationPayloads, msg.value);

    attestationRegistry.attest(attestationPayload, getAttester());
  }

  /**
   * @notice Bulk attest the schema with payloads to attest and validation payloads
   * @param attestationPayloads the payloads to attest
   * @param validationPayloads the payloads to validate via the modules to issue the attestations
   * @dev DISCLAIMER: This method may have unexpected behavior if one of the Module checks is done on the attestation ID
   *                  as this ID won't be incremented before the end of the transaction.
   *                  If you need to check the attestation ID, please use the `attestV2` method.
   */
  function bulkAttest(AttestationPayload[] memory attestationPayloads, bytes[][] memory validationPayloads) public {
    moduleRegistry.bulkRunModulesV2(
      modules,
      attestationPayloads,
      validationPayloads,
      msg.sender,
      getAttester(),
      OperationType.BulkAttest
    );

    _onBulkAttest(attestationPayloads, validationPayloads);

    attestationRegistry.bulkAttest(attestationPayloads, getAttester());
  }

  /**
   * @notice Replaces the attestation for the given identifier and replaces it with a new attestation
   * @param attestationId the ID of the attestation to replace
   * @param attestationPayload the attestation payload to create the new attestation and register it
   * @param validationPayloads the payloads to validate via the modules to issue the attestation
   * @dev Runs all modules for the portal and registers the attestation using AttestationRegistry
   */
  function replace(
    bytes32 attestationId,
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayloads
  ) public payable onlyPortalOwner {
    moduleRegistry.runModulesV2(
      modules,
      attestationPayload,
      validationPayloads,
      msg.value,
      msg.sender,
      getAttester(),
      OperationType.Replace
    );

    _onReplace(attestationId, attestationPayload, getAttester(), msg.value);

    attestationRegistry.replace(attestationId, attestationPayload, getAttester());
  }

  /**
   * @notice Bulk replaces the attestation for the given identifiers and replaces them with new attestations
   * @param attestationIds the list of IDs of the attestations to replace
   * @param attestationsPayloads the list of attestation payloads to create the new attestations and register them
   * @param validationPayloads the payloads to validate via the modules to issue the attestations
   * @dev DISCLAIMER: This method may have unexpected behavior if one of the Module checks is done on the attestation ID
   *                  as this ID won't be incremented before the end of the transaction.
   *                  If you need to check the attestation ID, please use the `replaceV2` method.
   */
  function bulkReplace(
    bytes32[] memory attestationIds,
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) public onlyPortalOwner {
    moduleRegistry.bulkRunModulesV2(
      modules,
      attestationsPayloads,
      validationPayloads,
      msg.sender,
      getAttester(),
      OperationType.BulkReplace
    );

    _onBulkReplace(attestationIds, attestationsPayloads, validationPayloads);

    attestationRegistry.bulkReplace(attestationIds, attestationsPayloads, getAttester());
  }

  /**
   * @notice Revokes an attestation for the given identifier
   * @param attestationId the ID of the attestation to revoke
   * @dev By default, revocation is only possible by the portal owner
   * We strongly encourage implementing such a rule in your Portal if you intend on overriding this method
   */
  function revoke(bytes32 attestationId) public onlyPortalOwner {
    _onRevoke(attestationId);

    attestationRegistry.revoke(attestationId);
  }

  /**
   * @notice Bulk revokes a list of attestations for the given identifiers
   * @param attestationIds the IDs of the attestations to revoke
   */
  function bulkRevoke(bytes32[] memory attestationIds) public onlyPortalOwner {
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
   * @return True if the interface is supported, false otherwise
   */
  function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
    return
      interfaceID == type(AbstractPortalV2).interfaceId ||
      interfaceID == type(IPortal).interfaceId ||
      super.supportsInterface(interfaceID);
  }

  /**
   * @notice Defines the address of the entity issuing attestations to the subject
   * @dev We strongly encourage a reflection when overriding this rule: who should be set as the attester?
   */
  function getAttester() internal view virtual returns (address) {
    return msg.sender;
  }

  /**
   * @notice Optional hooks for specific operations
   */
  function _onAttest(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayloads,
    uint256 value
  ) internal virtual {}

  /**
   * @notice Optional method run when an attestation is replaced
   * @dev    IMPORTANT NOTE: By default, replacement is only possible by the portal owner
   * @param attestationId the ID of the attestation being replaced
   * @param attestationPayload the attestation payload to create attestation and register it
   * @param attester the address of the attester
   * @param value the value sent with the attestation
   */
  function _onReplace(
    bytes32 attestationId,
    AttestationPayload memory attestationPayload,
    address attester,
    uint256 value
  ) internal virtual {}

  /**
   * @notice Optional method run when attesting a batch of payloads
   * @param attestationsPayloads the payloads to attest
   * @param validationPayloads the payloads to validate in order to issue the attestations
   */
  function _onBulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) internal virtual {}

  /**
   * @notice Optional method run when replacing a batch of payloads
   * @dev    IMPORTANT NOTE: By default, bulk replacement is only possible by the portal owner
   * @param attestationIds the IDs of the attestations being replaced
   * @param attestationsPayloads the payloads to replace
   * @param validationPayloads the payloads to validate in order to replace the attestations
   */
  function _onBulkReplace(
    bytes32[] memory attestationIds,
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) internal virtual {}

  /**
   * @notice Optional method run when an attestation is revoked or replaced
   * @dev    IMPORTANT NOTE: By default, revocation is only possible by the portal owner
   */
  function _onRevoke(bytes32 /*attestationId*/) internal virtual {}

  /**
   * @notice Optional method run when a batch of attestations are revoked or replaced
   * @dev    IMPORTANT NOTE: By default, revocation is only possible by the portal owner
   */
  function _onBulkRevoke(bytes32[] memory /*attestationIds*/) internal virtual {}
}
