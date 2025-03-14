import { IPFSService } from "./ipfsService";
import axios from "axios";

jest.mock("axios");

describe("IPFSService", () => {
  const maxRetries = 2;
  let service: IPFSService;
  let mockAxiosPost: jest.Mock;

  beforeEach(() => {
    mockAxiosPost = jest.fn();
    (axios.create as jest.Mock).mockReturnValue({
      post: mockAxiosPost,
    });

    service = new IPFSService({
      projectId: "testId",
      projectSecret: "testSecret",
      maxRetries,
    });
    jest.clearAllMocks();
  });

  describe("uploadToIPFS", () => {
    it("should successfully upload data to IPFS", async () => {
      mockAxiosPost.mockResolvedValueOnce({ data: { Hash: "mockHash" } });

      const result = await service.uploadToIPFS({ data: "test" });
      expect(result).toBe("ipfs://mockHash");
      expect(mockAxiosPost).toHaveBeenCalledTimes(1);
    });

    it("should handle timeouts", async () => {
      mockAxiosPost.mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("IPFS upload timeout")), 100);
          }),
      );

      await expect(service.uploadToIPFS("test data")).rejects.toThrow("IPFS upload timeout");
    });

    it("should retry on failures", async () => {
      const tempError = new Error("Temporary error");
      tempError.name = "AxiosError";
      mockAxiosPost.mockRejectedValueOnce(tempError).mockResolvedValueOnce({ data: { Hash: "mockHash" } });

      const result = await service.uploadToIPFS("test data");
      expect(result).toBe("ipfs://mockHash");
      expect(mockAxiosPost).toHaveBeenCalledTimes(2);
    });

    it("should fail after max retries", async () => {
      const networkError = new Error("Network error");
      networkError.name = "AxiosError";
      mockAxiosPost.mockRejectedValue(networkError);

      await expect(service.uploadToIPFS("test data")).rejects.toThrow("Network error");
      expect(mockAxiosPost).toHaveBeenCalledTimes(maxRetries);
    });

    it("should handle missing Hash in response", async () => {
      mockAxiosPost.mockResolvedValueOnce({ data: {} });

      await expect(service.uploadToIPFS("test data")).rejects.toThrow("IPFS upload failed: missing Hash");
      expect(mockAxiosPost).toHaveBeenCalledTimes(maxRetries);
    });
  });
});
