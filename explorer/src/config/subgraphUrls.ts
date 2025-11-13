import { ChainName } from "@verax-attestation-registry/verax-sdk";

const theGraphApiKey = import.meta.env.VITE_THE_GRAPH_API_KEY;

export const SUBGRAPH_URL_OVERRIDES: Partial<Record<ChainName, string>> = {
  [ChainName.LINEA_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/subgraphs/id/ESRDQ5djmucKeqxNz7JGVHr621sjGEEsY6M6JibjJ9u3`,
  [ChainName.LINEA_SEPOLIA]: `https://gateway.thegraph.com/api/${theGraphApiKey}/subgraphs/id/2gfRmZ1e1uJKpCQsUrvxJmRivNa7dvvuULoc8SJabR8v`,
  [ChainName.ARBITRUM_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/subgraphs/id/ELQZyXzGu5MVA6kMCpMh5zNqdU8gqhtynM9yVRQ4bZoA`,
  [ChainName.ARBITRUM_SEPOLIA]: `https://gateway.thegraph.com/api/${theGraphApiKey}/subgraphs/id/5RBJNNUvaoekU2yJsbmEZ1R62Mo3imWy7nMgNj97ZG8u`,
  [ChainName.BASE_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/subgraphs/id/fje2qXNP7KeRBZDPFv1VCERchv9PZyZokPRWNZkWtXk`,
  [ChainName.BASE_SEPOLIA]: `https://gateway.thegraph.com/api/${theGraphApiKey}/subgraphs/id/EbruygUvdowo7dmsumFmRq2hRu81K88mWsLo5r3jxY3S`,
  [ChainName.BSC_MAINNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/subgraphs/id/8VfLNCBXCFKkcfmRSLDZ6J36NG5rRCUzEgByRJXCzSoW`,
  [ChainName.BSC_TESTNET]: `https://gateway.thegraph.com/api/${theGraphApiKey}/subgraphs/id/6iFYkMd9xbQcEcddHs6vbTMarra7d2NUt9S1qtNmWtaV`,
};

export const getSubgraphUrlOverrides = (): Partial<Record<ChainName, string>> | undefined => {
  return theGraphApiKey ? SUBGRAPH_URL_OVERRIDES : undefined;
};
