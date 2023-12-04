import { WagmiConfig } from "wagmi";
import { Outlet } from "react-router-dom";
import { ConnectKitProvider } from "connectkit";

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
