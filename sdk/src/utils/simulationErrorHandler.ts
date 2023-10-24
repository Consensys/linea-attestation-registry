import { BaseError, ContractFunctionRevertedError } from "viem";

export function handleSimulationError(err: unknown): never {
  if (err instanceof BaseError) {
    const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
    if (revertError instanceof ContractFunctionRevertedError) {
      const errorName = revertError.data?.errorName ?? "";
      console.error(`Failing with ${errorName}`);
    }
  } else {
    console.error(err);
  }

  throw new Error("Simulation failed");
}
