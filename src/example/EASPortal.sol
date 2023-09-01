// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortal } from "../interface/AbstractPortal.sol";
import { AttestationPayload } from "../types/Structs.sol";

/**
 * @title EAS Portal
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

  function _beforeAttest(AttestationPayload memory attestation, uint256 value) internal override {}

  function _afterAttest() internal override {}

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
      attestationRequest.data.expirationTime,
      abi.encodePacked(attestationRequest.data.recipient),
      attestationRequest.data.data
    );

    super.attest(attestationPayload, validationPayload);
  }

  function bulkAttest(AttestationRequest[] memory attestationsRequests) external payable {
    AttestationPayload[] memory attestationsPayloads = new AttestationPayload[](attestationsRequests.length);
    bytes[][] memory validationPayloads = new bytes[][](attestationsRequests.length);

    for (uint256 i = 0; i < attestationsRequests.length; i++) {
      attestationsPayloads[i] = AttestationPayload(
        attestationsRequests[i].schema,
        attestationsRequests[i].data.expirationTime,
        abi.encodePacked(attestationsRequests[i].data.recipient),
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
