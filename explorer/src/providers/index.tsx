import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { Outlet } from "react-router-dom";
import { WagmiProvider } from "wagmi";

import { config } from "@/config";
import { Layout } from "@/pages/Layout";

import { NetworkContextProvider } from "./network-provider";

export const Providers = () => {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <NetworkContextProvider>
            <Layout>
              <Outlet />
            </Layout>
          </NetworkContextProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
