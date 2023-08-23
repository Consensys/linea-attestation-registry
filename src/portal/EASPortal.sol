// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

// solhint-disable-next-line max-line-length
import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { AbstractPortal } from "../interface/AbstractPortal.sol";
import { Attestation, AttestationPayload, Portal } from "../types/Structs.sol";

/**
 * @title EAS Portal
 * @author Consensys
 * @notice This contract aims to provide a default portal
 */
contract EASPortal is AbstractPortal {
  struct AttestationRequestData {
    address recipient;
    uint64 expirationTime;
    bool revocable;
    bytes32 refUID;
    bytes data;
    uint256 value;
  }

  struct AttestationRequest {
    bytes32 schema;
    AttestationRequestData data;
  }

  function _beforeAttest(AttestationPayload memory attestation, uint256 value) internal override {}

  function _afterAttest(Attestation memory attestation) internal override {}

  function _onRevoke(bytes32 attestationId, bytes32 replacedBy) internal override {}

  function _onBulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) internal override {}

  function _onBulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) internal override {}

  function attest(AttestationRequest memory attestationRequest) external payable {
    bytes[] memory validationPayload = new bytes[](0);

    AttestationPayload memory attestationPayload = AttestationPayload(
      attestationRequest.schema,
      abi.encodePacked(attestationRequest.data.recipient),
      uint256(attestationRequest.data.expirationTime),
      attestationRequest.data.data
    );

    super.attest(attestationPayload, validationPayload);
  }

  function bulkAttest(AttestationRequest[] memory attestationsRequests) external payable {
    AttestationPayload[] memory attestationsPayloads = new AttestationPayload[](attestationsRequests.length);
    bytes[][] memory validationPayloads = new bytes[][](attestationsRequests.length);

    for (uint i = 0; i < attestationsRequests.length; i++) {
      attestationsPayloads[i] = AttestationPayload(
        attestationsRequests[i].schema,
        abi.encodePacked(attestationsRequests[i].data.recipient),
        uint256(attestationsRequests[i].data.expirationTime),
        attestationsRequests[i].data.data
      );

      validationPayloads[i] = new bytes[](0);
    }

    super.bulkAttest(attestationsPayloads, validationPayloads);
  }

  function revoke(bytes32 /*attestationId*/, bytes32 /*replacedBy*/) external pure override {
    revert("No revoking");
  }

  function bulkRevoke(bytes32[] memory /*attestationIds*/, bytes32[] memory /*replacedBy*/) external pure override {
    revert("No bulk revoking");
  }
}
