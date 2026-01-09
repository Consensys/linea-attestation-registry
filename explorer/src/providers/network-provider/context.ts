import { ChainName, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { createContext, useContext } from "react";

import { chains, defaultChain } from "@/config";
import { NetworkType } from "@/contexts/NetworkContext";
import { INetwork } from "@/interfaces/config";
import { NetworkContextState } from "@/interfaces/provider";
import { mainnets, testnets } from "@/utils";
import { NetworkResolver } from "@/utils/networkResolver";

const sdkInstances: Record<string, VeraxSdk> = {};

sdkInstances[defaultChain.network] = new VeraxSdk(defaultChain.veraxEnv);

export const getFilteredChains = (networkType: NetworkType): INetwork[] => {
  if (networkType === "mainnet") {
    return chains.filter((chain) => mainnets.includes(chain.subgraphName));
  } else {
    return chains.filter((chain) => testnets.includes(chain.subgraphName));
  }
};

export const getSDKForChain = (chainName: ChainName, networkType?: NetworkType): VeraxSdk => {
  if (networkType) {
    const isMainnet = mainnets.includes(chainName);
    const isTestnet = testnets.includes(chainName);

    if ((networkType === "mainnet" && !isMainnet) || (networkType === "testnet" && !isTestnet)) {
      throw new Error(`Cannot use ${chainName} with network type ${networkType}`);
    }
  }

  const network = chains.find((chain) => {
    switch (chainName) {
      case ChainName.ARBITRUM_MAINNET:
        return chain.name === "Arbitrum";
      case ChainName.BASE_MAINNET:
        return chain.name === "Base";
      case ChainName.BSC_MAINNET:
        return chain.name === "BSC";
      case ChainName.LINEA_MAINNET:
        return chain.name === "Linea";
      case ChainName.ARBITRUM_SEPOLIA:
        return chain.name === "Arbitrum Sepolia";
      case ChainName.BASE_SEPOLIA:
        return chain.name === "Base Sepolia";
      case ChainName.BSC_TESTNET:
        return chain.name === "BSC Testnet";
      case ChainName.LINEA_SEPOLIA:
        return chain.name === "Linea Sepolia";
      default:
        return false;
    }
  });

  if (!network) {
    throw new Error(`Network configuration not found for chain ${chainName}`);
  }

  return getSDKForNetwork(network);
};

export const getSDKForNetwork = (network: INetwork): VeraxSdk => {
  if (!sdkInstances[network.network]) {
    sdkInstances[network.network] = new VeraxSdk(network.veraxEnv);
  }
  return sdkInstances[network.network];
};

export const getSDKForAttestationId = (id: string, networkType?: NetworkType): VeraxSdk | null => {
  try {
    const networkName = NetworkResolver.getNetworkFromAttestationId(id, networkType);
    const networkConfig = NetworkResolver.getChainFromNetwork(networkName);

    return getSDKForNetwork(networkConfig);
  } catch (_error) {
    return null;
  }
};

export const initialContextState: NetworkContextState = {
  sdk: sdkInstances[defaultChain.network],
  getSDKForChain,
  getSDKForNetwork,
  getSDKForAttestationId,
  getFilteredChains,
};

export const NetworkContext = createContext<NetworkContextState>(initialContextState);
export const useNetworkContext = () => useContext(NetworkContext);
