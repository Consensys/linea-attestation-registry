const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

const { PROXY_ADDRESS } = process.env;

async function main() {
  const VeraxVotingNFT = await ethers.getContractFactory("VeraxVotingNFT");
  const upgraded = await upgrades.upgradeProxy(PROXY_ADDRESS, VeraxVotingNFT);
  console.log("upgrade completed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
