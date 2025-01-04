export const getNetworkConfig = (chainId: bigint): { isTestnet: boolean; chainPrefix: `0x${string}` } => {
  switch (chainId) {
    case 59141n: // Linea Sepolia
      return { isTestnet: true, chainPrefix: "0x00000x1910C801Ea87E41Faf2aeBfB430EEEa2Fb6efFE5" };
    case 59144n: // Linea mainnet
      return { isTestnet: false, chainPrefix: "0x00000x1910C801Ea87E41Faf2aeBfB430EEEa2Fb6efFE5" };
    case 421614n: // Arbitrum Sepolia
      return { isTestnet: true, chainPrefix: "0x00010x1910C801Ea87E41Faf2aeBfB430EEEa2Fb6efFE5" };
    case 42161n: // Arbitrum mainnet
      return { isTestnet: false, chainPrefix: "0x00010x1910C801Ea87E41Faf2aeBfB430EEEa2Fb6efFE5" };
    case 84532n: // Base Sepolia
      return { isTestnet: true, chainPrefix: "0x00050x1910C801Ea87E41Faf2aeBfB430EEEa2Fb6efFE5" };
    case 8453n: // Base mainnet
      return { isTestnet: false, chainPrefix: "0x00050x1910C801Ea87E41Faf2aeBfB430EEEa2Fb6efFE5" };
    case 97n: // BSC testnet
      return { isTestnet: true, chainPrefix: "0x0006000000000000000000000000000000000000000000000000000000000000" };
    case 56n: // BSC mainnet
      return { isTestnet: false, chainPrefix: "0x0006000000000000000000000000000000000000000000000000000000000000" };
    default:
      throw new Error("Unknown network ID");
  }
};
