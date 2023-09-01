// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../interface/AbstractModule.sol";
import { AttestationPayload } from "../types/Structs.sol";
// solhint-disable-next-line max-line-length
import { IERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/IERC165Upgradeable.sol";

contract CorrectModule is AbstractModule, IERC165Upgradeable {
  function test() public {}

  function run(
    AttestationPayload memory /*attestationPayload*/,
    bytes[] memory validationPayload,
    address /*txSender*/
  ) public pure override returns (bytes[] memory) {
    return (validationPayload);
  }

  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractModule).interfaceId || interfaceID == type(IERC165Upgradeable).interfaceId;
  }
}
