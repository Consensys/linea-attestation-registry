// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Script } from "forge-std/Script.sol";
import { PortalRegistry } from "../src/PortalRegistry.sol";

contract PortalRegistryScript is Script {
  function setUp() public {}

  function test() public {}

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);

    new PortalRegistry();

    vm.stopBroadcast();
  }
}
