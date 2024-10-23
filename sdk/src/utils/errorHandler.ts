import { BaseError, ContractFunctionRevertedError } from "viem";
import { ActionType } from "./constants";

export function handleError(type: ActionType, err: unknown): never {
  if (err instanceof BaseError) {
    const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? revertError.signature ?? "unknown revert reason";
      throw new Error(`${type} failed with ${errorName}`);
    } else {
      const shortMessage = err.shortMessage ?? "An unknown error occurred";
      throw new Error(`${type} failed with ${shortMessage}`);
    }
  } else if (err instanceof Error) {
    throw new Error(`${type} failed with ${err.message}`);
  } else {
    throw new Error(`${type} failed with an unknown error`);
  }
}
