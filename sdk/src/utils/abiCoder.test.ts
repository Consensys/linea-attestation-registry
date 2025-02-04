import { encode, decode, decodeWithRetry } from "./abiCoder";
import { encodeAbiParameters, decodeAbiParameters, parseAbiParameters } from "viem";

// Mock viem functions
jest.mock("viem", () => ({
  encodeAbiParameters: jest.fn(),
  decodeAbiParameters: jest.fn(),
  parseAbiParameters: jest.fn(),
}));

// Mocking the BaseError as it's not a constructible error
const BaseErrorMock = class extends Error {
  shortMessage: string;
  constructor(message: string) {
    super(message);
    this.shortMessage = message;
  }
};

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

  describe("tryParse", () => {
    it("should reverse the schema when it starts with parentheses", () => {
      const schema = "(uint256 address)";
      const reversedSchema = "(address uint256)";
      const attestationData = "0xabc123";
      const mockDecodedData = ["0xaddress", 123];

      const error = new BaseErrorMock("Invalid ABI parameter.");

      // Mock `parseAbiParameters` to throw an error first, then succeed after schema reversal
      (parseAbiParameters as jest.Mock)
        .mockImplementationOnce(() => {
          throw error; // First attempt with the original schema throws an error
        })
        .mockReturnValueOnce([reversedSchema]); // Second attempt with reversed schema

      (decodeAbiParameters as jest.Mock).mockReturnValue(mockDecodedData);

      const result = decodeWithRetry(schema, attestationData);

      // Check if the schema was parsed correctly and reversed after failure
      expect(parseAbiParameters).toHaveBeenNthCalledWith(1, "(uint256 address)");
      expect(parseAbiParameters).toHaveBeenNthCalledWith(2, "(address uint256)");
      expect(decodeAbiParameters).toHaveBeenCalledWith([reversedSchema], attestationData);
      expect(result).toBe(mockDecodedData);
    });

    it("should reverse the schema when it does not start with parentheses", () => {
      const schema = "uint256 address";
      const reversedSchema = "address uint256";
      const attestationData = "0xabc123";
      const mockDecodedData = ["0xaddress", 123];

      const error = new BaseErrorMock("Invalid ABI parameter.");

      // Since the schema is automatically wrapped with parentheses, we need to adjust the expectation
      (parseAbiParameters as jest.Mock)
        .mockImplementationOnce(() => {
          throw error; // First attempt with the wrapped schema
        })
        .mockReturnValueOnce([reversedSchema]); // Second attempt after reversing

      (decodeAbiParameters as jest.Mock).mockReturnValue(mockDecodedData);

      const result = decodeWithRetry(schema, attestationData);

      // Expect the wrapped schema on the first call
      expect(parseAbiParameters).toHaveBeenNthCalledWith(1, "(uint256 address)");
      // Expect the reversed schema on the second call
      expect(parseAbiParameters).toHaveBeenNthCalledWith(2, "(address uint256)");
      expect(decodeAbiParameters).toHaveBeenCalledWith([reversedSchema], attestationData);
      expect(result).toBe(mockDecodedData);
    });

    it("should return empty array if reverse schema also fails", () => {
      const schema = "uint256 address";
      const attestationData = "0xabc123";

      const error = new BaseErrorMock("Invalid ABI parameter.");

      (parseAbiParameters as jest.Mock).mockImplementation(() => {
        throw error; // throws an error
      });
      (decodeAbiParameters as jest.Mock).mockReturnValue([]);

      const result = decodeWithRetry(schema, attestationData);

      expect(parseAbiParameters).toHaveBeenCalledTimes(4);
      expect(result).toEqual([]);
    });

    it("should return empty array if decodeAbiParameters fails", () => {
      const schema = "(uint256)";
      const attestationData = "0xabc123";

      (parseAbiParameters as jest.Mock).mockReturnValue([schema]);

      const error = new BaseErrorMock("Some error");
      (decodeAbiParameters as jest.Mock).mockImplementation(() => {
        throw error; // throws an error
      });

      const result = decodeWithRetry(schema, attestationData);

      expect(parseAbiParameters).toHaveBeenCalledWith(schema);
      expect(decodeAbiParameters).toHaveBeenCalledWith([schema], attestationData);
      expect(parseAbiParameters).toHaveBeenCalledTimes(2);
      expect(result).toEqual([]);
    });

    it("should return empty array on BaseError without 'Invalid ABI parameter.' message", () => {
      const schema = "uint256 address";
      const attestationData = "0xabc123";

      const error = new BaseErrorMock("Some other message");

      (parseAbiParameters as jest.Mock).mockImplementationOnce(() => {
        throw error; // throws an error
      });
      (decodeAbiParameters as jest.Mock).mockReturnValue([]);

      const result = decodeWithRetry(schema, attestationData);

      expect(parseAbiParameters).toHaveBeenNthCalledWith(1, `(${schema})`);
      expect(decodeAbiParameters).toHaveBeenCalledWith([], attestationData);
      expect(result).toStrictEqual([]);
    });
  });
});
