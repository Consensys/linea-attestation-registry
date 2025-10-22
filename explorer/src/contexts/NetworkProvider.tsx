import { ChainName } from "@verax-attestation-registry/verax-sdk";
import { FC, PropsWithChildren, useEffect, useState } from "react";

import { chains, defaultChain } from "@/config";
import { NetworkContext, NetworkContextType, NetworkType } from "@/contexts/NetworkContext";
import { NetworkName } from "@/interfaces/config";
import { mainnets, testnets } from "@/utils";
import { NetworkResolver } from "@/utils/networkResolver";

const NETWORK_TYPE_STORAGE_KEY = "verax-network-type";

const getNetworkNamesFromChainNames = (chainNames: ChainName[]): NetworkName[] => {
  return chainNames.map((chainName) => {
    const network = chains.find((chain) => chain.subgraphName === chainName);
    return network ? network.network : defaultChain.network;
  });
};

const mainnetNetworks = getNetworkNamesFromChainNames(mainnets);
const testnetNetworks = getNetworkNamesFromChainNames(testnets);

export const NetworkProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentNetwork, setCurrentNetwork] = useState<NetworkName>(defaultChain.network as NetworkName);
  const [networkType, setNetworkType] = useState<NetworkType>(() => {
    const storedType = localStorage.getItem(NETWORK_TYPE_STORAGE_KEY);
    return (storedType === "testnet" ? "testnet" : "mainnet") as NetworkType;
  });

  useEffect(() => {
    localStorage.setItem(NETWORK_TYPE_STORAGE_KEY, networkType);
  }, [networkType]);

  useEffect(() => {
    const isCurrentNetworkMainnet = mainnetNetworks.includes(currentNetwork);
    const isCurrentNetworkTestnet = testnetNetworks.includes(currentNetwork);

    if (networkType === "mainnet" && !isCurrentNetworkMainnet && mainnetNetworks.length > 0) {
      setCurrentNetwork(mainnetNetworks[0]);
    } else if (networkType === "testnet" && !isCurrentNetworkTestnet && testnetNetworks.length > 0) {
      setCurrentNetwork(testnetNetworks[0]);
    }
  }, [networkType, currentNetwork]);

  const resolveEntityNetwork = (entityId: string | null | undefined): NetworkName | null => {
    if (!entityId) return null;

    try {
      return NetworkResolver.getNetworkFromAttestationId(entityId);
    } catch (error) {
      return null;
    }
  };

  const contextValue: NetworkContextType = {
    currentNetwork,
    setCurrentNetwork,
    resolveEntityNetwork,
    networkType,
    setNetworkType,
  };

  return <NetworkContext.Provider value={contextValue}>{children}</NetworkContext.Provider>;
};
