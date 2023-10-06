import { Chain } from "viem";

export interface Conf {
  chain: Chain;
  subgraphUrl: string;
  portalRegistryAddress: `0x${string}`;
  moduleRegistryAddress: `0x${string}`;
  schemaRegistryAddress: `0x${string}`;
  attestationRegistryAddress: `0x${string}`;
}
