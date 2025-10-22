import { ChainName, VeraxSdk } from "@verax-attestation-registry/verax-sdk";

import { NetworkType } from "@/contexts/NetworkContext";
import { INetwork } from "@/interfaces/config";

export interface NetworkContextState {
  sdk: VeraxSdk;
  getSDKForChain: (chainName: ChainName, networkType?: NetworkType) => VeraxSdk;
  getSDKForNetwork: (network: INetwork) => VeraxSdk;
  getSDKForAttestationId: (id: string, networkType?: NetworkType) => VeraxSdk | null;
  getFilteredChains: (networkType: NetworkType) => INetwork[];
}
