import { OffchainDataMapper } from "./OffchainDataMapper";
import { create } from "ipfs-http-client";
import { JSONSchema7 as JSONSchema } from "json-schema";

jest.mock("ipfs-http-client");

describe("OffchainDataMapper", () => {
  let mapper: OffchainDataMapper;

  beforeEach(() => {
    mapper = new OffchainDataMapper({
      timeout: 1000,
      maxRetries: 2,
      retryDelay: 100,
    });
    jest.clearAllMocks();
  });

  describe("uploadToIpfs", () => {
    it("should successfully upload string data to IPFS", async () => {
      const mockAdd = jest.fn().mockResolvedValue({ path: "mockHash" });
      (create as jest.Mock).mockReturnValue({ add: mockAdd });

      const result = await mapper.uploadToIpfs("test data");
      expect(result).toBe("ipfs://mockHash");
      expect(mockAdd).toHaveBeenCalledWith("test data", expect.any(Object));
    });

    it("should handle timeouts", async () => {
      const mockAdd = jest.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => {
              const error = new Error("Operation aborted");
              error.name = "AbortError";
              reject(error);
            }, 2000);
          }),
      );
      (create as jest.Mock).mockReturnValue({ add: mockAdd });

      await expect(mapper.uploadToIpfs("test data")).rejects.toThrow("IPFS upload timeout");
    }, 10000);

    it("should retry on temporary failures", async () => {
      const mockAdd = jest
        .fn()
        .mockRejectedValueOnce(new Error("Temporary error"))
        .mockResolvedValueOnce({ path: "mockHash" });
      (create as jest.Mock).mockReturnValue({ add: mockAdd });

      const result = await mapper.uploadToIpfs("test data");
      expect(result).toBe("ipfs://mockHash");
      expect(mockAdd).toHaveBeenCalledTimes(2);
    });

    it("should bail on permanent failures", async () => {
      const mockAdd = jest.fn().mockRejectedValue(new Error("Invalid credentials"));
      (create as jest.Mock).mockReturnValue({ add: mockAdd });

      await expect(mapper.uploadToIpfs("test data")).rejects.toThrow("Invalid credentials");
      expect(mockAdd).toHaveBeenCalledTimes(1);
    });
  });

  describe("validateOffchainSchema", () => {
    it("should validate schema correctly", () => {
      expect(mapper.validateOffchainSchema("mockId", { type: "object", properties: {} })).toBe(true);
      expect(() => mapper.validateOffchainSchema("", undefined as unknown as JSONSchema)).toThrow(
        "Schema ID and schema are required",
      );
    });
  });

  describe("validateOffchainPayload", () => {
    it("should validate payload correctly", () => {
      expect(mapper.validateOffchainPayload({ data: "test" })).toBe(true);
      expect(() => mapper.validateOffchainPayload(null)).toThrow("Payload is required and must be a non-empty object");
      expect(() => mapper.validateOffchainPayload({})).toThrow("Payload is required and must be a non-empty object");
      expect(() => mapper.validateOffchainPayload([])).toThrow("Payload is required and must be a non-empty object");
      expect(() => mapper.validateOffchainPayload("string")).toThrow(
        "Payload is required and must be a non-empty object",
      );
    });
  });
});
