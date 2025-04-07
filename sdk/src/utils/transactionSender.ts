import { Hash, PublicClient, TransactionReceipt, WalletClient, WriteContractParameters } from "viem";
import { handleError } from "./errorHandler";
import { ActionType } from "./constants";

export async function executeTransaction(
  request: WriteContractParameters,
  publicClient: PublicClient,
  walletClient?: WalletClient,
  waitForConfirmation: boolean = false,
): Promise<Partial<TransactionReceipt>> {
  if (!walletClient) {
    throw new Error("VeraxSDK - Wallet not available");
  }

  try {
    const hash: Hash = await walletClient.writeContract(request);

    if (waitForConfirmation) {
      return await publicClient.waitForTransactionReceipt({ hash });
    }

    return { transactionHash: hash };
  } catch (err) {
    handleError(ActionType.Transaction, err);
  }
}
