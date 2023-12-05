import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { Chain, switchNetwork } from "@wagmi/core";
import { FC, PropsWithChildren, useCallback, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { useAccount, useNetwork } from "wagmi";

import { defaultChain } from "@/config";
import { INetwork } from "@/interfaces/config";
import { SWRKeys } from "@/interfaces/swr/enum";

import { NetworkContext } from "./context";

export const NetworkContextProvider: FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate } = useSWRConfig();

  const { isConnected } = useAccount();
  const { chain: currentChain } = useNetwork();
  const retrievedNetwork = useLoaderData() as INetwork;

  const [network, setNetwork] = useState<INetwork>(retrievedNetwork);
  const [sdk, setSdk] = useState<VeraxSdk>(new VeraxSdk(defaultChain.veraxEnv));

  const updateContractData = () => {
    mutate(SWRKeys.GET_ATTESTATION_BY_ID);
    mutate(SWRKeys.GET_RELATED_ATTESTATION);
    mutate(SWRKeys.GET_SCHEMA_BY_ID);
  };

  const switchUserNetwork = useCallback(
    async (pendingChain: Chain, currentChainId?: number) => {
      if (!isConnected || currentChainId === pendingChain.id) {
        return true;
      }

      try {
        await switchNetwork({ chainId: pendingChain.id });
        return true;
      } catch (error) {
        console.error(`Error: while switching network: ${pendingChain.name} \n\n`, error);
        return false;
      }
    },
    [isConnected],
  );

  const setNetworkHandler = async (params: INetwork) => {
    const isSuccess = await switchUserNetwork(params.chain, currentChain?.id);
    if (!isSuccess) return;

    const path = location.pathname.replace(network.network, params.network);
    navigate(path);
    setSdk(new VeraxSdk(params.veraxEnv));
    updateContractData();
    setNetwork(params);
  };

  return (
    <NetworkContext.Provider
      value={{
        sdk,
        network,
        setNetwork: setNetworkHandler,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
