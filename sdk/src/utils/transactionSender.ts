import { Hash, PublicClient, TransactionReceipt, WalletClient } from "viem";

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
    console.log(`Transaction sent with hash ${hash}`);

    if (waitForConfirmation) {
      // Wait for the transaction to be mined and confirmed
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    }

    return { transactionHash: hash };
  } catch (error) {
    // Handle errors or rethrow if needed
    console.error("Error while executing transaction:", error);
    throw error;
  }
}
