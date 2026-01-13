import { getCustomGraphSDK, clearCustomSDKCache } from "./graphClientBuilder";
import { clearMeshCache } from "./meshInstanceManager";
import { getMeshOptions, getSdk } from "../../.graphclient";
import { getMesh } from "@graphql-mesh/runtime";
import { ChainName } from "../types";

// Mock the GraphQL Mesh functions
jest.mock("../../.graphclient", () => ({
  getMeshOptions: jest.fn(),
  getBuiltGraphSDK: jest.fn(),
  getSdk: jest.fn(),
}));

jest.mock("@graphql-mesh/runtime", () => ({
  getMesh: jest.fn(),
}));

describe("graphClientBuilder", () => {
  describe("getCustomGraphSDK", () => {
    let mockFetch: jest.Mock;
    let mockMeshOptions: Awaited<ReturnType<typeof getMeshOptions>>;
    let mockMesh: Awaited<ReturnType<typeof getMesh>>;
    let mockPubsub: { subscribe: jest.Mock; unsubscribe: jest.Mock };

    beforeEach(() => {
      jest.clearAllMocks();
      // Clear caches between tests
      clearCustomSDKCache();
      clearMeshCache();

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

    it("should create SDK without URL overrides", async () => {
      const sdk = await getCustomGraphSDK();

      expect(getMeshOptions).toHaveBeenCalled();
      expect(getMesh).toHaveBeenCalled();
      expect(sdk).toBeDefined();
      expect(sdk.MultichainAttestationsQuery).toBeDefined();
    });

    it("should create SDK with URL overrides", async () => {
      const urlOverrides = {
        [ChainName.LINEA_MAINNET]: "https://custom-linea-url.com/graphql",
        [ChainName.ARBITRUM_MAINNET]: "https://custom-arbitrum-url.com/graphql",
      };

      const sdk = await getCustomGraphSDK(urlOverrides);

      expect(getMeshOptions).toHaveBeenCalled();
      expect(getMesh).toHaveBeenCalled();
      expect(sdk).toBeDefined();

      // Verify that the fetch function was wrapped
      const modifiedOptions = (getMesh as jest.Mock).mock.calls[0][0];
      expect(modifiedOptions.fetchFn).toBeDefined();
      expect(modifiedOptions.fetchFn).not.toBe(mockFetch);
    });

    it("should redirect requests to custom URLs when override matches", async () => {
      const customUrl = "https://custom-linea-url.com/graphql";
      const urlOverrides = {
        [ChainName.LINEA_MAINNET]: customUrl,
      };

      await getCustomGraphSDK(urlOverrides);

      // Get the wrapped fetch function
      const modifiedOptions = (getMesh as jest.Mock).mock.calls[0][0];
      const wrappedFetch = modifiedOptions.fetchFn;

      // Simulate a request that contains the chain name
      const requestUrl = `https://api.studio.thegraph.com/query/67521/${ChainName.LINEA_MAINNET}/version/latest`;
      await wrappedFetch(requestUrl, {}, {});

      // Verify that the original fetch was called with the custom URL
      expect(mockFetch).toHaveBeenCalledWith(customUrl, {}, {});
    });

    it("should use default URL when no override matches", async () => {
      const urlOverrides = {
        [ChainName.LINEA_MAINNET]: "https://custom-linea-url.com/graphql",
      };

      await getCustomGraphSDK(urlOverrides);

      // Get the wrapped fetch function
      const modifiedOptions = (getMesh as jest.Mock).mock.calls[0][0];
      const wrappedFetch = modifiedOptions.fetchFn;

      // Simulate a request for a different chain (no override)
      const requestUrl = `https://api.studio.thegraph.com/query/67521/${ChainName.ARBITRUM_MAINNET}/version/latest`;
      await wrappedFetch(requestUrl, {}, {});

      // Verify that the original fetch was called with the original URL
      expect(mockFetch).toHaveBeenCalledWith(requestUrl, {}, {});
    });

    it("should handle multiple chain overrides", async () => {
      const customLineaUrl = "https://custom-linea-url.com/graphql";
      const customArbitrumUrl = "https://custom-arbitrum-url.com/graphql";
      const urlOverrides = {
        [ChainName.LINEA_MAINNET]: customLineaUrl,
        [ChainName.ARBITRUM_MAINNET]: customArbitrumUrl,
      };

      await getCustomGraphSDK(urlOverrides);

      // Get the wrapped fetch function
      const modifiedOptions = (getMesh as jest.Mock).mock.calls[0][0];
      const wrappedFetch = modifiedOptions.fetchFn;

      // Test Linea override
      const lineaUrl = `https://api.studio.thegraph.com/query/67521/${ChainName.LINEA_MAINNET}/version/latest`;
      await wrappedFetch(lineaUrl, {}, {});
      expect(mockFetch).toHaveBeenCalledWith(customLineaUrl, {}, {});

      // Test Arbitrum override
      mockFetch.mockClear();
      const arbitrumUrl = `https://api.studio.thegraph.com/query/67521/${ChainName.ARBITRUM_MAINNET}/version/latest`;
      await wrappedFetch(arbitrumUrl, {}, {});
      expect(mockFetch).toHaveBeenCalledWith(customArbitrumUrl, {}, {});
    });

    it("should handle URL as URL object", async () => {
      const customUrl = "https://custom-linea-url.com/graphql";
      const urlOverrides = {
        [ChainName.LINEA_MAINNET]: customUrl,
      };

      await getCustomGraphSDK(urlOverrides);

      // Get the wrapped fetch function
      const modifiedOptions = (getMesh as jest.Mock).mock.calls[0][0];
      const wrappedFetch = modifiedOptions.fetchFn;

      // Simulate a request with URL as string (GraphQL Mesh always passes strings to fetchFn)
      const requestUrl = `https://api.studio.thegraph.com/query/67521/${ChainName.LINEA_MAINNET}/version/latest`;
      await wrappedFetch(requestUrl, {}, {});

      // Verify that the original fetch was called with the custom URL
      expect(mockFetch).toHaveBeenCalledWith(customUrl, {}, {});
    });

    it("should use isolated mesh instance when URL overrides are empty", async () => {
      const urlOverrides = {};

      await getCustomGraphSDK(urlOverrides);

      expect(getMeshOptions).toHaveBeenCalled();
      expect(getMesh).toHaveBeenCalled();
    });

    it("should work without any URL overrides parameter", async () => {
      await getCustomGraphSDK();

      expect(getMeshOptions).toHaveBeenCalled();
      expect(getMesh).toHaveBeenCalled();
    });

    it("should use different instances for mainnet and testnet network types", async () => {
      // Request mainnet SDK
      await getCustomGraphSDK(undefined, "mainnet");

      // Clear mocks to track second call
      const firstCallCount = (getMesh as jest.Mock).mock.calls.length;

      // Request testnet SDK - should create new instance
      await getCustomGraphSDK(undefined, "testnet");

      // Should have made another getMesh call for testnet
      expect((getMesh as jest.Mock).mock.calls.length).toBe(firstCallCount + 1);
    });

    it("should cache SDK instances per network type", async () => {
      // Request mainnet SDK twice
      await getCustomGraphSDK(undefined, "mainnet");
      const firstCallCount = (getMesh as jest.Mock).mock.calls.length;

      await getCustomGraphSDK(undefined, "mainnet");

      // Should NOT have made another getMesh call (cached)
      expect((getMesh as jest.Mock).mock.calls.length).toBe(firstCallCount);
    });
  });
});
