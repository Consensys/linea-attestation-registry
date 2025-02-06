import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-contract-sizer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.21",
        settings: {
          evmVersion: "london",
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  contractSizer: {
    strict: true,
  },
  defaultNetwork: "linea-sepolia",
  networks: {
    hardhat: {},
    "arbitrum-sepolia": {
      url: `https://arbitrum-sepolia.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_TESTNET !== undefined ? [process.env.PRIVATE_KEY_TESTNET] : [],
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_MAINNET !== undefined ? [process.env.PRIVATE_KEY_MAINNET] : [],
    },
    "base-sepolia": {
      url: `https://base-sepolia.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_TESTNET !== undefined ? [process.env.PRIVATE_KEY_TESTNET] : [],
    },
    base: {
      url: `https://base-mainnet.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_MAINNET !== undefined ? [process.env.PRIVATE_KEY_MAINNET] : [],
    },
    "bsc-testnet": {
      url: `https://bsc-testnet.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_TESTNET !== undefined ? [process.env.PRIVATE_KEY_TESTNET] : [],
    },
    bsc: {
      url: `https://bsc-mainnet.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_MAINNET !== undefined ? [process.env.PRIVATE_KEY_MAINNET] : [],
    },
    "linea-sepolia": {
      url: `https://linea-sepolia.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_TESTNET !== undefined ? [process.env.PRIVATE_KEY_TESTNET] : [],
    },
    linea: {
      url: `https://linea-mainnet.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_MAINNET !== undefined ? [process.env.PRIVATE_KEY_MAINNET] : [],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY ?? ""}`,
      accounts: process.env.PRIVATE_KEY_TESTNET !== undefined ? [process.env.PRIVATE_KEY_TESTNET] : [],
    },
  },
  paths: {
    sources: "./src",
  },
  etherscan: {
    apiKey: {
      "arbitrum-sepolia": process.env.ARBISCAN_API_KEY ?? "",
      arbitrum: process.env.ARBISCAN_API_KEY ?? "",
      "base-sepolia": process.env.BASESCAN_API_KEY ?? "",
      base: process.env.BASESCAN_API_KEY ?? "",
      "bsc-testnet": process.env.BSCSCAN_API_KEY ?? "",
      bsc: process.env.BSCSCAN_API_KEY ?? "",
      "linea-sepolia": process.env.LINEASCAN_API_KEY ?? "",
      linea: process.env.LINEASCAN_API_KEY ?? "",
      sepolia: process.env.ETHERSCAN_API_KEY ?? "",
    },
    customChains: [
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
        network: "bsc-testnet",
        chainId: 97,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com",
        },
      },
      {
        network: "bsc",
        chainId: 56,
        urls: {
          apiURL: "https://api.bscscan.com/api",
          browserURL: "https://bscscan.com",
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
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io",
        },
      },
    ],
  },
};

export default config;
