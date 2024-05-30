import { lineaSepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import { createConfig } from "wagmi";

export const walletConnectProjectId = "b90f66826134d75b644e3311789615da";
const chains = [lineaSepolia] as const;
export const wagmiConfig = createConfig(
  getDefaultConfig({
    chains,
    walletConnectProjectId,
    appName: "eFrogs Attestations",
    appDescription: "Issue attestation of eFrogs ownership",
    appUrl: "https://efrogs.alainnicolas.fr",
    appIcon: "https://efrogs.alainnicolas.fr/favicon.jpg",
  }),
);
