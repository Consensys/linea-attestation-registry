import { createContext, useContext } from "react";

import { NetworkName } from "@/interfaces/config";

export type NetworkType = "mainnet" | "testnet";

export interface NetworkContextType {
  currentNetwork: NetworkName;
  setCurrentNetwork: (network: NetworkName) => void;
  resolveEntityNetwork: (entityId: string | null | undefined) => NetworkName | null;
  networkType: NetworkType;
  setNetworkType: (type: NetworkType) => void;
}

export const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);

  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }

  return context;
};
