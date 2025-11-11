import { getCustomGraphSDK } from "./graphClientBuilder";
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

    beforeEach(() => {
      jest.clearAllMocks();

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

      // Create mock SDK methods
      const mockSDK = {
        MultichainAttestationsQuery: jest.fn(),
        MultichainPortalsQuery: jest.fn(),
        MultichainSchemasQuery: jest.fn(),
        MultichainModulesQuery: jest.fn(),
      };

      // Create mock mesh instance
      mockMesh = {
        sdkRequesterFactory: jest.fn().mockReturnValue(jest.fn()),
      } as unknown as Awaited<ReturnType<typeof getMesh>>;

      (getMeshOptions as jest.Mock).mockResolvedValue(mockMeshOptions);
      (getMesh as jest.Mock).mockResolvedValue(mockMesh);
      (getSdk as jest.Mock).mockReturnValue(mockSDK);
    });

    it("should create SDK without URL overrides", async () => {
      const sdk = await getCustomGraphSDK();

      expect(getMeshOptions).toHaveBeenCalled();
      expect(getMesh).toHaveBeenCalledWith(mockMeshOptions);
      expect(mockMesh.sdkRequesterFactory).toHaveBeenCalled();
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

    it("should not wrap fetchFn when URL overrides are empty", async () => {
      const urlOverrides = {};

      await getCustomGraphSDK(urlOverrides);

      expect(getMeshOptions).toHaveBeenCalled();
      expect(getMesh).toHaveBeenCalled();

      // Verify that fetchFn was NOT wrapped when overrides are empty
      const modifiedOptions = (getMesh as jest.Mock).mock.calls[0][0];
      expect(modifiedOptions.fetchFn).toBe(mockFetch);
    });

    it("should work without any URL overrides parameter", async () => {
      await getCustomGraphSDK();

      expect(getMeshOptions).toHaveBeenCalled();
      expect(getMesh).toHaveBeenCalled();

      // Verify that fetchFn was NOT wrapped when no overrides provided
      const modifiedOptions = (getMesh as jest.Mock).mock.calls[0][0];
      expect(modifiedOptions.fetchFn).toBe(mockFetch);
    });
  });
});
