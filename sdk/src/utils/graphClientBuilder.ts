import { getMeshOptions, getSdk } from "../../.graphclient";
import { getMesh } from "@graphql-mesh/runtime";
import { ChainName, CrossChainClient } from "../types";

type FetchFn = (url: string, options?: RequestInit, context?: Record<string, unknown>) => Promise<Response>;

/**
 * Creates a custom GraphQL Mesh SDK with URL overrides for multi-chain queries.
 * Falls back to default URLs if no override is provided for a specific chain.
 */
export async function getCustomGraphSDK(urlOverrides?: Partial<Record<ChainName, string>>): Promise<CrossChainClient> {
  const meshOptions = await getMeshOptions();

  if (urlOverrides && Object.keys(urlOverrides).length > 0) {
    const originalFetch = meshOptions.fetchFn as FetchFn;

    meshOptions.fetchFn = async (url: string, options?: RequestInit, context?: Record<string, unknown>) => {
      // Check if we should override the URL based on chain name in the URL
      for (const [chainName, customUrl] of Object.entries(urlOverrides)) {
        if (url.includes(chainName)) {
          return originalFetch(customUrl, options, context);
        }
      }

      // No override found, use the original URL
      return originalFetch(url, options, context);
    };
  }

  const mesh = await getMesh(meshOptions);
  const globalContext = {};
  const sdkRequester = mesh.sdkRequesterFactory(globalContext);

  // Wrap the requester with getSdk to get the typed methods
  return getSdk((...args) => sdkRequester(...args)) as unknown as CrossChainClient;
}
