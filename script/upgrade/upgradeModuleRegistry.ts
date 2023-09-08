import { ethers, run, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  const proxyAddress = process.env.MODULE_REGISTRY_ADDRESS ?? "";
  console.log("Upgrading ModuleRegistry, with proxy at", proxyAddress);
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
  await upgrades.upgradeProxy(proxyAddress, ModuleRegistry);
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

  await run("verify:verify", {
    address: proxyAddress,
  });

  console.log(`ModuleRegistry successfully upgraded and verified!`);
  console.log(`Proxy is at ${proxyAddress}`);
  console.log(`Implementation is at ${implementationAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
