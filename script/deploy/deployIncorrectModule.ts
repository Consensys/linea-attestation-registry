import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying IncorrectModule...");
  const IncorrectModule = await ethers.getContractFactory("IncorrectModule");
  const incorrectModule = await IncorrectModule.deploy();
  await incorrectModule.waitForDeployment();
  const incorrectModuleAddress = await incorrectModule.getAddress();

  await run("verify:verify", {
    address: incorrectModuleAddress,
  });

  console.log(`IncorrectModule successfully deployed and verified at ${incorrectModuleAddress}!`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
