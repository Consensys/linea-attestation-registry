// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortal } from "../../src/interface/AbstractPortal.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

contract ValidPortalMock is AbstractPortal {
  function test() public {}

  function _beforeAttest(AttestationPayload memory attestationPayload, uint256 value) internal override {}

  function _afterAttest() internal override {}

  function _onRevoke(bytes32 attestationId, bytes32 replacedBy) internal override {}

  function _onBulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy) internal override {}

  function _onBulkAttest(
    AttestationPayload[] memory attestationsPayloads,
    bytes[][] memory validationPayloads
  ) internal override {}

  function _getAttester() public view override returns (address) {
    return msg.sender;
  }
}
