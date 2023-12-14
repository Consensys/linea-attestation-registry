require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

const { PRIVATE_KEY, LINEASCAN_API_KEY, ARBITRUM_MAINNET_PRIVATE_KEY, ARBITRUM_API_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    linea_testnet: {
      url: `https://rpc.goerli.linea.build/`,
      accounts: [PRIVATE_KEY],
    },
    arbitrum_one: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [ARBITRUM_MAINNET_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      linea_testnet: LINEASCAN_API_KEY,
      arbitrumOne: ARBITRUM_API_KEY,
    },
    customChains: [
      {
        network: "linea_testnet",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build/address",
        },
      },
    ],
  },
};
