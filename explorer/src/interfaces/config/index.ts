import { Conf } from "@verax-attestation-registry/verax-sdk";
import { Chain, Hex } from "viem";

export interface INetwork {
  name: string;
  chain: Chain;
  veraxEnv: Conf;
  img: JSX.Element;
  imgDark?: JSX.Element;
  network: string;
  prefix: Hex;
}
