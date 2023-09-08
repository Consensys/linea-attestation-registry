import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.21",
        settings: {
          evmVersion: "paris",
        },
      },
    ],
  },
  defaultNetwork: "linea-goerli",
  networks: {
    hardhat: {},
    "linea-goerli": {
      url: `https://linea-goerli.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
    linea: {
      url: `https://linea-mainnet.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
  },
  paths: {
    sources: "./src",
  },
  etherscan: {
    apiKey: {
      "linea-goerli": process.env.ETHERSCAN_API_KEY ?? "",
      linea: process.env.ETHERSCAN_API_KEY ?? "",
    },
    customChains: [
      {
        network: "linea-goerli",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build",
        },
      },
      {
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build",
        },
      },
    ],
  },
};

export default config;
