require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();

const { DEPLOYER_PRIVATE_KEY, ARBITRUM_RPC_URL } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    arbitrum: {
      url: ARBITRUM_RPC_URL, // Make sure this is correctly set in your .env file
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`] // Ensure the private key is set in .env
    }
  },
  etherscan: {
    apiKey: {
      arbitrumOne: "3E2SGKYV7FDHHCWTPMPCV74Y88MDXY8T1Y" // Use the correct network name here
    }
  }
};
