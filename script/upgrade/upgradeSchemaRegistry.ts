import { ethers, run, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  const proxyAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";
  console.log("Upgrading SchemaRegistry, with proxy at", proxyAddress);
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  await upgrades.upgradeProxy(proxyAddress, SchemaRegistry);
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

  await run("verify:verify", {
    address: proxyAddress,
  });

  console.log(`SchemaRegistry successfully upgraded and verified!`);
  console.log(`Proxy is at ${proxyAddress}`);
  console.log(`Implementation is at ${implementationAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
