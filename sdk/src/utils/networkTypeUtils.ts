import { ChainName } from "../types";

/**
 * Network type discriminator for cache isolation.
 * Mainnet and testnet use separate GraphQL Mesh instances to prevent cache pollution.
 */
export type NetworkType = "mainnet" | "testnet";

/**
 * Testnet chain name patterns for network type inference.
 */
const TESTNET_PATTERNS = ["sepolia", "testnet"] as const;

/**
 * Mapping of ChainName enum values to their network types.
 */
const CHAIN_NETWORK_TYPES: Record<ChainName, NetworkType> = {
  [ChainName.LINEA_MAINNET]: "mainnet",
  [ChainName.ARBITRUM_MAINNET]: "mainnet",
  [ChainName.BASE_MAINNET]: "mainnet",
  [ChainName.BSC_MAINNET]: "mainnet",
  [ChainName.LINEA_SEPOLIA]: "testnet",
  [ChainName.ARBITRUM_SEPOLIA]: "testnet",
  [ChainName.BASE_SEPOLIA]: "testnet",
  [ChainName.BSC_TESTNET]: "testnet",
};

/**
 * Determines if a chain name string represents a testnet.
 * Works with both ChainName enum values and raw subgraph names.
 */
export function isTestnetChain(chainName: string): boolean {
  const lowerName = chainName.toLowerCase();
  return TESTNET_PATTERNS.some((pattern) => lowerName.includes(pattern));
}

/**
 * Gets the network type for a single chain name.
 */
export function getNetworkTypeForChain(chainName: ChainName | string): NetworkType {
  // First check if it's a known ChainName enum value
  if (chainName in CHAIN_NETWORK_TYPES) {
    return CHAIN_NETWORK_TYPES[chainName as ChainName];
  }

  // Fall back to pattern matching for raw subgraph names
  return isTestnetChain(chainName) ? "testnet" : "mainnet";
}

/**
 * Infers the network type from an array of chain names.
 * All chains must belong to the same network type (mainnet or testnet).
 *
 * @throws Error if chain names mix mainnet and testnet
 */
export function inferNetworkType(chainNames: (ChainName | string)[]): NetworkType {
  if (chainNames.length === 0) {
    return "mainnet"; // Default to mainnet for empty array
  }

  const networkTypes = new Set(chainNames.map(getNetworkTypeForChain));

  if (networkTypes.size > 1) {
    throw new Error(
      `Cannot mix mainnet and testnet chains in the same query. ` +
        `Received: ${chainNames.join(", ")}. ` +
        `Please query mainnet and testnet chains separately.`,
    );
  }

  return networkTypes.values().next().value as NetworkType;
}

/**
 * Validates that all chain names belong to the expected network type.
 *
 * @throws Error if any chain doesn't match the expected network type
 */
export function validateNetworkType(chainNames: (ChainName | string)[], expectedType: NetworkType): void {
  const invalidChains = chainNames.filter((chain) => getNetworkTypeForChain(chain) !== expectedType);

  if (invalidChains.length > 0) {
    throw new Error(
      `The following chains do not match the expected network type "${expectedType}": ` + `${invalidChains.join(", ")}`,
    );
  }
}
