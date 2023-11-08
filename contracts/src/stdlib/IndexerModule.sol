// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../abstracts/AbstractModule.sol";
import { AbstractPortal } from "../abstracts/AbstractPortal.sol";
import { AttestationPayload, Attestation } from "../types/Structs.sol";
import { Router } from "../Router.sol";
import { AttestationRegistry } from "../AttestationRegistry.sol";

/**
 * @title IndexerModule
 * @dev The contract is responsible for indexing attestations by various parameters.
 * It allows for efficient retrieval of attestations based on these parameters.
 */
contract IndexerModule is AbstractModule {
  Router public router;

  mapping(bytes subject => bytes32[] attestationIds) private attestationIdsBySubject;
  mapping(bytes subject => mapping(bytes32 schemaId => bytes32[] attestationIds))
    private attestationIdsBySubjectBySchema;
  mapping(address attester => bytes32[] attestationIds) private attestationIdsByAttester;
  mapping(bytes32 schema => bytes32[] attestationIds) private attestationIdsBySchema;
  mapping(address portal => bytes32[] attestationIds) private attestationIdsByPortal;
  mapping(address portal => mapping(bytes subject => bytes32[] attestationIds)) private attestationIdsByPortalBySubject;
  mapping(bytes32 attestationId => bool status) private indexedAttestations;

  /**
   * @dev Emitted when an attestation is indexed.
   */
  event AttestationIndexed(bytes32 attestationId);

  /**
   * @dev Contract constructor sets the router.
   * @param _router The address of the router contract.
   */
  constructor(address _router) {
    router = Router(_router);
  }

  /**
   * @dev The main method for the module, running the check.
   * @param _attestationPayload The payload of the attestation.
   */
  function run(
    AttestationPayload memory _attestationPayload,
    bytes memory /*_validationPayload*/,
    address /*_txSender*/,
    uint256 /*_value*/
  ) public override {
    Attestation memory attestation = _buildAttestation(_attestationPayload);
    _indexAttestation(attestation);
  }

  /**
   * @dev Indexes an attestation.
   * @param attestationId The ID of the attestation to index.
   */
  function indexAttestation(bytes32 attestationId) public {
    AttestationRegistry attestationRegistry = AttestationRegistry(router.getAttestationRegistry());
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
  function getAttestationIdsBySubject(bytes memory subject) external view returns (bytes32[] memory) {
    return attestationIdsBySubject[subject];
  }

  /**
   * @dev Returns the attestation IDs for a given subject and schema.
   * @param subject The subject to retrieve attestation IDs for.
   * @param schemaId The schema ID to retrieve attestation IDs for.
   * @return An array of attestation IDs.
   */
  function getAttestationIdsBySubjectBySchema(
    bytes memory subject,
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
    bytes memory subject
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
  function _buildAttestation(AttestationPayload memory attestationPayload) internal view returns (Attestation memory) {
    AttestationRegistry attestationRegistry = AttestationRegistry(router.getAttestationRegistry());
    return
      Attestation(
        bytes32(abi.encode(attestationRegistry.getAttestationIdCounter() + 1)),
        attestationPayload.schemaId,
        bytes32(0),
        AbstractPortal(msg.sender).getAttester(),
        msg.sender,
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
