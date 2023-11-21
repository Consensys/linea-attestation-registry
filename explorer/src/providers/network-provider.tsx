import { INetwork, defaultChain } from '@/config';
import React, { PropsWithChildren, createContext, useContext, useState } from 'react';

interface IContextState {
  network: INetwork;
  setNetwork: (params: INetwork) => void;
  // setNetwork: Dispatch<SetStateAction<INetwork>>;
}

const initialContextState: IContextState = {
  network: defaultChain,
  setNetwork: () => undefined,
};

const NetworkContext = createContext<IContextState>(initialContextState);

export function useNetworkContext() {
  return useContext(NetworkContext);
}

export const NetworkContextProvider: React.FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const [network, setNetwork] = useState<INetwork>(defaultChain);

  const setNetworkHandler = (params: INetwork) => {
    console.log(params);
    return setNetwork(params);
  };

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork: setNetworkHandler,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
