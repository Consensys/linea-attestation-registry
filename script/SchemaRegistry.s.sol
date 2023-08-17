// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Script } from "forge-std/Script.sol";
import { SchemaRegistry } from "../src/SchemaRegistry.sol";

contract SchemaRegistryScript is Script {
  function setUp() public {}

  function test() public {}

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    new SchemaRegistry();

    vm.stopBroadcast();
  }
}
