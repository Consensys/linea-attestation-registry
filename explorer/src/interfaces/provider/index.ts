import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

import { INetwork } from "../config";

export interface NetworkContextState {
  sdk: VeraxSdk;
  network: INetwork;
  setNetwork: (params: INetwork) => void;
}
