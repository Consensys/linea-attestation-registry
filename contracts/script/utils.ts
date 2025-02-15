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
    case 11155111n: // Ethereum Sepolia
      return { isTestnet: true, chainPrefix: "0x0008000000000000000000000000000000000000000000000000000000000000" };
    default:
      throw new Error("Unknown network ID");
  }
};
