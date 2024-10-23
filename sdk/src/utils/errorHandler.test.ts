import { BaseError, ContractFunctionRevertedError, Abi } from "viem";
import { handleError } from "./errorHandler";
import { ActionType } from "./constants";

describe("errorHandler", () => {
  const mockAbi: Abi = [
    {
      name: "myFunction",
      type: "function",
      inputs: [{ name: "param1", type: "uint256" }],
      outputs: [{ name: "", type: "bool" }],
      stateMutability: "nonpayable",
    },
  ];

  const mockBaseError = new BaseError("Base error");
  const mockRevertedError = new ContractFunctionRevertedError({
    abi: mockAbi,
    functionName: "myFunction",
    data: "0x1234",
  });

  mockRevertedError.data = {
    errorName: "MockErrorName",
    abiItem: mockAbi[0],
    args: [42],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleError", () => {
    const actionType: ActionType = ActionType.Transaction;

    it("should throw with the revert error name if error is a ContractFunctionRevertedError", () => {
      jest.spyOn(mockBaseError, "walk").mockImplementation((fn: (arg0: unknown) => unknown) => {
        return fn(mockRevertedError) ? mockRevertedError : null;
      });

      expect(() => handleError(actionType, mockBaseError)).toThrow(`${actionType} failed with MockErrorName`);
    });

    it("should throw with the revert signature if errorName is undefined", () => {
      (mockRevertedError.data as Partial<typeof mockRevertedError.data>).errorName = undefined;
      mockRevertedError.signature = "myFunction(uint256)" as `0x${string}`;

      jest.spyOn(mockBaseError, "walk").mockImplementation((fn: (arg0: unknown) => unknown) => {
        return fn(mockRevertedError) ? mockRevertedError : null;
      });

      expect(() => handleError(actionType, mockBaseError)).toThrow(`${actionType} failed with myFunction(uint256)`);
    });

    it("should throw 'unknown revert reason' if both errorName and signature are undefined", () => {
      (mockRevertedError.data as Partial<typeof mockRevertedError.data>).errorName = undefined;
      mockRevertedError.signature = undefined;

      jest.spyOn(mockBaseError, "walk").mockImplementation((fn: (arg0: unknown) => unknown) => {
        return fn(mockRevertedError) ? mockRevertedError : null;
      });

      expect(() => handleError(actionType, mockBaseError)).toThrow(`${actionType} failed with unknown revert reason`);
    });

    it("should throw with shortMessage if error is a BaseError but not ContractFunctionRevertedError", () => {
      const shortMessage = "A short message";
      const mockBaseErrorWithShortMessage = new BaseError("Base error");
      mockBaseErrorWithShortMessage.shortMessage = shortMessage;

      jest.spyOn(mockBaseErrorWithShortMessage, "walk").mockImplementation(() => null);

      expect(() => handleError(actionType, mockBaseErrorWithShortMessage)).toThrow(
        `${actionType} failed with ${shortMessage}`,
      );
    });

    it("should throw 'An unknown error occurred' if no shortMessage is present", () => {
      const mockBaseErrorWithoutShortMessage = new BaseError("Base error");

      jest.spyOn(mockBaseErrorWithoutShortMessage, "walk").mockImplementation(() => null);

      expect(() => handleError(actionType, mockBaseErrorWithoutShortMessage)).toThrow(
        `${actionType} failed with An unknown error occurred`,
      );
    });

    it("should throw with the error message if error is a native JavaScript Error", () => {
      const nativeError = new Error("Native error message");

      expect(() => handleError(actionType, nativeError)).toThrow(`${actionType} failed with Native error message`);
    });

    it("should throw 'unknown error' if the error is not an instance of BaseError or Error", () => {
      const unknownError = { message: "Some unknown error" }; // Simulate an unexpected error type

      expect(() => handleError(actionType, unknownError)).toThrow(`${actionType} failed with an unknown error`);
    });
  });
});
