const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

const { CONTRACT_OWNER } = process.env;

async function main() {
  const VeraxVotingNFT = await ethers.getContractFactory("VeraxVotingNFT");
  const proxy = await upgrades.deployProxy(VeraxVotingNFT, [CONTRACT_OWNER]);
  await proxy.waitForDeployment();
  console.log("Voting NFT deployed to:", await proxy.getAddress());
}

main();
