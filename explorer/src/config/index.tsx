import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { getDefaultConfig } from "connectkit";
import { createConfig } from "wagmi";
import { linea, lineaTestnet } from "wagmi/chains";

import veraxColoredIcon from "@/assets/logo/verax-colored-icon.svg";
import LineaMainnetIcon from "@/assets/networks/linea-mainnet.svg?react";
import LineaTestnetIcon from "@/assets/networks/linea-testnet.svg?react";
import { INetwork } from "@/interfaces/config";

const chains: INetwork[] = [
  {
    name: "Linea Mainnet",
    chain: linea,
    veraxEnv: VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND,
    img: <LineaMainnetIcon />,
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

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    infuraId: import.meta.env.VITE_INFURA_API_KEY,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    chains: chains.map((el) => el.chain),
    appName: "Verax | Explorer",
    appIcon: veraxColoredIcon,
  }),
);

const defaultChain = chains[0];

export { chains, config, defaultChain };
