import { arbitrum, arbitrumGoerli, linea, lineaTestnet } from "wagmi/chains";

export const EMPTY_STRING = "";
export const SPACE_STRING = " ";
export const COMMA_STRING = ",";
export const DASH = "-";
export const ZERO_STRING = "0";
export const TEN = 10;
export const ZERO = 0;
export const ITEMS_PER_PAGE_DEFAULT = 10;
export const CURRENT_PAGE_DEFAULT = 1;
export const THOUSAND = 1e3;
export const BILLION = 1e9;

export const links: Record<number, { trx?: string; address: string }> = {
  [linea.id]: {
    trx: "https://lineascan.build/trx",
    address: "https://lineascan.build/address",
  },
  [lineaTestnet.id]: {
    address: "https://goerli.lineascan.build/address",
  },
  [arbitrum.id]: {
    address: "https://arbiscan.io/address",
  },
  [arbitrumGoerli.id]: {
    address: "https://testnet.arbiscan.io/address",
  },
};

export const veraxLink = "https://ver.ax";
