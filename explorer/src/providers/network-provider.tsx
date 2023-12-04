import React, { PropsWithChildren, createContext, useState } from "react";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { INetwork, defaultChain } from "@/config";

interface IContextState {
  sdk: VeraxSdk;
  network: INetwork;
  setNetwork: (params: INetwork) => void;
}

const initialContextState: IContextState = {
  sdk: new VeraxSdk(defaultChain.veraxEnv),
  network: defaultChain,
  setNetwork: () => undefined,
};

export const NetworkContext = createContext<IContextState>(initialContextState);

export const NetworkContextProvider: React.FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const [network, setNetwork] = useState<INetwork>(defaultChain);
  const [sdk, setSdk] = useState<VeraxSdk>(new VeraxSdk(defaultChain.veraxEnv));

  const setNetworkHandler = (params: INetwork) => {
    setSdk(new VeraxSdk(params.veraxEnv));
    return setNetwork(params);
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
