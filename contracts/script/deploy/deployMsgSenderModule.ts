import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying MsgSenderModule...");
  const MsgSenderModule = await ethers.getContractFactory("MsgSenderModule");
  const msgSenderModule = await MsgSenderModule.deploy();
  await msgSenderModule.waitForDeployment();
  const msgSenderModuleAddress = await msgSenderModule.getAddress();

  await run("verify:verify", {
    address: msgSenderModuleAddress,
  });

  console.log(`MsgSenderModule successfully deployed and verified at ${msgSenderModuleAddress}!`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
