import { createContext, useContext } from "react";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

import { defaultChain } from "@/config";
import { NetworkContextState } from "@/interfaces/provider";

const initialContextState: NetworkContextState = {
  sdk: new VeraxSdk(defaultChain.veraxEnv),
  network: defaultChain,
};

export const NetworkContext = createContext<NetworkContextState>(initialContextState);
export const useNetworkContext = () => useContext(NetworkContext);
