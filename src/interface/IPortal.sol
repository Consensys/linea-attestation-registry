// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

//TODO: Replace this interface with proper portal abstract contract in future user story
interface IPortal {
  function attest(bytes32 schemaId, bytes memory attestationData) external view returns (bool);

  function getModules() external view returns (address[] memory);
}
