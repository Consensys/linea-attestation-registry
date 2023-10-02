import { AbiCoder } from "ethers";

/*
 * This script aims to rec recreate a lost "network file".
 * Forces the import of an existing proxy contract deployment to be used with this plugin.
 * OpenZeppelin doc: https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#force-import
 * OpenZeppelin doc on network files: https://docs.openzeppelin.com/upgrades-plugins/1.x/network-files
 */
async function main() {
  console.log("Encoding...");

  const abiCoder = new AbiCoder();
  const encoded = abiCoder.encode(["address"], ["0x809e815596AbEB3764aBf81BE2DC39fBBAcc9949"]);

  console.log(`Encoded to ${encoded}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
