import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { Chain, switchNetwork } from "@wagmi/core";
import { FC, PropsWithChildren, useCallback, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useAccount, useNetwork } from "wagmi";

import { INetwork } from "@/interfaces/config";

import { NetworkContext } from "./context";

export const NetworkContextProvider: FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isConnected } = useAccount();
  const { chain: currentChain } = useNetwork();
  const retrievedNetwork = useLoaderData() as INetwork;

  const [network, setNetwork] = useState<INetwork>(retrievedNetwork);
  const [sdk, setSdk] = useState<VeraxSdk>(new VeraxSdk(network.veraxEnv));

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
    navigate(path, { state: { from: location.pathname } });
    setSdk(new VeraxSdk(params.veraxEnv));
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
