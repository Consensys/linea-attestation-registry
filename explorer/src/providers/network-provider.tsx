import { INetwork, defaultChain } from '@/config';
import VeraxSdk from '@verax-attestation-registry/verax-sdk';
import React, { PropsWithChildren, createContext, useContext, useState } from 'react';

interface IContextState {
  sdk: VeraxSdk;
  network: INetwork;
  setNetwork: (params: INetwork) => void;
  // setNetwork: Dispatch<SetStateAction<INetwork>>;
}

const initialContextState: IContextState = {
  sdk: new VeraxSdk(defaultChain.veraxEnv),
  network: defaultChain,
  setNetwork: () => undefined,
};

const NetworkContext = createContext<IContextState>(initialContextState);

export function useNetworkContext() {
  return useContext(NetworkContext);
}

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
