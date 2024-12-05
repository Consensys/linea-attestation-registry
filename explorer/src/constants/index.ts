import { arbitrum, arbitrumSepolia, base, baseSepolia, bsc, bscTestnet, linea } from "wagmi/chains";

import { lineaSepolia } from "@/config";

export const EMPTY_STRING = "";
export const EMPTY_0X_STRING = "0x";
export const SPACE_STRING = " ";
export const COMMA_STRING = ",";
export const DASH = "-";
export const ZERO_STRING = "0";
export const TEN = 10;
export const ZERO = 0;
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;
export const ITEMS_PER_PAGE_DEFAULT = 10;
export const ITEMS_SEARCHED_DEFAULT = 100;
export const CURRENT_PAGE_DEFAULT = 1;
export const THOUSAND = 1e3;
export const BILLION = 1e9;

export const links: Record<number, { trx?: string; address: string }> = {
  [linea.id]: {
    address: "https://lineascan.build/address",
  },
  [lineaSepolia.id]: {
    address: "https://sepolia.lineascan.build/address",
  },
  [arbitrum.id]: {
    address: "https://arbiscan.io/address",
  },
  [arbitrumSepolia.id]: {
    address: "https://sepolia.arbiscan.io/address",
  },
  [base.id]: {
    address: "https://basescan.org/address",
  },
  [baseSepolia.id]: {
    address: "https://sepolia.basescan.org/address",
  },
  [bsc.id]: {
    address: "https://bscscan.com/address",
  },
  [bscTestnet.id]: {
    address: "https://testnet.bscscan.com/address",
  },
};

export const veraxLink = "https://ver.ax";
