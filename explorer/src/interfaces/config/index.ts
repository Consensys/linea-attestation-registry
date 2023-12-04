import { Chain } from "wagmi";
import { Conf } from "@verax-attestation-registry/verax-sdk";

export interface INetwork {
  name: string;
  chain: Chain;
  veraxEnv: Conf;
  img: string;
  network: string;
}
