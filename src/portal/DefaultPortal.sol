// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractPortal } from "../interface/AbstractPortal.sol";
import { AttestationPayload } from "../types/Structs.sol";

/**
 * @title Default Portal
 * @author Consensys
 * @notice This contract aims to provide a default portal
 * @dev This Portal does not add any logic to the AbstractPortal
 */
contract DefaultPortal is AbstractPortal {
  function withdraw(address payable to, uint256 amount) external override {}
}
