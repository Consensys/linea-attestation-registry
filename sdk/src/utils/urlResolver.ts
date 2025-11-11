import { Chain } from "viem";
import { arbitrum, arbitrumSepolia, base, baseSepolia, bsc, bscTestnet, linea, lineaSepolia } from "viem/chains";
import { ChainName, Conf } from "../types";

const DEFAULT_SUBGRAPH_URLS: Record<ChainName, string> = {
  [ChainName.LINEA_MAINNET]: "https://api.studio.thegraph.com/query/67521/verax-v2-linea/v0.0.1",
  [ChainName.LINEA_SEPOLIA]: "https://api.studio.thegraph.com/query/67521/verax-v2-linea-sepolia/v0.0.2",
  [ChainName.ARBITRUM_MAINNET]: "https://api.studio.thegraph.com/query/67521/verax-v2-arbitrum/v0.0.2",
  [ChainName.ARBITRUM_SEPOLIA]: "https://api.studio.thegraph.com/query/67521/verax-v2-arbitrum-sepolia/v0.0.2",
  [ChainName.BASE_MAINNET]: "https://api.studio.thegraph.com/query/67521/verax-v2-base/v0.0.1",
  [ChainName.BASE_SEPOLIA]: "https://api.studio.thegraph.com/query/67521/verax-v2-base-sepolia/v0.0.2",
  [ChainName.BSC_MAINNET]: "https://api.studio.thegraph.com/query/67521/verax-v2-bsc/v0.0.1",
  [ChainName.BSC_TESTNET]: "https://api.studio.thegraph.com/query/67521/verax-v2-bsc-testnet/v0.0.1",
};

function chainToChainName(chain: Chain): ChainName {
  const chainIdToName: Record<number, ChainName> = {
    [linea.id]: ChainName.LINEA_MAINNET,
    [lineaSepolia.id]: ChainName.LINEA_SEPOLIA,
    [arbitrum.id]: ChainName.ARBITRUM_MAINNET,
    [arbitrumSepolia.id]: ChainName.ARBITRUM_SEPOLIA,
    [base.id]: ChainName.BASE_MAINNET,
    [baseSepolia.id]: ChainName.BASE_SEPOLIA,
    [bsc.id]: ChainName.BSC_MAINNET,
    [bscTestnet.id]: ChainName.BSC_TESTNET,
  };

  const chainName = chainIdToName[chain.id];
  if (!chainName) {
    throw new Error(`Unsupported chain ID: ${chain.id} (${chain.name})`);
  }

  return chainName;
}

export function getSubgraphUrlForChain(chainName: ChainName, conf: Conf): string {
  // Priority 1: Check for chain-specific override
  if (conf.subgraphUrlOverrides?.[chainName]) {
    return conf.subgraphUrlOverrides[chainName]!;
  }

  // Priority 2: Use subgraphUrl if it's for the configured chain
  // This maintains backward compatibility
  const configuredChainName = chainToChainName(conf.chain);
  if (chainName === configuredChainName && conf.subgraphUrl) {
    return conf.subgraphUrl;
  }

  // Priority 3: Fallback to default URL
  return DEFAULT_SUBGRAPH_URLS[chainName];
}

export function getConfiguredSubgraphUrl(conf: Conf): string {
  const chainName = chainToChainName(conf.chain);
  return getSubgraphUrlForChain(chainName, conf);
}
