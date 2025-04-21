import { ChainName } from "@verax-attestation-registry/verax-sdk";

import { chains } from "@/config";
import { NetworkType } from "@/contexts/NetworkContext.ts";
import { INetwork, NetworkName } from "@/interfaces/config";

export class NetworkResolverError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkResolverError";
  }
}

export class NetworkResolver {
  static getNetworkFromAttestationId(attestationId: string, networkType?: NetworkType): NetworkName {
    const prefix = attestationId.substring(0, 6);
    const isMainnet = networkType === "mainnet";
    let matchingChains;

    if (isMainnet) {
      matchingChains = chains.filter((chain) => !chain.chain.testnet);
    } else {
      matchingChains = chains.filter((chain) => chain.chain.testnet);
    }

    const chain = matchingChains.find(
      (chain) => (isMainnet ? !chain.chain.testnet : chain.chain.testnet) && prefix === chain.prefix,
    );

    if (!chain) {
      throw new NetworkResolverError(`No network found for attestation ID: ${attestationId}`);
    }

    return chain.network;
  }

  static getNetworkFromChainName(chainName: ChainName | string): INetwork {
    const chainBySubgraph = chains.find((chain) => chain.subgraphName === chainName);
    if (chainBySubgraph) {
      return chainBySubgraph;
    }

    const directMatch = chains.find((chain) => chain.name === chainName);
    if (directMatch) {
      return directMatch;
    }

    if (typeof chainName === "string") {
      const lowerCaseMatch = chains.find((chain) => chain.name.toLowerCase() === chainName.toLowerCase());
      if (lowerCaseMatch) {
        return lowerCaseMatch;
      }

      const partialMatch = chains.find(
        (chain) =>
          chainName.toLowerCase().includes(chain.name.toLowerCase()) ||
          chain.name.toLowerCase().includes(chainName.toLowerCase()),
      );
      if (partialMatch) {
        return partialMatch;
      }
    }

    throw new NetworkResolverError(`No network found for chain name: ${chainName}`);
  }

  static getChainNameFromNetwork(network: NetworkName): ChainName {
    switch (network) {
      case NetworkName.LINEA:
        return ChainName.LINEA_MAINNET;
      case NetworkName.LINEA_SEPOLIA:
        return ChainName.LINEA_SEPOLIA;
      case NetworkName.ARBITRUM:
        return ChainName.ARBITRUM_MAINNET;
      case NetworkName.ARBITRUM_SEPOLIA:
        return ChainName.ARBITRUM_SEPOLIA;
      case NetworkName.BASE_MAINNET:
        return ChainName.BASE_MAINNET;
      case NetworkName.BASE_SEPOLIA:
        return ChainName.BASE_SEPOLIA;
      case NetworkName.BSC_MAINNET:
        return ChainName.BSC_MAINNET;
      case NetworkName.BSC_TESTNET:
        return ChainName.BSC_TESTNET;
      default:
        throw new NetworkResolverError(`Unrecognized network name: ${network}`);
    }
  }

  static tryParseNetwork(networkStr: string | null | undefined): NetworkName | null {
    if (!networkStr) return null;

    try {
      if (Object.values(NetworkName).includes(networkStr as NetworkName)) {
        return networkStr as NetworkName;
      }

      const networkMatch = chains.find(
        (chain) =>
          chain.network === networkStr ||
          chain.name.toLowerCase() === networkStr.toLowerCase() ||
          networkStr.toLowerCase().includes(chain.name.toLowerCase()),
      );

      return networkMatch ? networkMatch.network : null;
    } catch {
      return null;
    }
  }

  static getChainFromNetwork(network: NetworkName) {
    const chain = chains.find((chain) => chain.network === network);

    if (!chain) {
      throw new NetworkResolverError(`No chain found for network: ${network}`);
    }

    return chain;
  }

  static getNetworkLogoByAttestationId(id: string, isDarkMode: boolean, networkType: NetworkType) {
    const network = this.getNetworkFromAttestationId(id, networkType);
    const chain = this.getChainFromNetwork(network);
    return isDarkMode && chain.imgDark ? chain.imgDark : chain.img;
  }

  static getNetworkLogoByChainName(chainName: ChainName, isDarkMode: boolean) {
    const network = this.getNetworkFromChainName(chainName);
    const chain = this.getChainFromNetwork(network.network);
    return isDarkMode && chain.imgDark ? chain.imgDark : chain.img;
  }

  static getNetworkSlugFromChainName(chainName: ChainName) {
    const network = this.getNetworkFromChainName(chainName);
    const chain = this.getChainFromNetwork(network.network);
    return chain.network;
  }

  static getNetworkNameFromAttestationId(id: string, networkType: NetworkType): string {
    const network = this.getNetworkFromAttestationId(id, networkType);
    const chain = this.getChainFromNetwork(network);
    return chain.name;
  }

  static getNetworkNameFromChainName(chainName: ChainName): string {
    const network = this.getNetworkFromChainName(chainName);
    const chain = this.getChainFromNetwork(network.network);
    return chain.name;
  }
}
