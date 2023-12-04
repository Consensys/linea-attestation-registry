import { Conf } from "@verax-attestation-registry/verax-sdk";
import { Chain } from "wagmi";

export interface INetwork {
  name: string;
  chain: Chain;
  veraxEnv: Conf;
  img: string;
  network: string;
}
