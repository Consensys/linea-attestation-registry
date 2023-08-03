// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Script } from "forge-std/Script.sol";
import { CorrectModule } from "../src/example/CorrectModule.sol";

contract CorrectModuleScript is Script {
  function setUp() public {}

  function test() public {}

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    new CorrectModule();

    vm.stopBroadcast();
  }
}
