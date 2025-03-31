import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
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
import { INetwork } from "@/interfaces/config";

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

const chains: INetwork[] = [
  {
    name: "Linea Mainnet",
    chain: linea,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND,
      subgraphUrl:
        "https://gateway.thegraph.com/api/649414afdd14301c7a2f6d141f717ed1/subgraphs/id/ESRDQ5djmucKeqxNz7JGVHr621sjGEEsY6M6JibjJ9u3",
      rpcUrl: rpcUrls[linea.id],
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
        "https://gateway.thegraph.com/api/649414afdd14301c7a2f6d141f717ed1/subgraphs/id/2gfRmZ1e1uJKpCQsUrvxJmRivNa7dvvuULoc8SJabR8v",
      rpcUrl: rpcUrls[lineaSepolia.id],
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
        "https://gateway.thegraph.com/api/649414afdd14301c7a2f6d141f717ed1/subgraphs/id/ELQZyXzGu5MVA6kMCpMh5zNqdU8gqhtynM9yVRQ4bZoA",
      rpcUrl: rpcUrls[arbitrum.id],
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
        "https://gateway.thegraph.com/api/649414afdd14301c7a2f6d141f717ed1/subgraphs/id/5RBJNNUvaoekU2yJsbmEZ1R62Mo3imWy7nMgNj97ZG8u",
      rpcUrl: rpcUrls[arbitrumSepolia.id],
    },
    img: <ArbitrumSepoliaIcon />,
    network: "arbitrum-sepolia",
    prefix: "0x0001",
  },
  {
    name: "Base Mainnet",
    chain: base,
    veraxEnv: {
      ...VeraxSdk.DEFAULT_BASE_FRONTEND,
      subgraphUrl:
        "https://gateway.thegraph.com/api/649414afdd14301c7a2f6d141f717ed1/subgraphs/id/fje2qXNP7KeRBZDPFv1VCERchv9PZyZokPRWNZkWtXk",
      rpcUrl: rpcUrls[base.id],
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
        "https://gateway.thegraph.com/api/649414afdd14301c7a2f6d141f717ed1/subgraphs/id/EbruygUvdowo7dmsumFmRq2hRu81K88mWsLo5r3jxY3S",
      rpcUrl: rpcUrls[baseSepolia.id],
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
        "https://gateway.thegraph.com/api/649414afdd14301c7a2f6d141f717ed1/subgraphs/id/8VfLNCBXCFKkcfmRSLDZ6J36NG5rRCUzEgByRJXCzSoW",
      rpcUrl: rpcUrls[bsc.id],
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
        "https://gateway.thegraph.com/api/649414afdd14301c7a2f6d141f717ed1/subgraphs/id/6iFYkMd9xbQcEcddHs6vbTMarra7d2NUt9S1qtNmWtaV",
      rpcUrl: rpcUrls[bscTestnet.id],
    },
    img: <BscTestnetIcon />,
    network: "bsc-testnet",
    prefix: "0x0006",
  },
];

const config = createConfig(
  getDefaultConfig({
    appName: "Verax | Explorer",
    appIcon: veraxColoredIcon,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    chains: [mainnet, ...chains.map((el) => el.chain)],
    transports,
  }),
);

const defaultChain = chains[0];

export { lineaSepolia, chains, config, defaultChain };
