import axios from "axios";
import { subgraphCall } from "./graphClientHelper";

jest.mock("axios");

describe("graphClientHelper", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  describe("subgraphCall", () => {
    const mockUrl = "http://mocked-url.com";
    const mockQuery = "{ mockQuery }";
    const mockVariables = { id: "1" };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should make a POST request with the correct headers", async () => {
      const mockResponse = { data: { someData: "testData" } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await subgraphCall(mockQuery, mockUrl);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        mockUrl,
        { query: mockQuery },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      expect(result).toBe(mockResponse);
    });

    it("should include variables when provided", async () => {
      const mockResponse = { data: { someData: "testData" } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await subgraphCall(mockQuery, mockUrl, mockVariables);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        mockUrl,
        { query: mockQuery, variables: mockVariables },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      expect(result).toBe(mockResponse);
    });

    it("should handle errors from the axios request", async () => {
      const mockError = new Error("Network Error");
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(subgraphCall(mockQuery, mockUrl)).rejects.toThrow("Network Error");
    });
  });
});
