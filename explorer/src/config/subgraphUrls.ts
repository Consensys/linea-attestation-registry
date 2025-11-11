import { ChainName } from "@verax-attestation-registry/verax-sdk";

/**
 * Centralized subgraph URL configuration for all supported chains.
 *
 * These URLs use The Graph Gateway with an API key for higher rate limits.
 *
 * TODO: Update each URL with the latest subgraph deployment IDs
 * TODO: Verify API key is still valid (currently: 649414afdd14301c7a2f6d141f717ed1)
 */

const THE_GRAPH_API_KEY = import.meta.env.VITE_THE_GRAPH_API_KEY || "649414afdd14301c7a2f6d141f717ed1";

export const SUBGRAPH_URL_OVERRIDES: Partial<Record<ChainName, string>> = {
  // Linea Mainnet
  // Current: ESRDQ5djmucKeqxNz7JGVHr621sjGEEsY6M6JibjJ9u3
  // TODO: Verify this is the latest deployment ID for verax-v2-linea
  [ChainName.LINEA_MAINNET]: `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/ESRDQ5djmucKeqxNz7JGVHr621sjGEEsY6M6JibjJ9u3`,

  // Linea Sepolia
  // Current: 2gfRmZ1e1uJKpCQsUrvxJmRivNa7dvvuULoc8SJabR8v
  // TODO: Verify this is the latest deployment ID for verax-v2-linea-sepolia
  [ChainName.LINEA_SEPOLIA]: `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/2gfRmZ1e1uJKpCQsUrvxJmRivNa7dvvuULoc8SJabR8v`,

  // Arbitrum Mainnet
  // Current: ELQZyXzGu5MVA6kMCpMh5zNqdU8gqhtynM9yVRQ4bZoA
  // TODO: Verify this is the latest deployment ID for verax-v2-arbitrum
  [ChainName.ARBITRUM_MAINNET]: `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/ELQZyXzGu5MVA6kMCpMh5zNqdU8gqhtynM9yVRQ4bZoA`,

  // Arbitrum Sepolia
  // Current: 5RBJNNUvaoekU2yJsbmEZ1R62Mo3imWy7nMgNj97ZG8u
  // TODO: Verify this is the latest deployment ID for verax-v2-arbitrum-sepolia
  [ChainName.ARBITRUM_SEPOLIA]: `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/5RBJNNUvaoekU2yJsbmEZ1R62Mo3imWy7nMgNj97ZG8u`,

  // Base Mainnet
  // Current: fje2qXNP7KeRBZDPFv1VCERchv9PZyZokPRWNZkWtXk
  // TODO: Verify this is the latest deployment ID for verax-v2-base
  [ChainName.BASE_MAINNET]: `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/fje2qXNP7KeRBZDPFv1VCERchv9PZyZokPRWNZkWtXk`,

  // Base Sepolia
  // Current: EbruygUvdowo7dmsumFmRq2hRu81K88mWsLo5r3jxY3S
  // TODO: Verify this is the latest deployment ID for verax-v2-base-sepolia
  [ChainName.BASE_SEPOLIA]: `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/EbruygUvdowo7dmsumFmRq2hRu81K88mWsLo5r3jxY3S`,

  // BSC Mainnet
  // Current: 8VfLNCBXCFKkcfmRSLDZ6J36NG5rRCUzEgByRJXCzSoW
  // TODO: Verify this is the latest deployment ID for verax-v2-bsc
  [ChainName.BSC_MAINNET]: `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/8VfLNCBXCFKkcfmRSLDZ6J36NG5rRCUzEgByRJXCzSoW`,

  // BSC Testnet
  // Current: 6iFYkMd9xbQcEcddHs6vbTMarra7d2NUt9S1qtNmWtaV
  // TODO: Verify this is the latest deployment ID for verax-v2-bsc-testnet
  [ChainName.BSC_TESTNET]: `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/6iFYkMd9xbQcEcddHs6vbTMarra7d2NUt9S1qtNmWtaV`,
};

/**
 * Helper to check if we should use URL overrides.
 * By default, always uses custom URLs (dev + prod) for better performance.
 * Set VITE_USE_FREE_SUBGRAPH_URLS=true to disable and use free URLs.
 */
export const shouldUseCustomUrls = (): boolean => {
  // Disable custom URLs only if explicitly requested
  return import.meta.env.VITE_USE_FREE_SUBGRAPH_URLS !== "true";
};

/**
 * Gets the subgraph URL overrides to use based on environment.
 * Returns the custom URLs by default for better performance (higher rate limits).
 */
export const getSubgraphUrlOverrides = (): Partial<Record<ChainName, string>> | undefined => {
  return shouldUseCustomUrls() ? SUBGRAPH_URL_OVERRIDES : undefined;
};
