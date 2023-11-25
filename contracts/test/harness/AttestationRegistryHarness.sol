// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AttestationRegistry } from "../../src/AttestationRegistry.sol";

/**
 * @title AttestationRegistry Harness
 * @author Consensys
 * @notice A "harness" contract aims to expose internal functions of a tested contract
 *         In this case, it exposes the `generateAttestationId` function of the AttestationRegistry contract
 * @dev Foundry doc on harness contracts: https://book.getfoundry.sh/tutorials/best-practices#internal-functions
 */
contract AttestationRegistryHarness is AttestationRegistry {
  function exposed_generateAttestationId(uint256 id) external view returns (bytes32) {
    return generateAttestationId(id);
  }
}
