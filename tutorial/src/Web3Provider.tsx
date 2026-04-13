import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { arbitrumSepolia, baseSepolia, bscTestnet, lineaSepolia, mainnet } from "viem/chains";
import { WagmiProvider } from "wagmi";

import ArbitrumSepoliaIcon from "./assets/arbitrum-sepolia.svg";
import BaseSepoliaIcon from "./assets/base-sepolia.svg";
import BscTestnetIcon from "./assets/bsc-testnet.svg";
import LineaSepoliaIcon from "./assets/linea-sepolia.svg";
import { metadata, wagmiAdapter, walletConnectProjectId } from "./wagmiConfig.ts";

const queryClient = new QueryClient();

createAppKit({
  adapters: [wagmiAdapter],
  networks: [lineaSepolia, arbitrumSepolia, baseSepolia, bscTestnet, mainnet],
  metadata: metadata,
  projectId: walletConnectProjectId,
  features: {
    analytics: true,
    socials: false,
    email: false,
    pay: false,
    swaps: false,
    onramp: false,
    legalCheckbox: false,
  },
  defaultNetwork: lineaSepolia,
  chainImages: {
    59_141: LineaSepoliaIcon,
    421_614: ArbitrumSepoliaIcon,
    84_532: BaseSepoliaIcon,
    97: BscTestnetIcon,
  },
});

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Readonly<Web3ProviderProps>) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
