import { ChainName } from "@verax-attestation-registry/verax-sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Chain } from "viem";

import { links } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default cn;

export function isNotNullOrUndefined<T extends object>(input: null | undefined | T): input is T {
  return input !== null && input !== undefined;
}

export function getBlockExplorerLink(chain: Chain) {
  if (chain.blockExplorers) {
    return `${chain.blockExplorers.default.url}/address`;
  } else {
    return `${links[chain.id].address}`;
  }
}

export const mainnets = [
  ChainName.ARBITRUM_MAINNET,
  ChainName.BASE_MAINNET,
  ChainName.BSC_MAINNET,
  ChainName.LINEA_MAINNET,
];
export const testnets = [
  ChainName.ARBITRUM_SEPOLIA,
  ChainName.BASE_SEPOLIA,
  ChainName.BSC_TESTNET,
  ChainName.LINEA_SEPOLIA,
];
export const allChains = [...mainnets, ...testnets];
