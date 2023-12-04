import { WagmiConfig } from "wagmi";
import { Outlet } from "react-router-dom";
import { ConnectKitProvider } from "connectkit";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { config } from "@/config";

import { NetworkContextProvider } from "./network-provider";

export const Providers = () => {
  return (
    <NetworkContextProvider>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </div>
        </ConnectKitProvider>
      </WagmiConfig>
    </NetworkContextProvider>
  );
};
