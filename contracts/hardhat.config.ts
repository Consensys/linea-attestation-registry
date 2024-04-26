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
    "arbitrum-sepolia": {
      url: `https://arbitrum-sepolia.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts:
        process.env.PRIVATE_KEY_ARBITRUM_SEPOLIA !== undefined ? [process.env.PRIVATE_KEY_ARBITRUM_SEPOLIA] : [],
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts:
        process.env.PRIVATE_KEY_ARBITRUM_MAINNET !== undefined ? [process.env.PRIVATE_KEY_ARBITRUM_MAINNET] : [],
    },
    "arbitrum-nova": {
      url: "https://arbitrum-nova.publicnode.com",
      accounts: process.env.PRIVATE_KEY_NOVA !== undefined ? [process.env.PRIVATE_KEY_NOVA] : [],
    },
    "base-sepolia": {
      url: `https://sepolia.base.org`,
      accounts: process.env.PRIVATE_KEY_LINEA_TESTNET !== undefined ? [process.env.PRIVATE_KEY_LINEA_TESTNET] : [],
    },
    base: {
      url: `https://mainnet.base.org`,
      accounts: process.env.PRIVATE_KEY_LINEA_MAINNET !== undefined ? [process.env.PRIVATE_KEY_LINEA_MAINNET] : [],
    },
    "linea-goerli": {
      url: `https://linea-goerli.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_LINEA_TESTNET !== undefined ? [process.env.PRIVATE_KEY_LINEA_TESTNET] : [],
    },
    "linea-sepolia": {
      url: `https://linea-sepolia.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_LINEA_SEPOLIA !== undefined ? [process.env.PRIVATE_KEY_LINEA_SEPOLIA] : [],
    },
    linea: {
      url: `https://linea-mainnet.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_LINEA_MAINNET !== undefined ? [process.env.PRIVATE_KEY_LINEA_MAINNET] : [],
    },
    "scroll-sepolia": {
      url: "https://sepolia-rpc.scroll.io/",
      accounts: process.env.PRIVATE_KEY_SCROLL_TESTNET !== undefined ? [process.env.PRIVATE_KEY_SCROLL_TESTNET] : [],
    },
  },
  paths: {
    sources: "./src",
  },
  etherscan: {
    apiKey: {
      "arbitrum-goerli": process.env.ARBISCAN_API_KEY ?? "",
      "arbitrum-sepolia": process.env.ARBISCAN_API_KEY ?? "",
      arbitrum: process.env.ARBISCAN_API_KEY ?? "",
      "arbitrum-nova": process.env.ARBISCAN_NOVA_API_KEY ?? "",
      "base-sepolia": process.env.BASESCAN_API_KEY ?? "",
      base: process.env.BASESCAN_API_KEY ?? "",
      "linea-goerli": process.env.LINEASCAN_API_KEY ?? "",
      "linea-sepolia": process.env.LINEASCAN_API_KEY ?? "",
      linea: process.env.LINEASCAN_API_KEY ?? "",
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
        network: "arbitrum-sepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io",
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
        network: "arbitrum-nova",
        chainId: 42170,
        urls: {
          apiURL: "https://api-nova.arbiscan.io/api",
          browserURL: "https://nova.arbiscan.io/",
        },
      },
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org/",
        },
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
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
        network: "linea-sepolia",
        chainId: 59141,
        urls: {
          apiURL: "https://api-sepolia.lineascan.build/api",
          browserURL: "https://sepolia.lineascan.build",
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
