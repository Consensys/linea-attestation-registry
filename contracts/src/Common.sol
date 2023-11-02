// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

/**
 * @notice This function is inspired by PADO Labs' codebase
 * solhint-disable-next-line max-line-length
 * https://github.com/pado-labs/offchain-data-hooks/blob/c6f37ad2a42d0eb40cf2295aed68ea3b94ee0925/src/hooks/Common.sol#L45
 * @dev A helper function to work with unchecked uint256 iterators in loops
 */
function uncheckedInc256(uint256 i) pure returns (uint256 j) {
  unchecked {
    j = i + 1;
  }
}

/**
 * @notice This function is inspired by PADO Labs' codebase
 * solhint-disable-next-line max-line-length
 * https://github.com/pado-labs/offchain-data-hooks/blob/c6f37ad2a42d0eb40cf2295aed68ea3b94ee0925/src/hooks/Common.sol#L45
 * @dev A helper function to work with unchecked uint32 iterators in loops
 */
function uncheckedInc32(uint32 i) pure returns (uint32 j) {
  unchecked {
    j = i + 1;
  }
}
