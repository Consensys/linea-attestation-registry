import { encode, decode, decodeWithRetry } from "./abiCoder";
import { encodeAbiParameters, decodeAbiParameters, parseAbiParameters } from "viem";

jest.mock("viem", () => ({
  encodeAbiParameters: jest.fn(),
  decodeAbiParameters: jest.fn(),
  parseAbiParameters: jest.fn(),
}));

describe("abiCoder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("encode", () => {
    it("should encode the values with the given schema", () => {
      const schema = "uint256";
      const values = [123];
      const mockEncodedData = "0xabc123";

      (parseAbiParameters as jest.Mock).mockReturnValue([schema]);
      (encodeAbiParameters as jest.Mock).mockReturnValue(mockEncodedData);

      const result = encode(schema, values);

      expect(parseAbiParameters).toHaveBeenCalledWith(schema);
      expect(encodeAbiParameters).toHaveBeenCalledWith([schema], values);
      expect(result).toBe(mockEncodedData);
    });
  });

  describe("decode", () => {
    it("should decode attestation data with the given schema", () => {
      const schema = "uint256";
      const attestationData = "0xabc123";
      const mockDecodedData = [123];

      (parseAbiParameters as jest.Mock).mockReturnValue([schema]);
      (decodeAbiParameters as jest.Mock).mockReturnValue(mockDecodedData);

      const result = decode(schema, attestationData);

      expect(parseAbiParameters).toHaveBeenCalledWith(schema);
      expect(decodeAbiParameters).toHaveBeenCalledWith([schema], attestationData);
      expect(result).toBe(mockDecodedData);
    });
  });

  describe("decodeWithRetry", () => {
    it("should decode successfully without retry", () => {
      const schema = "(uint256)";
      const attestationData = "0xabc123";
      const mockDecodedData = [123];

      (parseAbiParameters as jest.Mock).mockReturnValue([schema]);
      (decodeAbiParameters as jest.Mock).mockReturnValue(mockDecodedData);

      const result = decodeWithRetry(schema, attestationData);

      expect(parseAbiParameters).toHaveBeenCalledWith(schema);
      expect(decodeAbiParameters).toHaveBeenCalledWith([schema], attestationData);
      expect(result).toBe(mockDecodedData);
    });

    it("should retry with prefixed encoded parenthesis if no result initially", () => {
      const schema = "uint256";
      const attestationData = "0xdef456";
      const mockEmptyDecodedData: readonly unknown[] = [];
      const mockDecodedDataAfterRetry = [456];

      (parseAbiParameters as jest.Mock).mockReturnValue([schema]);
      (decodeAbiParameters as jest.Mock)
        .mockReturnValueOnce(mockEmptyDecodedData) // First try returns empty array
        .mockReturnValueOnce(mockDecodedDataAfterRetry); // Retry returns valid data

      const result = decodeWithRetry(schema, attestationData);

      expect(parseAbiParameters).toHaveBeenCalledWith(`(${schema})`);
      expect(decodeAbiParameters).toHaveBeenNthCalledWith(1, [schema], attestationData);
      expect(decodeAbiParameters).toHaveBeenNthCalledWith(
        2,
        [schema],
        `0x0000000000000000000000000000000000000000000000000000000000000020${attestationData.substring(2)}`,
      );
      expect(result).toBe(mockDecodedDataAfterRetry);
    });

    it("should return empty array if both attempts fail", () => {
      const schema = "uint256";
      const attestationData = "0xdef456";
      const mockEmptyDecodedData: readonly unknown[] = [];

      (parseAbiParameters as jest.Mock).mockReturnValue([schema]);
      (decodeAbiParameters as jest.Mock).mockReturnValue(mockEmptyDecodedData);

      const result = decodeWithRetry(schema, attestationData);

      expect(result).toEqual([]);
    });
  });
});
