import { ethers, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const { CONTRACT_OWNER } = process.env;

async function main() {
  const VeraxVotingNFT = await ethers.getContractFactory("VeraxVotingNFT");
  const proxy = await upgrades.deployProxy(VeraxVotingNFT, [CONTRACT_OWNER]);
  await proxy.waitForDeployment();
  console.log("Voting NFT deployed to:", await proxy.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
