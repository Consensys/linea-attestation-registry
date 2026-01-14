import { getMeshOptions, getSdk } from "../../.graphclient";
import { getMesh } from "@graphql-mesh/runtime";
import { ChainName, CrossChainClient } from "../types";
import { NetworkType, inferNetworkType } from "./networkTypeUtils";
import { getSDKForNetworkType } from "./meshInstanceManager";

type FetchFn = (url: string, options?: RequestInit, context?: Record<string, unknown>) => Promise<Response>;

/**
 * Cache for custom SDK instances with URL overrides.
 * Keyed by network type to maintain cache isolation.
 */
const customSDKCache: Map<NetworkType, CrossChainClient> = new Map();

/**
 * Creates a custom GraphQL Mesh SDK with URL overrides for multi-chain queries.
 * Falls back to default URLs if no override is provided for a specific chain.
 *
 * This function maintains network-type isolation: separate SDK instances
 * are created for mainnet and testnet to prevent cache pollution.
 *
 * @param urlOverrides - Optional map of chain names to custom subgraph URLs
 * @param networkType - The network type to use. If not provided, defaults to 'mainnet'.
 */
export async function getCustomGraphSDK(
  urlOverrides?: Partial<Record<ChainName, string>>,
  networkType: NetworkType = "mainnet",
): Promise<CrossChainClient> {
  // If no URL overrides, use the standard isolated SDK
  if (!urlOverrides || Object.keys(urlOverrides).length === 0) {
    return getSDKForNetworkType(networkType);
  }

  // For custom URL overrides, we need to create a custom mesh instance
  // We cache these by network type as well
  const cacheKey = networkType;

  // Note: This simple caching doesn't account for different urlOverrides combinations.
  // If the same app uses different override configs, consider adding urlOverrides to the cache key.
  // For now, we assume urlOverrides are consistent per app instance.
  const cachedClient = customSDKCache.get(cacheKey);
  if (cachedClient) {
    return cachedClient;
  }

  const meshOptions = await getMeshOptions();

  const originalFetch = meshOptions.fetchFn as FetchFn;

  meshOptions.fetchFn = async (url: string, options?: RequestInit, context?: Record<string, unknown>) => {
    // Sort chain names by length (longest first) to avoid prefix matching issues
    // e.g., "verax-v2-linea-sepolia" should match before "verax-v2-linea"
    const sortedOverrides = Object.entries(urlOverrides).sort(([a], [b]) => b.length - a.length);

    for (const [chainName, customUrl] of sortedOverrides) {
      if (url.includes(chainName)) {
        return originalFetch(customUrl, options, context);
      }
    }

    return originalFetch(url, options, context);
  };

  const mesh = await getMesh(meshOptions);
  const globalContext = {};
  const sdkRequester = mesh.sdkRequesterFactory(globalContext);

  const client = getSdk((...args) => sdkRequester(...args)) as unknown as CrossChainClient;
  customSDKCache.set(cacheKey, client);

  return client;
}

/**
 * Gets a custom SDK for the given chain names, automatically inferring the network type.
 * Convenience method that combines getCustomGraphSDK with network type inference.
 *
 * @param chainNames - Array of chain names to query
 * @param urlOverrides - Optional map of chain names to custom subgraph URLs
 * @throws Error if chain names mix mainnet and testnet
 */
export async function getCustomGraphSDKForChains(
  chainNames: (ChainName | string)[],
  urlOverrides?: Partial<Record<ChainName, string>>,
): Promise<CrossChainClient> {
  const networkType = inferNetworkType(chainNames);
  return getCustomGraphSDK(urlOverrides, networkType);
}

/**
 * Clears the custom SDK cache for a specific network type or all types.
 */
export function clearCustomSDKCache(networkType?: NetworkType): void {
  if (networkType) {
    customSDKCache.delete(networkType);
  } else {
    customSDKCache.clear();
  }
}
