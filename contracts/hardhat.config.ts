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
    "arbitrum-goerli": {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      chainId: 421613,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    "linea-goerli": {
      url: `https://linea-goerli.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    linea: {
      url: `https://linea-mainnet.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    "scroll-sepolia": {
      url: "https://sepolia-rpc.scroll.io/" || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: "./src",
  },
  etherscan: {
    apiKey: {
      "arbitrum-goerli": process.env.ETHERSCAN_API_KEY ?? "KAFVN62ITWU9JZK5MZN9KC9DFX4VKM85BX",
      arbitrum: process.env.ETHERSCAN_API_KEY ?? "KAFVN62ITWU9JZK5MZN9KC9DFX4VKM85BX",
      "linea-goerli": process.env.ETHERSCAN_API_KEY ?? "",
      linea: process.env.ETHERSCAN_API_KEY ?? "",
      sepolia: process.env.ETHERSCAN_API_KEY ?? "",
      "scroll-sepolia": process.env.SCROLL_API_KEY ?? "",
    },
    customChains: [
      {
        network: "arbitrum-goerli",
        chainId: 421613,
        urls: {
          apiURL: "https://api-goerli.arbiscan.io/api",
          browserURL: "https://goerli.arbiscan.io",
        },
      },
      {
        network: "arbitrum",
        chainId: 42161,
        urls: {
          apiURL: "https://api.arbiscan.io/api",
          browserURL: "https://arbiscan.io",
        },
      },
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
      {
        network: "scroll-sepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://sepolia-blockscout.scroll.io/api",
          browserURL: "https://sepolia-blockscout.scroll.io/",
        },
      },
    ],
  },
};

export default config;
