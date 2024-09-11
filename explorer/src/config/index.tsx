import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { getDefaultConfig } from "connectkit";
import { Chain, createConfig, mainnet } from "wagmi";
import { arbitrum, arbitrumNova, arbitrumSepolia, base, baseSepolia, bsc, bscTestnet, linea } from "wagmi/chains";

import veraxColoredIcon from "@/assets/logo/verax-colored-icon.svg";
import ArbitrumIconDark from "@/assets/networks/arbitrum-dark.svg?react";
import ArbitrumNovaIconDark from "@/assets/networks/arbitrum-nova-dark.svg?react";
import ArbitrumNovaIcon from "@/assets/networks/arbitrum-nova.svg?react";
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
    veraxEnv: {
      ...VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND,
      subgraphUrl:
        "https://gateway-arbitrum.network.thegraph.com/api/3b8bfe072786fa4a76463cf486f4985b/subgraphs/id/ESRDQ5djmucKeqxNz7JGVHr621sjGEEsY6M6JibjJ9u3",
    },
    img: <LineaMainnetIcon />,
    imgDark: <LineaMainnetIconDark />,
    network: "linea",
    prefix: "0x0000",
  },
  {
    name: "Linea Sepolia",
    chain: lineaSepolia,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND,
      subgraphUrl:
        "https://gateway-arbitrum.network.thegraph.com/api/3b8bfe072786fa4a76463cf486f4985b/subgraphs/id/2gfRmZ1e1uJKpCQsUrvxJmRivNa7dvvuULoc8SJabR8v",
    },
    img: <LineaSepoliaIcon />,
    network: "linea-sepolia",
    prefix: "0x0000",
  },
  {
    name: "Arbitrum",
    chain: arbitrum,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_ARBITRUM_FRONTEND,
      subgraphUrl:
        "https://gateway-arbitrum.network.thegraph.com/api/3b8bfe072786fa4a76463cf486f4985b/subgraphs/id/ELQZyXzGu5MVA6kMCpMh5zNqdU8gqhtynM9yVRQ4bZoA",
    },
    img: <ArbitrumIcon />,
    imgDark: <ArbitrumIconDark />,
    network: "arbitrum",
    prefix: "0x0001",
  },
  {
    name: "Arbitrum Sepolia",
    chain: arbitrumSepolia,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA_FRONTEND,
      subgraphUrl:
        "https://gateway-arbitrum.network.thegraph.com/api/3b8bfe072786fa4a76463cf486f4985b/subgraphs/id/5RBJNNUvaoekU2yJsbmEZ1R62Mo3imWy7nMgNj97ZG8u",
    },
    img: <ArbitrumSepoliaIcon />,
    network: "arbitrum-sepolia",
    prefix: "0x0001",
  },
  {
    name: "Arbitrum Nova",
    chain: arbitrumNova,
    veraxEnv: VeraxSdk.DEFAULT_ARBITRUM_NOVA_FRONTEND,
    img: <ArbitrumNovaIcon />,
    imgDark: <ArbitrumNovaIconDark />,
    network: "arbitrum-nova",
    prefix: "0x0002",
  },
  {
    name: "Base Mainnet",
    chain: base,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_BASE_FRONTEND,
      subgraphUrl:
        "https://gateway-arbitrum.network.thegraph.com/api/3b8bfe072786fa4a76463cf486f4985b/subgraphs/id/fje2qXNP7KeRBZDPFv1VCERchv9PZyZokPRWNZkWtXk",
    },
    img: <BaseMainnetIcon />,
    imgDark: <BaseIconDark />,
    network: "base-mainnet",
    prefix: "0x0005",
  },
  {
    name: "Base Sepolia",
    chain: baseSepolia,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_BASE_SEPOLIA_FRONTEND,
      subgraphUrl:
        "https://gateway-arbitrum.network.thegraph.com/api/3b8bfe072786fa4a76463cf486f4985b/subgraphs/id/EbruygUvdowo7dmsumFmRq2hRu81K88mWsLo5r3jxY3S",
    },
    img: <BaseSepoliaIcon />,
    network: "base-sepolia",
    prefix: "0x0005",
  },
  {
    name: "BSC Mainnet",
    chain: bsc,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_BSC_FRONTEND,
      subgraphUrl:
        "https://gateway-arbitrum.network.thegraph.com/api/3b8bfe072786fa4a76463cf486f4985b/subgraphs/id/8VfLNCBXCFKkcfmRSLDZ6J36NG5rRCUzEgByRJXCzSoW",
    },
    img: <BscMainnetIcon />,
    imgDark: <BscMainnetIconDark />,
    network: "bsc-mainnet",
    prefix: "0x0006",
  },
  {
    name: "BSC Testnet",
    chain: bscTestnet,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_BSC_TESTNET_FRONTEND,
      subgraphUrl:
        "https://gateway-arbitrum.network.thegraph.com/api/3b8bfe072786fa4a76463cf486f4985b/subgraphs/id/6iFYkMd9xbQcEcddHs6vbTMarra7d2NUt9S1qtNmWtaV",
    },
    img: <BscTestnetIcon />,
    network: "bsc-testnet",
    prefix: "0x0006",
  },
];

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    infuraId: import.meta.env.VITE_INFURA_API_KEY,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    chains: [...chains.map((el) => el.chain), mainnet],
    appName: "Verax | Explorer",
    appIcon: veraxColoredIcon,
  }),
);

const defaultChain = chains[0];

export { lineaSepolia, chains, config, defaultChain };
