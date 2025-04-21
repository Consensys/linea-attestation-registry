import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { Outlet } from "react-router-dom";
import { WagmiProvider } from "wagmi";

import { config } from "@/config";
import { NetworkProvider } from "@/contexts/NetworkProvider";
import { Layout } from "@/pages/Layout";

import { NetworkContextProvider } from "./network-provider";

export const Providers = () => {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <NetworkProvider>
            <NetworkContextProvider>
              <Layout>
                <Outlet />
              </Layout>
            </NetworkContextProvider>
          </NetworkProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
