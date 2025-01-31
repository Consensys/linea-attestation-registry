// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "../abstracts/AbstractModuleV2.sol";
import { OperationType } from "../types/Enums.sol";
import { AttestationPayload, Attestation } from "../types/Structs.sol";
import { AttestationRegistry } from "../AttestationRegistry.sol";
import { PortalRegistry } from "../PortalRegistry.sol";

/**
 * @title IndexerModule V2
 * @author Clique
 * @dev The contract is responsible for indexing attestations by various parameters.
 *      It allows for efficient retrieval of attestations based on these parameters.
 *      DISCLAIMER: This Module doesn't un-index revoked attestations.
 *      DISCLAIMER: This Module doesn't work as intended when bulk attesting.
 *      DISCLAIMER: This Module doesn't consider the chain prefix to generate the indexed attestation ID.
 */
contract IndexerModuleV2 is AbstractModuleV2 {
  AttestationRegistry public attestationRegistry;
  PortalRegistry public portalRegistry;

  mapping(bytes subject => bytes32[] attestationIds) private attestationIdsBySubject;
  mapping(bytes subject => mapping(bytes32 schemaId => bytes32[] attestationIds))
    private attestationIdsBySubjectBySchema;
  mapping(address attester => bytes32[] attestationIds) private attestationIdsByAttester;
  mapping(bytes32 schema => bytes32[] attestationIds) private attestationIdsBySchema;
  mapping(address portal => bytes32[] attestationIds) private attestationIdsByPortal;
  mapping(address portal => mapping(bytes subject => bytes32[] attestationIds)) private attestationIdsByPortalBySubject;
  mapping(bytes32 attestationId => bool status) private indexedAttestations;

  /// @notice Error thrown when something else than a registered Portal is trying to index an Attestation
  error OnlyRegisteredPortal();

  /// @dev Emitted when an attestation is indexed.
  event AttestationIndexed(bytes32 attestationId);

  modifier onlyRegisteredPortal(address portal) {
    if (portalRegistry.isRegistered(portal)) revert OnlyRegisteredPortal();
    _;
  }

  /**
   * @dev Contract constructor sets the router.
   * @param _attestationRegistry The address of the AttestationRegistry.
   */
  constructor(address _attestationRegistry, address _portalRegistry) {
    attestationRegistry = AttestationRegistry(_attestationRegistry);
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @inheritdoc AbstractModuleV2
   * @param attestationPayload The Payload of the attestation
   * @param attester The address attesting the payload
   * @param portal The Portal issuing the attestation
   * @notice If the signer of the transaction payload is not an expected address, an error is thrown
   */
  function run(
    AttestationPayload calldata attestationPayload,
    bytes calldata /*validationPayload*/,
    address /*initialCaller*/,
    uint256 /*value*/,
    address attester,
    address portal,
    OperationType /*operationType*/
  ) public override onlyRegisteredPortal(portal) {
    Attestation memory attestation = _buildAttestation(attestationPayload, attester, portal);
    _indexAttestation(attestation);
  }

  /**
   * @dev Indexes an attestation.
   * @param attestationId The ID of the attestation to index.
   */
  function indexAttestation(bytes32 attestationId) public {
    Attestation memory attestation = attestationRegistry.getAttestation(attestationId);
    _indexAttestation(attestation);
  }

  /**
   * @dev Indexes multiple attestations.
   * @param attestationIds An array of attestation IDs to index.
   */
  function indexAttestations(bytes32[] calldata attestationIds) external {
    uint256 length = attestationIds.length;
    for (uint256 i = 0; i < length; i++) {
      indexAttestation(attestationIds[i]);
    }
  }

  /**
   * @dev Returns the attestation IDs for a given subject.
   * @param subject The subject to retrieve attestation IDs for.
   * @return An array of attestation IDs.
   */
  function getAttestationIdsBySubject(bytes calldata subject) external view returns (bytes32[] memory) {
    return attestationIdsBySubject[subject];
  }

  /**
   * @dev Returns the attestation IDs for a given subject and schema.
   * @param subject The subject to retrieve attestation IDs for.
   * @param schemaId The schema ID to retrieve attestation IDs for.
   * @return An array of attestation IDs.
   */
  function getAttestationIdsBySubjectBySchema(
    bytes calldata subject,
    bytes32 schemaId
  ) external view returns (bytes32[] memory) {
    return attestationIdsBySubjectBySchema[subject][schemaId];
  }

  /**
   * @dev Returns the attestation IDs for a given attester.
   * @param attester The attester to retrieve attestation IDs for.
   * @return An array of attestation IDs.
   */
  function getAttestationIdsByAttester(address attester) external view returns (bytes32[] memory) {
    return attestationIdsByAttester[attester];
  }

  /**
   * @dev Returns the attestation IDs for a given schema.
   * @param schema The schema to retrieve attestation IDs for.
   * @return An array of attestation IDs.
   */
  function getAttestationIdsBySchema(bytes32 schema) external view returns (bytes32[] memory) {
    return attestationIdsBySchema[schema];
  }

  /**
   * @dev Returns the attestation IDs for a given portal.
   * @param portal The portal to retrieve attestation IDs for.
   * @return An array of attestation IDs.
   */
  function getAttestationIdsByPortal(address portal) external view returns (bytes32[] memory) {
    return attestationIdsByPortal[portal];
  }

  /**
   * @dev Returns the attestation IDs for a given portal and subject.
   * @param portal The portal to retrieve attestation IDs for.
   * @param subject The subject to retrieve attestation IDs for.
   * @return An array of attestation IDs.
   */
  function getAttestationIdsByPortalBySubject(
    address portal,
    bytes calldata subject
  ) external view returns (bytes32[] memory) {
    return attestationIdsByPortalBySubject[portal][subject];
  }

  /**
   * @dev Returns the indexed status of an attestation.
   * @param attestationId The ID of the attestation to check.
   * @return The indexed status of the attestation.
   */
  function getIndexedAttestationStatus(bytes32 attestationId) external view returns (bool) {
    return indexedAttestations[attestationId];
  }

  /**
   * @dev Indexes an attestation.
   * @param attestation The attestation to index.
   */
  function _indexAttestation(Attestation memory attestation) internal {
    if (indexedAttestations[attestation.attestationId]) {
      return;
    }
    attestationIdsBySubject[attestation.subject].push(attestation.attestationId);
    attestationIdsBySubjectBySchema[attestation.subject][attestation.schemaId].push(attestation.attestationId);
    attestationIdsByAttester[attestation.attester].push(attestation.attestationId);
    attestationIdsBySchema[attestation.schemaId].push(attestation.attestationId);
    attestationIdsByPortal[attestation.portal].push(attestation.attestationId);
    attestationIdsByPortalBySubject[attestation.portal][attestation.subject].push(attestation.attestationId);
    indexedAttestations[attestation.attestationId] = true;

    emit AttestationIndexed(attestation.attestationId);
  }

  /**
   * @dev Builds an attestation.
   * @param attestationPayload The payload of the attestation.
   * @return The built attestation.
   */
  function _buildAttestation(
    AttestationPayload calldata attestationPayload,
    address attester,
    address portal
  ) internal view returns (Attestation memory) {
    return
      Attestation(
        attestationRegistry.getNextAttestationId(),
        attestationPayload.schemaId,
        bytes32(0),
        attester,
        portal,
        uint64(block.timestamp),
        attestationPayload.expirationDate,
        0,
        attestationRegistry.getVersionNumber(),
        false,
        attestationPayload.subject,
        attestationPayload.attestationData
      );
  }
}
