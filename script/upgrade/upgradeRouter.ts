import { ethers, run, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  const proxyAddress = process.env.ROUTER_ADDRESS ?? "";
  console.log("Upgrading Router, with proxy at", proxyAddress);
  const Router = await ethers.getContractFactory("Router");
  await upgrades.upgradeProxy(proxyAddress, Router);
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

  await run("verify:verify", {
    address: proxyAddress,
  });

  console.log(`Router successfully upgraded and verified!`);
  console.log(`Proxy is at ${proxyAddress}`);
  console.log(`Implementation is at ${implementationAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
