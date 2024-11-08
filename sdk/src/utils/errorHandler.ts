import { BaseError, ContractFunctionRevertedError } from "viem";
import { ActionType } from "./constants";

function getErrorMessage(type: ActionType, err: BaseError): string {
  const revertError = err.walk((e) => e instanceof ContractFunctionRevertedError);
  if (revertError instanceof ContractFunctionRevertedError) {
    const errorName = revertError.data?.errorName || revertError.signature || "unknown revert reason";
    return `${type} failed: ${errorName}`;
  }
  return `${type} failed: ${err.shortMessage || "An unknown error occurred"}`;
}

export function handleError(type: ActionType, err: unknown): never {
  if (err instanceof BaseError) {
    throw new Error(getErrorMessage(type, err));
  } else if (err instanceof Error) {
    throw new Error(`${type} failed: ${err.message}`);
  } else {
    throw new Error(`${type} failed: An unknown error occurred`);
  }
}
