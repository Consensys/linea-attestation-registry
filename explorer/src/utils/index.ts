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
    return `${links[chain.id].address}/address`;
  }
}
