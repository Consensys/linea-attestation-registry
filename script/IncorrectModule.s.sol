// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Script } from "forge-std/Script.sol";
import { IncorrectModule } from "../src/example/IncorrectModule.sol";

contract IncorrectModuleScript is Script {
  function setUp() public {}

  function test() public {}

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    new IncorrectModule();

    vm.stopBroadcast();
  }
}
