import { ConnectKitProvider } from "connectkit";
import { Outlet } from "react-router-dom";
import { WagmiConfig } from "wagmi";

import { config } from "@/config";
import { Layout } from "@/pages/Layout";

import { NetworkContextProvider } from "./network-provider";

export const Providers = () => {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <NetworkContextProvider>
          <Layout>
            <Outlet />
          </Layout>
        </NetworkContextProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};
