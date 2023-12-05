import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { createContext, useContext } from "react";

import { defaultChain } from "@/config";
import { NetworkContextState } from "@/interfaces/provider";

const initialContextState: NetworkContextState = {
  sdk: new VeraxSdk(defaultChain.veraxEnv),
  network: defaultChain,
  setNetwork: () => undefined,
};

export const NetworkContext = createContext<NetworkContextState>(initialContextState);
export const useNetworkContext = () => useContext(NetworkContext);
