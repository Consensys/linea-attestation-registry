import { linea, lineaSepolia, arbitrum, base } from "viem/chains";
import { getSubgraphUrlForChain, getConfiguredSubgraphUrl } from "./urlResolver";
import { ChainName, Conf } from "../types";
import { SDKMode } from "./constants";

describe("urlResolver", () => {
  const mockBaseConf: Conf = {
    chain: linea,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://custom-linea-url.com/graphql",
    portalRegistryAddress: "0x1",
    moduleRegistryAddress: "0x2",
    schemaRegistryAddress: "0x3",
    attestationRegistryAddress: "0x4",
  };

  describe("getSubgraphUrlForChain", () => {
    it("should return override URL when provided", () => {
      const conf: Conf = {
        ...mockBaseConf,
        subgraphUrlOverrides: {
          [ChainName.LINEA_MAINNET]: "https://override-linea.com/graphql",
        },
      };

      const url = getSubgraphUrlForChain(ChainName.LINEA_MAINNET, conf);
      expect(url).toBe("https://override-linea.com/graphql");
    });

    it("should fallback to subgraphUrl for the configured chain", () => {
      const conf: Conf = {
        ...mockBaseConf,
        chain: linea,
        subgraphUrl: "https://custom-linea-url.com/graphql",
      };

      const url = getSubgraphUrlForChain(ChainName.LINEA_MAINNET, conf);
      expect(url).toBe("https://custom-linea-url.com/graphql");
    });

    it("should fallback to default URL when no override or subgraphUrl matches", () => {
      const conf: Conf = {
        ...mockBaseConf,
        chain: linea, // Configured for Linea
        subgraphUrl: "https://custom-linea-url.com/graphql",
      };

      // Request for a different chain - should use default
      const url = getSubgraphUrlForChain(ChainName.ARBITRUM_MAINNET, conf);
      expect(url).toBe("https://api.studio.thegraph.com/query/67521/verax-v2-arbitrum/v0.0.2");
    });

    it("should prioritize override over subgraphUrl", () => {
      const conf: Conf = {
        ...mockBaseConf,
        chain: linea,
        subgraphUrl: "https://fallback-url.com/graphql",
        subgraphUrlOverrides: {
          [ChainName.LINEA_MAINNET]: "https://override-url.com/graphql",
        },
      };

      const url = getSubgraphUrlForChain(ChainName.LINEA_MAINNET, conf);
      expect(url).toBe("https://override-url.com/graphql");
    });

    it("should handle partial overrides", () => {
      const conf: Conf = {
        ...mockBaseConf,
        chain: linea,
        subgraphUrl: "https://custom-linea.com/graphql",
        subgraphUrlOverrides: {
          [ChainName.ARBITRUM_MAINNET]: "https://custom-arbitrum.com/graphql",
        },
      };

      // Linea: uses subgraphUrl (configured chain)
      expect(getSubgraphUrlForChain(ChainName.LINEA_MAINNET, conf)).toBe("https://custom-linea.com/graphql");

      // Arbitrum: uses override
      expect(getSubgraphUrlForChain(ChainName.ARBITRUM_MAINNET, conf)).toBe("https://custom-arbitrum.com/graphql");

      // Base: uses default (no override, different chain)
      expect(getSubgraphUrlForChain(ChainName.BASE_MAINNET, conf)).toBe(
        "https://api.studio.thegraph.com/query/67521/verax-v2-base/v0.0.1",
      );
    });
  });

  describe("getConfiguredSubgraphUrl", () => {
    it("should return URL for the configured chain", () => {
      const conf: Conf = {
        ...mockBaseConf,
        chain: linea,
        subgraphUrl: "https://custom-linea.com/graphql",
      };

      const url = getConfiguredSubgraphUrl(conf);
      expect(url).toBe("https://custom-linea.com/graphql");
    });

    it("should use override for the configured chain", () => {
      const conf: Conf = {
        ...mockBaseConf,
        chain: linea,
        subgraphUrl: "https://fallback.com/graphql",
        subgraphUrlOverrides: {
          [ChainName.LINEA_MAINNET]: "https://override.com/graphql",
        },
      };

      const url = getConfiguredSubgraphUrl(conf);
      expect(url).toBe("https://override.com/graphql");
    });

    it("should fallback to default if no subgraphUrl or override", () => {
      const conf: Conf = {
        ...mockBaseConf,
        chain: lineaSepolia,
        subgraphUrl: "", // Empty subgraphUrl
      };

      const url = getConfiguredSubgraphUrl(conf);
      expect(url).toBe("https://api.studio.thegraph.com/query/67521/verax-v2-linea-sepolia/v0.0.2");
    });

    it("should work for different chains", () => {
      const confArbitrum: Conf = {
        ...mockBaseConf,
        chain: arbitrum,
        subgraphUrl: "https://custom-arbitrum.com/graphql",
      };

      const urlArbitrum = getConfiguredSubgraphUrl(confArbitrum);
      expect(urlArbitrum).toBe("https://custom-arbitrum.com/graphql");

      const confBase: Conf = {
        ...mockBaseConf,
        chain: base,
        subgraphUrl: "https://custom-base.com/graphql",
      };

      const urlBase = getConfiguredSubgraphUrl(confBase);
      expect(urlBase).toBe("https://custom-base.com/graphql");
    });
  });
});
