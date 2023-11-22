import { WagmiConfig } from "wagmi"
import { Outlet } from "react-router-dom"
import { ConnectKitProvider } from "connectkit"

import { Header } from "@/components/Header"
import { config } from "@/config"

import { NetworkContextProvider } from "./network-provider"

export const Providers = () => {
  return (
    <NetworkContextProvider>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <Header>
            <Outlet />
          </Header>
        </ConnectKitProvider>
      </WagmiConfig>
    </NetworkContextProvider>
  )
}
