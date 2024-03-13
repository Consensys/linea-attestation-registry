import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const { CONTRACT_OWNER } = process.env;

async function main() {
  const veraxVotingNFT = await ethers.deployContract("VeraxVotingNFT", [CONTRACT_OWNER]);

  await veraxVotingNFT.waitForDeployment();

  console.log(`Deployed contract at ${veraxVotingNFT.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
