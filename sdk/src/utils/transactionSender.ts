import { Hash, WalletClient } from "viem";

// TODO: Use correct type for request
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeTransaction(request: any, walletClient?: WalletClient): Promise<Hash> {
  if (!walletClient) {
    throw new Error("VeraxSDK - Wallet not available");
  }

  const hash: Hash = await walletClient.writeContract(request);
  console.log(`Transaction sent with hash ${hash}`);
  return hash;
}
