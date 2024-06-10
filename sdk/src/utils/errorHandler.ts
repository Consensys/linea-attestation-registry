import { BaseError, ContractFunctionRevertedError } from "viem";
import { ActionType } from "./constants";

export function handleError(type: ActionType, err: unknown): never {
  if (err instanceof BaseError) {
    const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? "";
      throw new Error(`${type} failed with ${errorName}`);
    }
  } else {
    throw new Error(`${type} failed with ${err}`);
  }

  throw new Error("${type} failed");
}
