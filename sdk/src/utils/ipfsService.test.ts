import { create } from "ipfs-http-client";
import { IPFSService } from "./ipfsService";
import { SchemaDefinition } from "../types";

jest.mock("ipfs-http-client");

describe("IPFSService", () => {
  let service: IPFSService;
  let mockAdd: jest.Mock;

  beforeEach(() => {
    mockAdd = jest.fn();
    (create as jest.Mock).mockReturnValue({
      add: mockAdd,
    });

    service = new IPFSService({
      projectId: "testId",
      projectSecret: "testSecret",
      timeout: 1000,
      maxRetries: 2,
    });
    jest.clearAllMocks();
  });

  describe("uploadToIPFS", () => {
    it("should successfully upload data to IPFS", async () => {
      mockAdd.mockResolvedValue({ path: "mockHash" });

      const result = await service.uploadToIPFS({ data: "test" });
      expect(result).toBe("ipfs://mockHash");
      expect(mockAdd).toHaveBeenCalledWith(JSON.stringify({ data: "test" }));
    });

    it("should handle timeouts", async () => {
      mockAdd.mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("IPFS upload timeout")), 2000);
          }),
      );

      await expect(service.uploadToIPFS("test data")).rejects.toThrow("IPFS upload timeout");
    }, 30000);

    it("should retry on failures", async () => {
      mockAdd.mockRejectedValueOnce(new Error("Temporary error")).mockResolvedValueOnce({ path: "mockHash" });

      const result = await service.uploadToIPFS("test data");
      expect(result).toBe("ipfs://mockHash");
      expect(mockAdd).toHaveBeenCalledTimes(2);
    }, 30000);

    it("should fail after max retries", async () => {
      mockAdd.mockImplementation(() => Promise.reject(new Error("Network error")));

      await expect(service.uploadToIPFS("test data")).rejects.toThrow("Network error");
      expect(mockAdd).toHaveBeenCalledTimes(2); // maxRetries is 2
    }, 30000);
  });

  describe("validateOffchainSchema", () => {
    it("should validate valid schema", () => {
      const validSchema: SchemaDefinition = {
        type: "object",
        title: "Test Schema",
        description: "A test schema for attestations",
        properties: {
          name: { type: "string" },
          age: { type: "integer" },
          isActive: { type: "boolean" },
          metadata: { type: "object", properties: {} },
        },
      };
      expect(service.validateOffchainSchema("mockId", validSchema)).toBe(true);
    });

    it("should throw error for missing schema ID", () => {
      const validSchema: SchemaDefinition = {
        type: "object",
        title: "Test Schema",
        description: "A test schema",
        properties: { test: { type: "string" } },
      };
      expect(() => service.validateOffchainSchema("", validSchema)).toThrow(
        "Schema ID is required and must not be empty",
      );
    });

    it("should throw error for missing schema", () => {
      // @ts-expect-error Testing invalid input
      expect(() => service.validateOffchainSchema("mockId", null)).toThrow("Schema must be a valid JSON Schema object");
    });

    it("should throw error for missing title", () => {
      const invalidSchema: SchemaDefinition = {
        type: "object",
        description: "Missing title",
        properties: { test: { type: "string" } },
      };
      expect(() => service.validateOffchainSchema("mockId", invalidSchema)).toThrow(
        "Schema must have a non-empty title string",
      );
    });

    it("should throw error for missing description", () => {
      const invalidSchema: SchemaDefinition = {
        type: "object",
        title: "Test Schema",
        properties: { test: { type: "string" } },
      };
      expect(() => service.validateOffchainSchema("mockId", invalidSchema)).toThrow(
        "Schema must have a non-empty description string",
      );
    });

    it("should throw error for invalid property type", () => {
      const invalidSchema: SchemaDefinition = {
        type: "object",
        title: "Test Schema",
        description: "Invalid property type",
        properties: {
          test: { type: "invalid" },
        },
      };
      expect(() => service.validateOffchainSchema("mockId", invalidSchema)).toThrow(
        "Property 'test' has unsupported type 'invalid'. Must be one of: string, number, integer, boolean, array, object",
      );
    });
  });

  describe("validateOffchainPayload", () => {
    const validSchema: SchemaDefinition = {
      type: "object",
      title: "Test Schema",
      description: "A test schema",
      properties: {
        name: { type: "string" },
        age: { type: "integer" },
      },
    };

    it("should validate valid payload", () => {
      const payload = { name: "Test", age: 25 };
      expect(service.validateOffchainPayload(payload, validSchema)).toBe(true);
    });

    it("should validate payload without schema", () => {
      expect(service.validateOffchainPayload({ data: "test" })).toBe(true);
    });

    it("should throw error for null payload", () => {
      expect(() => service.validateOffchainPayload(null)).toThrow("Payload must be a non-array object");
    });

    it("should throw error for empty object payload", () => {
      expect(() => service.validateOffchainPayload({})).toThrow("Payload must contain at least one property");
    });

    it("should throw error for array payload", () => {
      expect(() => service.validateOffchainPayload([])).toThrow("Payload must be a non-array object");
    });

    it("should throw error for non-object payload", () => {
      expect(() => service.validateOffchainPayload("string")).toThrow("Payload must be a non-array object");
    });

    it("should throw error for invalid payload against schema", () => {
      const invalidPayload = { name: 123, age: "invalid" };
      expect(() => service.validateOffchainPayload(invalidPayload, validSchema)).toThrow("Payload validation failed");
    });
  });
});
