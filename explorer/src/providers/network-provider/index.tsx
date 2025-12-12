import { FC, PropsWithChildren, ReactElement, useMemo } from "react";

import { defaultChain } from "@/config";
import { useNetwork } from "@/contexts/NetworkContext";

import { NetworkContext, getFilteredChains, getSDKForAttestationId, getSDKForChain, getSDKForNetwork } from "./context";

export const NetworkContextProvider: FC<PropsWithChildren> = ({ children }): ReactElement => {
  const { networkType } = useNetwork();

  const contextValue = useMemo(() => {
    const filteredChains = getFilteredChains(networkType);
    const defaultNetwork = filteredChains.length > 0 ? filteredChains[0] : defaultChain;
    const sdk = getSDKForNetwork(defaultNetwork);

    return {
      sdk,
      getSDKForChain: (chainName: Parameters<typeof getSDKForChain>[0]) => getSDKForChain(chainName, networkType),
      getSDKForNetwork,
      getSDKForAttestationId: (id: string) => getSDKForAttestationId(id, networkType),
      getFilteredChains,
    };
  }, [networkType]);

  return <NetworkContext.Provider value={contextValue}>{children}</NetworkContext.Provider>;
};
