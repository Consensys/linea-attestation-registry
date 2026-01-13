/**
 * Mesh Instance Manager
 *
 * Manages isolated GraphQL Mesh instances per network type (mainnet/testnet).
 * This prevents cache pollution when switching between mainnet and testnet queries
 * in the same browser session.
 *
 * The core problem: GraphQL Mesh uses a singleton pattern with a shared cache.
 * Cache keys are based on query hash + variables, but don't include context.chainName.
 * When querying mainnet chains then testnet chains with identical query structures,
 * the cache returns stale mainnet data.
 *
 * Solution: Maintain separate Mesh instances with isolated caches per network type.
 */

import { getMesh, MeshInstance } from "@graphql-mesh/runtime";
import { getMeshOptions, getSdk } from "../../.graphclient";
import { ChainName, CrossChainClient } from "../types";
import { NetworkType, inferNetworkType } from "./networkTypeUtils";

/**
 * Cache of Mesh instances keyed by network type.
 * Each network type gets its own isolated instance with separate cache.
 */
const meshInstances: Map<NetworkType, Promise<MeshInstance>> = new Map();

/**
 * Cache of SDK clients keyed by network type.
 */
const sdkClients: Map<NetworkType, CrossChainClient> = new Map();

/**
 * Creates a new Mesh instance with an isolated cache for the specified network type.
 *
 * We achieve cache isolation by creating completely separate Mesh instances.
 * Each instance has its own cache, pubsub, and logger.
 */
async function createMeshInstance(networkType: NetworkType): Promise<MeshInstance> {
  const meshOptions = await getMeshOptions();

  // Create a new mesh instance
  // The cache will be unique to this instance since we're creating a fresh getMesh call
  const mesh = await getMesh(meshOptions);

  // Subscribe to destroy events to clean up our cache
  const id = mesh.pubsub.subscribe("destroy", () => {
    meshInstances.delete(networkType);
    sdkClients.delete(networkType);
    mesh.pubsub.unsubscribe(id);
  });

  return mesh;
}

/**
 * Gets or creates a Mesh instance for the specified network type.
 * Instances are lazily created on first use and cached for reuse.
 */
export function getMeshInstanceForNetworkType(networkType: NetworkType): Promise<MeshInstance> {
  let instance = meshInstances.get(networkType);

  if (!instance) {
    instance = createMeshInstance(networkType);
    meshInstances.set(networkType, instance);
  }

  return instance;
}

/**
 * Gets or creates an SDK client for the specified network type.
 * This is the main entry point for cross-chain queries.
 */
export async function getSDKForNetworkType(networkType: NetworkType): Promise<CrossChainClient> {
  let client = sdkClients.get(networkType);

  if (!client) {
    const mesh = await getMeshInstanceForNetworkType(networkType);
    const globalContext = {};
    const sdkRequester = mesh.sdkRequesterFactory(globalContext);
    client = getSdk((...args) => sdkRequester(...args)) as unknown as CrossChainClient;
    sdkClients.set(networkType, client);
  }

  return client;
}

/**
 * Gets an SDK client for the given chain names.
 * Automatically infers the network type from the chain names.
 *
 * @throws Error if chain names mix mainnet and testnet
 */
export async function getSDKForChains(chainNames: (ChainName | string)[]): Promise<CrossChainClient> {
  const networkType = inferNetworkType(chainNames);
  return getSDKForNetworkType(networkType);
}

/**
 * Clears cached Mesh instances and SDK clients.
 * Use this to force fresh instances on next query.
 *
 * @param networkType - If provided, only clears cache for that network type.
 *                      If omitted, clears all cached instances.
 */
export async function clearMeshCache(networkType?: NetworkType): Promise<void> {
  if (networkType) {
    const instance = meshInstances.get(networkType);
    if (instance) {
      const mesh = await instance;
      mesh.destroy();
    }
    meshInstances.delete(networkType);
    sdkClients.delete(networkType);
  } else {
    // Clear all
    for (const [type, instancePromise] of meshInstances.entries()) {
      const mesh = await instancePromise;
      mesh.destroy();
      meshInstances.delete(type);
      sdkClients.delete(type);
    }
  }
}

/**
 * Gets the current state of cached instances (for debugging).
 */
export function getMeshCacheStatus(): { mainnet: boolean; testnet: boolean } {
  return {
    mainnet: meshInstances.has("mainnet"),
    testnet: meshInstances.has("testnet"),
  };
}
