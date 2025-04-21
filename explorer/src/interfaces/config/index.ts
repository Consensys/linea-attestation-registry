import { ChainName, Conf } from "@verax-attestation-registry/verax-sdk";
import { Chain, Hex } from "viem";

export enum NetworkName {
  LINEA = "linea",
  LINEA_SEPOLIA = "linea-sepolia",
  ARBITRUM = "arbitrum",
  ARBITRUM_SEPOLIA = "arbitrum-sepolia",
  BASE_MAINNET = "base-mainnet",
  BASE_SEPOLIA = "base-sepolia",
  BSC_MAINNET = "bsc-mainnet",
  BSC_TESTNET = "bsc-testnet",
}

export interface INetwork {
  name: string;
  chain: Chain;
  veraxEnv: Conf;
  img: JSX.Element;
  imgDark?: JSX.Element;
  network: NetworkName;
  prefix: Hex;
  subgraphName: ChainName;
}
