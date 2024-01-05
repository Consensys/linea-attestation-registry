import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WagmiConfig } from "wagmi";
import { linea, lineaTestnet, arbitrum, arbitrumGoerli, mainnet } from "wagmi/chains";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

const metadata = {
  name: "Verax Attestation Registry",
  url: "https://ver.ax",
};

const chains = [linea, lineaTestnet, arbitrum, arbitrumGoerli, mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
  </React.StrictMode>,
);
