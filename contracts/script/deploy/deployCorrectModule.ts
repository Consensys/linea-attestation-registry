import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying CorrectModule...");
  const CorrectModule = await ethers.getContractFactory("CorrectModule");
  const correctModule = await CorrectModule.deploy();
  await correctModule.waitForDeployment();
  const correctModuleAddress = await correctModule.getAddress();

  await run("verify:verify", {
    address: correctModuleAddress,
  });

  console.log(`CorrectModule successfully deployed and verified at ${correctModuleAddress}!`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
