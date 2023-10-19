// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortal } from "../../interface/AbstractPortal.sol";
import { AttestationPayload } from "../../types/Structs.sol";

/**
 * @title EAS Portal
 * @author Consensys
 * @notice This is an example of how to maintain interoperability with EAS - https://attest.sh
 */
contract EASPortal is AbstractPortal {
  // @notice This struct is defined in EAS's contracts' codebase
  // solhint-disable-next-line max-line-length
  // this definition was taken from: https://github.com/ethereum-attestation-service/eas-contracts/blob/master/contracts/IEAS.sol#L9
  struct AttestationRequestData {
    address recipient;
    uint64 expirationTime;
    bool revocable;
    bytes32 refUID;
    bytes data;
    uint256 value;
  }

  // @notice This struct is defined in EAS's contracts' codebase
  // solhint-disable-next-line max-line-length
  // definition taken from: https://github.com/ethereum-attestation-service/eas-contracts/blob/master/contracts/IEAS.sol#L19
  struct AttestationRequest {
    bytes32 schema;
    AttestationRequestData data;
  }

  bytes32 private _relationshipSchemaId = 0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0;

  /// @notice Error thrown when reference attestation with refUID is not registered
  error ReferenceAttestationNotRegistered();
  /// @notice Error thrown when trying to revoke an attestation
  error NoRevocation();
  /// @notice Error thrown when trying to bulk revoke attestations
  error NoBulkRevocation();

  constructor(address[] memory modules, address router) AbstractPortal(modules, router) {}

  /// @inheritdoc AbstractPortal
  function withdraw(address payable to, uint256 amount) external override {}

  /**
   * @notice Issues a Verax attestation based on an EAS attestation
   * @param attestationRequest the EAS payload to attest
   * @dev If a related EAS attestation exists, it will also be attested on Verax and linked via the dedicated Schema
   */
  function attest(AttestationRequest memory attestationRequest) public payable {
    bytes[] memory validationPayload = new bytes[](0);

    AttestationPayload memory attestationPayload = AttestationPayload(
      attestationRequest.schema,
      attestationRequest.data.expirationTime,
      abi.encodePacked(attestationRequest.data.recipient),
      attestationRequest.data.data
    );
    super.attest(attestationPayload, validationPayload);
    // if refUID exists then create relationship attestation
    if (attestationRequest.data.refUID != 0) {
      if (!attestationRegistry.isRegistered(attestationRequest.data.refUID)) revert ReferenceAttestationNotRegistered();

      uint32 attestationIdCounter = attestationRegistry.getAttestationIdCounter();
      bytes32 attestationId = bytes32(abi.encode(attestationIdCounter));

      AttestationPayload memory relationshipAttestationPayload = AttestationPayload(
        _relationshipSchemaId,
        attestationRequest.data.expirationTime,
        abi.encodePacked(attestationRequest.data.refUID),
        abi.encode(attestationId, "EASrefUID", attestationRequest.data.refUID)
      );

      super.attest(relationshipAttestationPayload, validationPayload);
    }
  }

  /**
   * @notice Issues Verax attestations in bulk, based on a list of EAS attestations
   * @param attestationsRequests the EAS payloads to attest
   */
  function bulkAttest(AttestationRequest[] memory attestationsRequests) external payable {
    for (uint256 i = 0; i < attestationsRequests.length; i++) {
      attest(attestationsRequests[i]);
    }
  }

  /**
   * @inheritdoc AbstractPortal
   * @notice This portal doesn't allow for an attestation to be revoked
   */
  function _onRevoke(bytes32 /*attestationId*/) internal pure override {
    revert NoRevocation();
  }

  /**
   * @inheritdoc AbstractPortal
   * @notice This portal doesn't allow for attestations to be revoked
   */
  function _onBulkRevoke(bytes32[] memory /*attestationIds*/) internal pure override {
    revert NoBulkRevocation();
  }
}
