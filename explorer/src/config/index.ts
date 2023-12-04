import { createConfig } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { lineaTestnet, linea } from "wagmi/chains";
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import lineaMainnetIcon from "@/assets/networks/linea-mainnet.svg";
import lineaTestnetIcon from "@/assets/networks/linea-testnet.svg";
import { INetwork } from "@/interfaces/config";

const chains: INetwork[] = [
  {
    name: "Linea Mainnet",
    chain: linea,
    veraxEnv: VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND,
    img: lineaMainnetIcon,
    network: "linea",
  },
  {
    name: "Linea Testnet",
    chain: lineaTestnet,
    veraxEnv: VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND,
    img: lineaTestnetIcon,
    network: "linea-testnet",
  },
];

const config = createConfig(
  getDefaultConfig({
    infuraId: import.meta.env.VITE_INFURA_API_KEY,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "",
    appName: "Verax Explorer",
    chains: chains.map((el) => el.chain),
  }),
);

const defaultChain = chains[0];

export { chains, config, defaultChain };
