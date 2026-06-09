import { ChainName, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { getDefaultConfig } from "connectkit";
import { type Config, createConfig, http } from "wagmi";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  linea,
  lineaSepolia,
  mainnet,
} from "wagmi/chains";

import { getSubgraphUrlOverrides } from "./subgraphUrls";

import veraxColoredIcon from "@/assets/logo/verax-colored-icon.svg";
import ArbitrumIconDark from "@/assets/networks/arbitrum-dark.svg?react";
import ArbitrumSepoliaIcon from "@/assets/networks/arbitrum-sepolia.svg?react";
import ArbitrumIcon from "@/assets/networks/arbitrum.svg?react";
import BaseIconDark from "@/assets/networks/base-dark.svg?react";
import BaseSepoliaIcon from "@/assets/networks/base-sepolia.svg?react";
import BaseMainnetIcon from "@/assets/networks/base.svg?react";
import BscMainnetIconDark from "@/assets/networks/bsc-dark.svg?react";
import BscTestnetIcon from "@/assets/networks/bsc-testnet.svg?react";
import BscMainnetIcon from "@/assets/networks/bsc.svg?react";
import LineaMainnetIconDark from "@/assets/networks/linea-dark.svg?react";
import LineaSepoliaIcon from "@/assets/networks/linea-sepolia.svg?react";
import LineaMainnetIcon from "@/assets/networks/linea.svg?react";
import { INetwork, NetworkName } from "@/interfaces/config";

const infuraApiKey: string = import.meta.env.VITE_INFURA_API_KEY;

const rpcUrls = {
  [mainnet.id]: `https://mainnet.infura.io/v3/${infuraApiKey}`,
  [arbitrum.id]: `https://arbitrum-mainnet.infura.io/v3/${infuraApiKey}`,
  [arbitrumSepolia.id]: `https://arbitrum-sepolia.infura.io/v3/${infuraApiKey}`,
  [base.id]: `https://base-mainnet.infura.io/v3/${infuraApiKey}`,
  [baseSepolia.id]: `https://base-sepolia.infura.io/v3/${infuraApiKey}`,
  [bsc.id]: `https://bsc-mainnet.infura.io/v3/${infuraApiKey}`,
  [bscTestnet.id]: `https://bsc-testnet.infura.io/v3/${infuraApiKey}`,
  [linea.id]: `https://linea-mainnet.infura.io/v3/${infuraApiKey}`,
  [lineaSepolia.id]: `https://linea-sepolia.infura.io/v3/${infuraApiKey}`,
};

const transports = Object.entries(rpcUrls).reduce(
  (acc, [chainId, url]) => ({
    ...acc,
    [chainId]: http(url),
  }),
  {},
);

// Get centralized subgraph URL overrides
const subgraphUrlOverrides = getSubgraphUrlOverrides();

const chains: INetwork[] = [
  {
    name: "Linea",
    chain: linea,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND,
      subgraphUrlOverrides,
      rpcUrl: rpcUrls[linea.id],
    },
    img: <LineaMainnetIcon />,
    imgDark: <LineaMainnetIconDark />,
    network: NetworkName.LINEA,
    prefix: "0x0000",
    subgraphName: ChainName.LINEA_MAINNET,
  },
  {
    name: "Linea Sepolia",
    chain: lineaSepolia,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND,
      subgraphUrlOverrides,
      rpcUrl: rpcUrls[lineaSepolia.id],
    },
    img: <LineaSepoliaIcon />,
    network: NetworkName.LINEA_SEPOLIA,
    prefix: "0x0000",
    subgraphName: ChainName.LINEA_SEPOLIA,
  },
  {
    name: "Arbitrum",
    chain: arbitrum,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_ARBITRUM_FRONTEND,
      subgraphUrlOverrides,
      rpcUrl: rpcUrls[arbitrum.id],
    },
    img: <ArbitrumIcon />,
    imgDark: <ArbitrumIconDark />,
    network: NetworkName.ARBITRUM,
    prefix: "0x0001",
    subgraphName: ChainName.ARBITRUM_MAINNET,
  },
  {
    name: "Arbitrum Sepolia",
    chain: arbitrumSepolia,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA_FRONTEND,
      subgraphUrlOverrides,
      rpcUrl: rpcUrls[arbitrumSepolia.id],
    },
    img: <ArbitrumSepoliaIcon />,
    network: NetworkName.ARBITRUM_SEPOLIA,
    prefix: "0x0001",
    subgraphName: ChainName.ARBITRUM_SEPOLIA,
  },
  {
    name: "Base",
    chain: base,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_BASE_FRONTEND,
      subgraphUrlOverrides,
      rpcUrl: rpcUrls[base.id],
    },
    img: <BaseMainnetIcon />,
    imgDark: <BaseIconDark />,
    network: NetworkName.BASE_MAINNET,
    prefix: "0x0005",
    subgraphName: ChainName.BASE_MAINNET,
  },
  {
    name: "Base Sepolia",
    chain: baseSepolia,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_BASE_SEPOLIA_FRONTEND,
      subgraphUrlOverrides,
      rpcUrl: rpcUrls[baseSepolia.id],
    },
    img: <BaseSepoliaIcon />,
    network: NetworkName.BASE_SEPOLIA,
    prefix: "0x0005",
    subgraphName: ChainName.BASE_SEPOLIA,
  },
  {
    name: "BSC",
    chain: bsc,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_BSC_FRONTEND,
      subgraphUrlOverrides,
      rpcUrl: rpcUrls[bsc.id],
    },
    img: <BscMainnetIcon />,
    imgDark: <BscMainnetIconDark />,
    network: NetworkName.BSC_MAINNET,
    prefix: "0x0006",
    subgraphName: ChainName.BSC_MAINNET,
  },
  {
    name: "BSC Testnet",
    chain: bscTestnet,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_BSC_TESTNET_FRONTEND,
      subgraphUrlOverrides,
      rpcUrl: rpcUrls[bscTestnet.id],
    },
    img: <BscTestnetIcon />,
    network: NetworkName.BSC_TESTNET,
    prefix: "0x0006",
    subgraphName: ChainName.BSC_TESTNET,
  },
];

const config: Config = createConfig(
  getDefaultConfig({
    appName: "Verax | Explorer",
    appIcon: veraxColoredIcon,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    chains: [mainnet, ...chains.map((el) => el.chain)],
    transports,
  }) as Parameters<typeof createConfig>[0],
);

const defaultChain = chains[0];

export { lineaSepolia, chains, config, defaultChain };
