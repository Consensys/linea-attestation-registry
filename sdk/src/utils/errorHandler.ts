import { BaseError, ContractFunctionRevertedError } from "viem";
import { ActionType } from "./constants";

function extractErrorName(revertError: ContractFunctionRevertedError): string {
  if (revertError.data?.errorName) {
    return revertError.data.errorName;
  }
  if (revertError.signature) {
    return revertError.signature;
  }
  return "unknown revert reason";
}

export function handleError(type: ActionType, err: unknown): never {
  if (err instanceof BaseError) {
    const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = extractErrorName(revertError);
      throw new Error(`${type} failed with ${errorName}`);
    } else {
      const shortMessage = err.shortMessage ?? "an unknown error occurred";
      throw new Error(`${type} failed with ${shortMessage}`);
    }
  } else if (err instanceof Error) {
    throw new Error(`${type} failed with ${err.message}`);
  } else {
    throw new Error(`${type} failed with an unknown error`);
  }
}
