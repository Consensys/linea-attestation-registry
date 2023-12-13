import ZeroXScore from "@/assets/issuers/0xscore.svg?react";
import Clique from "@/assets/issuers/clique.svg?react";
import Gitcoin from "@/assets/issuers/gitcoin.svg?react";
import Nomis from "@/assets/issuers/nomis.svg?react";
import Orange from "@/assets/issuers/orange.svg?react";
import Trusta from "@/assets/issuers/trusta.svg?react";
import ZkPass from "@/assets/issuers/zkpass.svg?react";

import { IIssuer } from "./interface";

export const issuersData: IIssuer[] = [
  {
    id: "1",
    name: "Trusta",
    logo: Trusta,
    description:
      "Connect your wallet to LINEA to view and generate your Trusta's Sybil Score attestation. Your humanity is verified based only on your on-chain data, without needing approval from a central authority, and without any request for your personal info.",
    landingPage:
      "https://trustgo.trustalabs.ai/etrusta/0x085ed975a8b6b860de3c2b871da60a3f9f48a5b8/lineaverax/h?f=linea&chainId=324",
  },
  {
    id: "2",
    name: "Gitcoin Passport",
    logo: Gitcoin,
    description:
      "Gitcoin Passport is the best, easy-to-use identity and Sybil defense solution in web3. Top web3 projects protect what matters with Gitcoin Passport.",
    landingPage: "https://passport.gitcoin.co/#/dashboard/verax",
  },
  {
    id: "3",
    name: "PADO Labs",
    logo: Gitcoin,
    description:
      "PADO is a zkAttestation protocol, dedicated to bringing Internet data into web3 smart contracts, expanding the capabilities of smart contracts, and enabling the monetization of personal data within data flows under privacy protection.",
    landingPage: "https://www.padolabs.org/events",
  },
  {
    id: "4",
    name: "zkPass",
    logo: ZkPass,
    description:
      "Generating a zero-knowledge proof based on an HTTPS Web Session that represents your IRL assets and identity, right in the browser locally, and no API authorization is required.",
    landingPage: "https://verax.zkpass.org/verax",
  },
  {
    id: "5",
    name: "Clique",
    logo: Clique,
    description:
      "Connect your Twitter account & claim your Twitter attestations on the Linea Network. Your attestations will be directly embedded in Linea's reputation layer.",
    landingPage: "https://www.clique.social/attestor/twitterLinea",
  },
  {
    id: "6",
    name: "Openid3",
    logo: Gitcoin,
    description: "A Decentralized authentication protocol that provides proofs for user's Web2 accounts.",
    landingPage: "https://auth.openid3.xyz",
  },
  {
    id: "7",
    name: "Nomis",
    logo: Nomis,
    description:
      "Nomis is an Identity and Reputation Protocol that leverages users onchain activity to assign Reputation Scores to their wallets. It serves as the Layer for Web3 Personalization, enabling users to create, develop and leverage their onchain Reputation.",
    landingPage: "https://nomis.cc/linea-voyage",
  },
  {
    id: "8",
    name: "Orange Protocol",
    logo: Orange,
    description:
      "Orange is a reputation minting protocol that aggregates data and models to generate comprehensive trust proofs in the form of VCs and NFTs.",
    landingPage: "TBD",
  },
  {
    id: "9",
    name: "0xScore",
    logo: ZeroXScore,
    description:
      "0xScore is a web3 reputational tool for wallets based on their on-chain activity. It allows you to analyze and compare wallets to understand their reputation and power.",
    landingPage: "https://0xscore.pro/linea-attestation",
  },
];
