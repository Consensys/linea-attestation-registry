import { ethers, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const { PROXY_ADDRESS } = process.env;

async function main() {
  const VeraxVotingNFT = await ethers.getContractFactory("VeraxVotingNFT");
  await upgrades.upgradeProxy(PROXY_ADDRESS ?? "", VeraxVotingNFT);
  console.log("upgrade completed");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
