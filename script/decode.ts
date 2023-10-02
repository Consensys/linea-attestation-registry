import { AbiCoder } from "ethers";

/*
 * This script aims to rec recreate a lost "network file".
 * Forces the import of an existing proxy contract deployment to be used with this plugin.
 * OpenZeppelin doc: https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#force-import
 * OpenZeppelin doc on network files: https://docs.openzeppelin.com/upgrades-plugins/1.x/network-files
 */
async function main() {
  console.log("Decoding...");

  const abiCoder = new AbiCoder();
  const decoded = abiCoder.decode(["address"], "0x000000000000000000000000809e815596abeb3764abf81be2dc39fbbacc9949");

  console.log(`Decoded to ${decoded}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
