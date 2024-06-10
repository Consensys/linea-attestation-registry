import { Hash, PublicClient, TransactionReceipt, WalletClient } from "viem";
import { handleError } from "./errorHandler";
import { ActionType } from "./constants";

// TODO: Use correct type for request
export async function executeTransaction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: any,
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
      // Wait for the transaction to be confirmed
      return await publicClient.waitForTransactionReceipt({ hash });
    }

    return { transactionHash: hash };
  } catch (err) {
    handleError(ActionType.Transaction, err);
  }
}
