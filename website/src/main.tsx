import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createConfig, WagmiConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { linea, lineaTestnet, arbitrum, arbitrumGoerli } from "wagmi/chains";

const config = createConfig(
  getDefaultConfig({
    infuraId: import.meta.env.VITE_INFURA_API_KEY,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    appName: "Verax Website",
    chains: [linea, lineaTestnet, arbitrum, arbitrumGoerli],
  }),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);
