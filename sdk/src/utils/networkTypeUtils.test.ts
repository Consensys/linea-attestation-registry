import { ChainName } from "../types";
import { isTestnetChain, getNetworkTypeForChain, inferNetworkType, validateNetworkType } from "./networkTypeUtils";

describe("networkTypeUtils", () => {
  describe("isTestnetChain", () => {
    it("should return true for chains containing 'sepolia'", () => {
      expect(isTestnetChain("verax-v2-linea-sepolia")).toBe(true);
      expect(isTestnetChain("verax-v2-arbitrum-sepolia")).toBe(true);
      expect(isTestnetChain("verax-v2-base-sepolia")).toBe(true);
    });

    it("should return true for chains containing 'testnet'", () => {
      expect(isTestnetChain("verax-v2-bsc-testnet")).toBe(true);
    });

    it("should return false for mainnet chains", () => {
      expect(isTestnetChain("verax-v2-linea")).toBe(false);
      expect(isTestnetChain("verax-v2-arbitrum")).toBe(false);
      expect(isTestnetChain("verax-v2-base")).toBe(false);
      expect(isTestnetChain("verax-v2-bsc")).toBe(false);
    });

    it("should be case insensitive", () => {
      expect(isTestnetChain("VERAX-V2-LINEA-SEPOLIA")).toBe(true);
      expect(isTestnetChain("Verax-V2-BSC-Testnet")).toBe(true);
    });
  });

  describe("getNetworkTypeForChain", () => {
    it("should return 'mainnet' for mainnet ChainName enum values", () => {
      expect(getNetworkTypeForChain(ChainName.LINEA_MAINNET)).toBe("mainnet");
      expect(getNetworkTypeForChain(ChainName.ARBITRUM_MAINNET)).toBe("mainnet");
      expect(getNetworkTypeForChain(ChainName.BASE_MAINNET)).toBe("mainnet");
      expect(getNetworkTypeForChain(ChainName.BSC_MAINNET)).toBe("mainnet");
    });

    it("should return 'testnet' for testnet ChainName enum values", () => {
      expect(getNetworkTypeForChain(ChainName.LINEA_SEPOLIA)).toBe("testnet");
      expect(getNetworkTypeForChain(ChainName.ARBITRUM_SEPOLIA)).toBe("testnet");
      expect(getNetworkTypeForChain(ChainName.BASE_SEPOLIA)).toBe("testnet");
      expect(getNetworkTypeForChain(ChainName.BSC_TESTNET)).toBe("testnet");
    });

    it("should handle raw subgraph names via pattern matching", () => {
      expect(getNetworkTypeForChain("custom-mainnet-chain")).toBe("mainnet");
      expect(getNetworkTypeForChain("custom-sepolia-chain")).toBe("testnet");
      expect(getNetworkTypeForChain("custom-testnet-chain")).toBe("testnet");
    });
  });

  describe("inferNetworkType", () => {
    it("should return 'mainnet' for empty array", () => {
      expect(inferNetworkType([])).toBe("mainnet");
    });

    it("should return 'mainnet' for all mainnet chains", () => {
      const mainnets = [ChainName.LINEA_MAINNET, ChainName.ARBITRUM_MAINNET, ChainName.BASE_MAINNET];
      expect(inferNetworkType(mainnets)).toBe("mainnet");
    });

    it("should return 'testnet' for all testnet chains", () => {
      const testnets = [ChainName.LINEA_SEPOLIA, ChainName.ARBITRUM_SEPOLIA, ChainName.BASE_SEPOLIA];
      expect(inferNetworkType(testnets)).toBe("testnet");
    });

    it("should throw error when mixing mainnet and testnet chains", () => {
      const mixed = [ChainName.LINEA_MAINNET, ChainName.LINEA_SEPOLIA];
      expect(() => inferNetworkType(mixed)).toThrow("Cannot mix mainnet and testnet chains");
    });

    it("should work with single chain", () => {
      expect(inferNetworkType([ChainName.LINEA_MAINNET])).toBe("mainnet");
      expect(inferNetworkType([ChainName.LINEA_SEPOLIA])).toBe("testnet");
    });

    it("should work with raw subgraph names", () => {
      expect(inferNetworkType(["verax-v2-linea", "verax-v2-arbitrum"])).toBe("mainnet");
      expect(inferNetworkType(["verax-v2-linea-sepolia", "verax-v2-arbitrum-sepolia"])).toBe("testnet");
    });
  });

  describe("validateNetworkType", () => {
    it("should not throw for valid mainnet chains", () => {
      const mainnets = [ChainName.LINEA_MAINNET, ChainName.ARBITRUM_MAINNET];
      expect(() => validateNetworkType(mainnets, "mainnet")).not.toThrow();
    });

    it("should not throw for valid testnet chains", () => {
      const testnets = [ChainName.LINEA_SEPOLIA, ChainName.ARBITRUM_SEPOLIA];
      expect(() => validateNetworkType(testnets, "testnet")).not.toThrow();
    });

    it("should throw when mainnet chain is used with testnet type", () => {
      const mainnets = [ChainName.LINEA_MAINNET];
      expect(() => validateNetworkType(mainnets, "testnet")).toThrow(
        'do not match the expected network type "testnet"',
      );
    });

    it("should throw when testnet chain is used with mainnet type", () => {
      const testnets = [ChainName.LINEA_SEPOLIA];
      expect(() => validateNetworkType(testnets, "mainnet")).toThrow(
        'do not match the expected network type "mainnet"',
      );
    });

    it("should list all invalid chains in error message", () => {
      const mixed = [ChainName.LINEA_MAINNET, ChainName.ARBITRUM_MAINNET];
      expect(() => validateNetworkType(mixed, "testnet")).toThrow(ChainName.LINEA_MAINNET);
      expect(() => validateNetworkType(mixed, "testnet")).toThrow(ChainName.ARBITRUM_MAINNET);
    });
  });
});
