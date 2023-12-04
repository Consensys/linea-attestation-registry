import React, { PropsWithChildren, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

import { defaultChain } from "@/config";
import { INetwork } from "@/interfaces/config";

import { NetworkContext } from "./context";

export const NetworkContextProvider: React.FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const retrievedNetwork = useLoaderData() as INetwork;

  const [network] = useState<INetwork>(retrievedNetwork);
  const [sdk] = useState<VeraxSdk>(new VeraxSdk(defaultChain.veraxEnv));

  return (
    <NetworkContext.Provider
      value={{
        sdk,
        network,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
