import { getSDKForNetworkType, getSDKForChains, clearMeshCache, getMeshCacheStatus } from "./meshInstanceManager";
import { getMeshOptions, getSdk } from "../../.graphclient";
import { getMesh } from "@graphql-mesh/runtime";
import { ChainName } from "../types";

// Mock the GraphQL Mesh functions
jest.mock("../../.graphclient", () => ({
  getMeshOptions: jest.fn(),
  getSdk: jest.fn(),
}));

jest.mock("@graphql-mesh/runtime", () => ({
  getMesh: jest.fn(),
}));

describe("meshInstanceManager", () => {
  let mockFetch: jest.Mock;
  let mockMeshOptions: Awaited<ReturnType<typeof getMeshOptions>>;
  let mockMesh: Awaited<ReturnType<typeof getMesh>>;
  let mockPubsub: { subscribe: jest.Mock; unsubscribe: jest.Mock };

  beforeEach(async () => {
    jest.clearAllMocks();
    // Clear all cached instances before each test
    await clearMeshCache();

    // Create mock fetch function
    mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: {} }),
    });

    // Create mock mesh options
    mockMeshOptions = {
      fetchFn: mockFetch,
      sources: [],
      transforms: [],
    } as unknown as Awaited<ReturnType<typeof getMeshOptions>>;

    // Create mock pubsub
    mockPubsub = {
      subscribe: jest.fn().mockReturnValue("sub-id"),
      unsubscribe: jest.fn(),
    };

    // Create mock SDK methods
    const mockSDK = {
      MultichainAttestationsQuery: jest.fn(),
      MultichainPortalsQuery: jest.fn(),
      MultichainSchemasQuery: jest.fn(),
      MultichainModulesQuery: jest.fn(),
    };

    // Create mock mesh instance with pubsub
    mockMesh = {
      sdkRequesterFactory: jest.fn().mockReturnValue(jest.fn()),
      pubsub: mockPubsub,
      destroy: jest.fn(),
    } as unknown as Awaited<ReturnType<typeof getMesh>>;

    (getMeshOptions as jest.Mock).mockResolvedValue(mockMeshOptions);
    (getMesh as jest.Mock).mockResolvedValue(mockMesh);
    (getSdk as jest.Mock).mockReturnValue(mockSDK);
  });

  describe("getSDKForNetworkType", () => {
    it("should create SDK for mainnet", async () => {
      const sdk = await getSDKForNetworkType("mainnet");

      expect(getMeshOptions).toHaveBeenCalled();
      expect(getMesh).toHaveBeenCalled();
      expect(sdk).toBeDefined();
      expect(sdk.MultichainAttestationsQuery).toBeDefined();
    });

    it("should create SDK for testnet", async () => {
      const sdk = await getSDKForNetworkType("testnet");

      expect(getMeshOptions).toHaveBeenCalled();
      expect(getMesh).toHaveBeenCalled();
      expect(sdk).toBeDefined();
    });

    it("should cache SDK instances per network type", async () => {
      // First call creates instance
      await getSDKForNetworkType("mainnet");
      const firstCallCount = (getMesh as jest.Mock).mock.calls.length;

      // Second call should use cached instance
      await getSDKForNetworkType("mainnet");
      expect((getMesh as jest.Mock).mock.calls.length).toBe(firstCallCount);
    });

    it("should create separate instances for mainnet and testnet", async () => {
      await getSDKForNetworkType("mainnet");
      const firstCallCount = (getMesh as jest.Mock).mock.calls.length;

      await getSDKForNetworkType("testnet");
      expect((getMesh as jest.Mock).mock.calls.length).toBe(firstCallCount + 1);
    });

    it("should subscribe to destroy events", async () => {
      await getSDKForNetworkType("mainnet");
      expect(mockPubsub.subscribe).toHaveBeenCalledWith("destroy", expect.any(Function));
    });
  });

  describe("getSDKForChains", () => {
    it("should return mainnet SDK for mainnet chains", async () => {
      const sdk = await getSDKForChains([ChainName.LINEA_MAINNET, ChainName.ARBITRUM_MAINNET]);

      expect(sdk).toBeDefined();
      expect(getMesh).toHaveBeenCalled();
    });

    it("should return testnet SDK for testnet chains", async () => {
      const sdk = await getSDKForChains([ChainName.LINEA_SEPOLIA, ChainName.ARBITRUM_SEPOLIA]);

      expect(sdk).toBeDefined();
      expect(getMesh).toHaveBeenCalled();
    });

    it("should throw error for mixed mainnet and testnet chains", async () => {
      await expect(getSDKForChains([ChainName.LINEA_MAINNET, ChainName.LINEA_SEPOLIA])).rejects.toThrow(
        "Cannot mix mainnet and testnet chains",
      );
    });
  });

  describe("clearMeshCache", () => {
    it("should clear specific network type cache", async () => {
      // Create both instances
      await getSDKForNetworkType("mainnet");
      await getSDKForNetworkType("testnet");

      // Clear only mainnet
      await clearMeshCache("mainnet");

      // Verify mainnet was destroyed
      expect(mockMesh.destroy).toHaveBeenCalled();
    });

    it("should clear all caches when no network type specified", async () => {
      // Create both instances
      await getSDKForNetworkType("mainnet");
      await getSDKForNetworkType("testnet");

      const destroyCallsBefore = (mockMesh.destroy as jest.Mock).mock.calls.length;

      // Clear all
      await clearMeshCache();

      // Both should be destroyed
      expect((mockMesh.destroy as jest.Mock).mock.calls.length).toBeGreaterThan(destroyCallsBefore);
    });
  });

  describe("getMeshCacheStatus", () => {
    it("should return false for both when no instances exist", async () => {
      const status = getMeshCacheStatus();
      expect(status.mainnet).toBe(false);
      expect(status.testnet).toBe(false);
    });

    it("should return true for mainnet when mainnet instance exists", async () => {
      await getSDKForNetworkType("mainnet");
      const status = getMeshCacheStatus();
      expect(status.mainnet).toBe(true);
      expect(status.testnet).toBe(false);
    });

    it("should return true for both when both instances exist", async () => {
      await getSDKForNetworkType("mainnet");
      await getSDKForNetworkType("testnet");
      const status = getMeshCacheStatus();
      expect(status.mainnet).toBe(true);
      expect(status.testnet).toBe(true);
    });
  });
});
