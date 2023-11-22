import { Hash, WalletClient } from "viem";

// TODO: Use correct type for request
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeTransaction(walletClient: WalletClient | undefined, request: any): Promise<Hash> {
  if (walletClient === undefined) throw new Error("Account not available");
  const hash: Hash = await walletClient.writeContract(request);
  console.log(`Transaction sent with hash ${hash}`);
  return hash;
}
