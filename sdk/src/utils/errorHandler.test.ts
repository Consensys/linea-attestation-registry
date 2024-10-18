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

    it("should throw a generic error message if errorName is undefined", () => {
      // Temporarily cast mockRevertedError.data to bypass TypeScript checks for testing
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockRevertedError.data as any).errorName = undefined; // Simulate errorName being `undefined`

      jest.spyOn(mockBaseError, "walk").mockImplementation((fn: (arg0: unknown) => unknown) => {
        return fn(mockRevertedError) ? mockRevertedError : null;
      });

      // This should test the code path where `errorName` is `undefined` and fallback to an empty string
      expect(() => handleError(actionType, mockBaseError)).toThrow(`${actionType} failed with `);
    });

    it("should throw a generic error message if it's an instance of BaseError but not ContractFunctionRevertedError", () => {
      const mockBaseError = new BaseError("Base error");

      jest.spyOn(mockBaseError, "walk").mockImplementation(() => null);

      expect(() => handleError(actionType, mockBaseError)).toThrow("${type} failed");
    });

    it("should throw a generic error message if error is not an instance of BaseError", () => {
      const genericError = "Something went wrong";

      expect(() => handleError(actionType, genericError)).toThrow(`${actionType} failed with ${genericError}`);
    });

    it("should throw a generic error message even when there is no errorName in ContractFunctionRevertedError", () => {
      jest.spyOn(mockBaseError, "walk").mockImplementation((fn: (arg0: unknown) => unknown) => {
        return fn(mockRevertedError) ? mockRevertedError : null;
      });

      expect(() => handleError(actionType, mockBaseError)).toThrow(`${actionType} failed with `);
    });
  });
});
