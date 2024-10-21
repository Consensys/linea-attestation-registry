import axios from "axios";
import { stringifyWhereClause, subgraphCall } from "./graphClientHelper";

jest.mock("axios");

describe("graphClientHelper", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  describe("stringifyWhereClause", () => {
    it("should stringify an object and remove double quotes from keys", () => {
      const input = { key1: "value1", key2: 123, key3: true };
      const result = stringifyWhereClause(input);
      expect(result).toBe('{key1:"value1",key2:123,key3:true}');
    });

    it("should handle an empty object", () => {
      const input = {};
      const result = stringifyWhereClause(input);
      expect(result).toBe("{}");
    });

    it("should handle special characters in keys", () => {
      const input = { "key-name": "value" };
      const result = stringifyWhereClause(input);
      expect(result).toBe('{key-name:"value"}');
    });
  });

  describe("subgraphCall", () => {
    const mockUrl = "http://mocked-url.com";
    const mockQuery = "{ mockQuery }";

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

    it("should handle errors from the axios request", async () => {
      const mockError = new Error("Network Error");
      mockedAxios.post.mockRejectedValue(mockError);

      await expect(subgraphCall(mockQuery, mockUrl)).rejects.toThrow("Network Error");
    });
  });
});
