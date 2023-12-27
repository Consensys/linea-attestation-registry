import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { linea, lineaTestnet } from "wagmi/chains";

import veraxColoredIcon from "@/assets/logo/verax-colored-icon.svg";
import LineaMainnetIconDark from "@/assets/networks/linea-mainnet-dark.svg?react";
import LineaMainnetIcon from "@/assets/networks/linea-mainnet.svg?react";
import LineaTestnetIcon from "@/assets/networks/linea-testnet.svg?react";
import { INetwork } from "@/interfaces/config";

const chains: INetwork[] = [
  {
    name: "Linea Mainnet",
    chain: linea,
    veraxEnv: VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND,
    img: <LineaMainnetIcon />,
    imgDark: <LineaMainnetIconDark />,
    network: "linea",
  },
  {
    name: "Linea Testnet",
    chain: lineaTestnet,
    veraxEnv: VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND,
    img: <LineaTestnetIcon />,
    network: "linea-testnet",
  },
];

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const config = defaultWagmiConfig({
  projectId,
  chains: chains.map((el) => el.chain),
  metadata: {
    name: "Verax | Explorer",
    description: "Verax | Explorer",
    url: "https://ver.ax",
    icons: [veraxColoredIcon],
  },
});

createWeb3Modal({
  projectId,
  chains: chains.map((el) => el.chain),
  wagmiConfig: config,
});

const defaultChain = chains[0];

export { chains, config, defaultChain };
