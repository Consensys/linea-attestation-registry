import { ethers, run, upgrades } from "hardhat";

async function main() {
  console.log("Deploying ModuleRegistry...");
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
  const moduleRegistry = await upgrades.deployProxy(ModuleRegistry);
  await moduleRegistry.waitForDeployment();
  const proxyAddress = await moduleRegistry.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

  await run("verify:verify", {
    address: proxyAddress,
  });

  console.log(`ModuleRegistry successfully deployed and verified!`);
  console.log(`Proxy is at ${proxyAddress}`);
  console.log(`Implementation is at ${implementationAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
