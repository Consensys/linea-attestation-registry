import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WagmiConfig } from "wagmi";
import { arbitrum, arbitrumGoerli, linea, lineaTestnet, mainnet } from "wagmi/chains";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import LineaMainnetIcon from "./assets/linea-mainnet.svg";
import LineaTestnetIcon from "./assets/linea-testnet.svg";
import ArbitrumMainnetIcon from "./assets/arbitrum-mainnet.svg";
import ArbitrumTestnetIcon from "./assets/arbitrum-testnet.svg";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

const metadata = {
  name: "Verax Attestation Registry",
  url: "https://ver.ax",
};

const chains = [linea, lineaTestnet, arbitrum, arbitrumGoerli, mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  defaultChain: linea,
  chainImages: {
    59144: LineaMainnetIcon,
    59140: LineaTestnetIcon,
    42161: ArbitrumMainnetIcon,
    421613: ArbitrumTestnetIcon,
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
  </React.StrictMode>,
);
