export const getChainPrefix = (chainId: bigint): bigint => {
  switch (chainId) {
    case 59140n: // Linea testnet
      return 0n;
    case 59144n: // Linea mainnet
      return 0n;
    case 421613n: // Arbitrum testnet
      return 1000000000000000000000000000000000000000000000000000000000000n;
    case 42161n: // Arbitrum mainnet
      return 1000000000000000000000000000000000000000000000000000000000000n;
    default:
      throw new Error("Unknown network");
  }
};
