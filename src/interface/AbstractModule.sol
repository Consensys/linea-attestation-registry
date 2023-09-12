// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationPayload } from "../types/Structs.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/IERC165.sol";

abstract contract AbstractModule is IERC165 {
  function run(
    AttestationPayload memory attestationPayload,
    bytes memory validationPayload,
    address txSender,
    uint256 value
  ) public virtual;

  /**
   * @notice To check this contract implements the Module interface
   */
  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractModule).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}
