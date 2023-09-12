// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortal } from "../../src/interface/AbstractPortal.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

contract ValidPortalMock is AbstractPortal {
  function test() public {}

  function withdraw(address payable to, uint256 amount) external override {}

  function _onAttest(AttestationPayload memory attestationPayload) internal override {}

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
