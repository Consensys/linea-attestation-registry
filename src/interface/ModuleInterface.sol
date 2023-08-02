// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

//TODO: Replace this interface with proper module interface in future user story
interface ModuleInterface {
  function run() external view returns (bool);
}