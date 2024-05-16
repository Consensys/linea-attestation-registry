import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { getDefaultConfig } from "connectkit";
import { Chain, createConfig } from "wagmi";
import { arbitrum, arbitrumNova, arbitrumSepolia, base, baseSepolia, linea, lineaTestnet } from "wagmi/chains";

import veraxColoredIcon from "@/assets/logo/verax-colored-icon.svg";
import ArbitrumIconDark from "@/assets/networks/arbitrum-dark.svg?react";
import ArbitrumNovaIconDark from "@/assets/networks/arbitrum-nova-dark.svg?react";
import ArbitrumNovaIcon from "@/assets/networks/arbitrum-nova.svg?react";
import ArbitrumSepoliaIcon from "@/assets/networks/arbitrum-sepolia.svg?react";
import ArbitrumIcon from "@/assets/networks/arbitrum.svg?react";
import BaseIconDark from "@/assets/networks/base-dark.svg?react";
import BaseSepoliaIcon from "@/assets/networks/base-sepolia.svg?react";
import BaseIcon from "@/assets/networks/base.svg?react";
import LineaMainnetIconDark from "@/assets/networks/linea-mainnet-dark.svg?react";
import LineaMainnetIcon from "@/assets/networks/linea-mainnet.svg?react";
import LineaSepoliaIcon from "@/assets/networks/linea-sepolia.svg?react";
import LineaTestnetIcon from "@/assets/networks/linea-testnet.svg?react";
import { INetwork } from "@/interfaces/config";

const lineaSepolia = {
  id: 59_141,
  name: "Linea Sepolia Testnet",
  network: "linea-sepolia",
  nativeCurrency: { name: "Linea Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia.linea.build"],
      webSocket: ["wss://rpc.sepolia.linea.build"],
    },
    public: {
      http: ["https://rpc.sepolia.linea.build"],
      webSocket: ["wss://rpc.sepolia.linea.build"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.lineascan.build",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 227427,
    },
  },
  testnet: true,
} as const satisfies Chain;

const chains: INetwork[] = [
  {
    name: "Linea Mainnet",
    chain: linea,
    veraxEnv: VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND,
    img: <LineaMainnetIcon />,
    imgDark: <LineaMainnetIconDark />,
    network: "linea",
  },
  {
    name: "Linea Testnet",
    chain: lineaTestnet,
    veraxEnv: VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND,
    img: <LineaTestnetIcon />,
    network: "linea-testnet",
  },
  {
    name: "Linea Sepolia",
    chain: lineaSepolia,
    veraxEnv: VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND,
    img: <LineaSepoliaIcon />,
    network: "linea-sepolia",
  },
  {
    name: "Arbitrum",
    chain: arbitrum,
    veraxEnv: VeraxSdk.DEFAULT_ARBITRUM_FRONTEND,
    img: <ArbitrumIcon />,
    imgDark: <ArbitrumIconDark />,
    network: "arbitrum",
  },
  {
    name: "Arbitrum Sepolia",
    chain: arbitrumSepolia,
    veraxEnv: VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA_FRONTEND,
    img: <ArbitrumSepoliaIcon />,
    network: "arbitrum-sepolia",
  },
  {
    name: "Arbitrum Nova",
    chain: arbitrumNova,
    veraxEnv: VeraxSdk.DEFAULT_ARBITRUM_NOVA_FRONTEND,
    img: <ArbitrumNovaIcon />,
    imgDark: <ArbitrumNovaIconDark />,
    network: "arbitrum-nova",
  },
  {
    name: "Base Mainnet",
    chain: base,
    veraxEnv: VeraxSdk.DEFAULT_BASE_FRONTEND,
    img: <BaseIcon />,
    imgDark: <BaseIconDark />,
    network: "base-mainnet",
  },
  {
    name: "Base Sepolia",
    chain: baseSepolia,
    veraxEnv: VeraxSdk.DEFAULT_BASE_SEPOLIA_FRONTEND,
    img: <BaseSepoliaIcon />,
    network: "base-sepolia",
  },
];

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    infuraId: import.meta.env.VITE_INFURA_API_KEY,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    chains: chains.map((el) => el.chain),
    appName: "Verax | Explorer",
    appIcon: veraxColoredIcon,
  }),
);

const defaultChain = chains[0];

export { lineaSepolia, chains, config, defaultChain };
