// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Script } from "forge-std/Script.sol";
import { AttestationRegistry } from "../src/AttestationRegistry.sol";

contract AttestationRegistryScript is Script {
  function setUp() public {}

  function test() public {}

  function run() external {
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
    address portalRegistry = vm.envAddress("PORTAL_REGISTRY_ADDRESS");
    address schemaRegistry = vm.envAddress("SCHEMA_REGISTRY_ADDRESS");

    vm.startBroadcast(deployerPrivateKey);

    // Deploy the contract
    AttestationRegistry attestationRegistry = new AttestationRegistry();

    // Initialize the contract
    attestationRegistry.initialize(portalRegistry, schemaRegistry);

    vm.stopBroadcast();
  }
}
