import { Chain } from "viem";

export default interface Conf {
  chain: Chain;
  subgraphUrl: string;
  portalRegistryAddress: string;
  moduleRegistryAddress: string;
  schemaRegistryAddress: string;
  attestationRegistryAddress: string;
}
