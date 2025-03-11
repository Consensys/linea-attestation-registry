import { run } from "hardhat";

export const getNetworkConfig = (chainId: bigint): { isTestnet: boolean; chainPrefix: `0x${string}` } => {
  switch (chainId) {
    case 59141n: // Linea Sepolia
      return { isTestnet: true, chainPrefix: "0x0000000000000000000000000000000000000000000000000000000000000000" };
    case 59144n: // Linea mainnet
      return { isTestnet: false, chainPrefix: "0x0000000000000000000000000000000000000000000000000000000000000000" };
    case 421614n: // Arbitrum Sepolia
      return { isTestnet: true, chainPrefix: "0x0001000000000000000000000000000000000000000000000000000000000000" };
    case 42161n: // Arbitrum mainnet
      return { isTestnet: false, chainPrefix: "0x0001000000000000000000000000000000000000000000000000000000000000" };
    case 84532n: // Base Sepolia
      return { isTestnet: true, chainPrefix: "0x0005000000000000000000000000000000000000000000000000000000000000" };
    case 8453n: // Base mainnet
      return { isTestnet: false, chainPrefix: "0x0005000000000000000000000000000000000000000000000000000000000000" };
    case 97n: // BSC testnet
      return { isTestnet: true, chainPrefix: "0x0006000000000000000000000000000000000000000000000000000000000000" };
    case 56n: // BSC mainnet
      return { isTestnet: false, chainPrefix: "0x0006000000000000000000000000000000000000000000000000000000000000" };
    case 11155111n: // Sepolia
      return { isTestnet: true, chainPrefix: "0x0008000000000000000000000000000000000000000000000000000000000000" };
    default:
      throw new Error("Unknown network ID");
  }
};

/**
 * Verifies a contract on the blockchain explorer if verification is enabled
 * @param address The address of the contract to verify
 * @param constructorArguments Optional constructor arguments for the contract
 * @param shouldVerify Whether to perform verification (default: true)
 * @returns A promise that resolves when verification is complete or skipped
 */
export const verifyContract = async (
  address: string,
  constructorArguments: unknown[] = [],
  shouldVerify: boolean = true,
): Promise<void> => {
  if (!shouldVerify) {
    console.log(`Verification skipped for contract at ${address}`);
    return;
  }

  try {
    console.log(`Verifying contract at ${address}...`);
    // Wait a bit before verification to ensure the contract is deployed and indexed
    await new Promise((resolve) => setTimeout(resolve, 5000));

    await run("verify:verify", {
      address,
      constructorArguments: constructorArguments.length > 0 ? constructorArguments : undefined,
    });

    console.log(`Contract at ${address} successfully verified!`);
  } catch (error) {
    console.error(`Verification failed for contract at ${address}:`, error);
  }
};
