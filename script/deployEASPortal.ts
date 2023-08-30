import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying EASPortal...");
  const EASPortal = await ethers.getContractFactory("EASPortal");
  const easPortal = await EASPortal.deploy();
  await easPortal.waitForDeployment();
  const easPortalAddress = await easPortal.getAddress();

  await run("verify:verify", {
    address: easPortalAddress,
  });

  console.log(`EASPortal successfully deployed, registered and verified!`);
  console.log(`EASPortal is at ${easPortalAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
