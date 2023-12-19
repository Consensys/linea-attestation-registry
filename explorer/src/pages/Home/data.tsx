import ZeroXScore from "@/assets/issuers/0xscore.svg?react";
import Clique from "@/assets/issuers/clique.svg?react";
import Gitcoin from "@/assets/issuers/gitcoin.svg?react";
import Nomis from "@/assets/issuers/nomis.svg?react";
import OpenId3 from "@/assets/issuers/openid3.svg?react";
import Orange from "@/assets/issuers/orange.svg?react";
import Pado from "@/assets/issuers/pado.svg?react";
import Trusta from "@/assets/issuers/trusta.svg?react";
import ZkPass from "@/assets/issuers/zkpass.svg?react";

import { IIssuer } from "./interface";

export const issuersData: IIssuer[] = [
  {
    name: "Trusta",
    logo: Trusta,
    keywords: ["reputation", "wallet score"],
    description:
      "Connect your wallet to LINEA to view and generate your Trusta's Sybil Score attestation. Your humanity is verified based only on your on-chain data, without needing approval from a central authority, and without any request for your personal info.",
    CTALink:
      "https://trustgo.trustalabs.ai/etrusta/0x085ed975a8b6b860de3c2b871da60a3f9f48a5b8/lineaverax/h?f=linea&chainId=324",
    CTATitle: "Go To Trusta Labs",
    address: "0x9e728394E55e6535BF66f913e911Ae1f572D8db0",
  },
  {
    name: "Gitcoin Passport",
    logo: Gitcoin,
    keywords: ["reputation", "wallet score"],
    description:
      "Gitcoin Passport is the best, easy-to-use identity and Sybil defense solution in web3. Top web3 projects protect what matters with Gitcoin Passport.",
    CTALink: "https://passport.gitcoin.co/#/dashboard/verax",
    CTATitle: "Get your passport",
    address: "0x96DB2c6D93A8a12089f7a6EdA5464e967308AdEd",
  },
  {
    name: "PADO Labs",
    logo: Pado,
    keywords: ["zk-attestations"],
    description:
      "PADO is a zkAttestation protocol, dedicated to bringing Internet data into web3 smart contracts, expanding the capabilities of smart contracts, and enabling the monetization of personal data within data flows under privacy protection.",
    CTALink: "https://www.padolabs.org/events",
    CTATitle: "Go to pado",
    address: "0xDB736B13E2f522dBE18B2015d0291E4b193D8eF6",
  },
  {
    name: "zkPass",
    logo: ZkPass,
    keywords: ["zk-attestations"],
    description:
      "Generating a zero-knowledge proof based on an HTTPS Web Session that represents your IRL assets and identity, right in the browser locally, and no API authorization is required.",
    CTALink: "https://verax.zkpass.org/verax",
    CTATitle: "Go To zkPass",
    address: "0x182085Ce8b0faDdc8503D9921dF6Af076281A6A9",
  },
  {
    name: "Clique",
    logo: Clique,
    keywords: ["zk-attestations", "social account attestation"],
    description:
      "Connect your Twitter account & claim your Twitter attestations on the Linea Network. Your attestations will be directly embedded in Linea's reputation layer.",
    CTALink: "https://www.clique.social/attestor/twitterLinea",
    CTATitle: "Connect with clique",
    address: "0x4401A1667dAFb63Cff06218A69cE11537de9A101",
  },
  {
    name: "Openid3",
    logo: OpenId3,
    keywords: ["zk-attestations", "social account attestation"],
    description: "A Decentralized authentication protocol that provides proofs for user's Web2 accounts.",
    CTALink: "https://auth.openid3.xyz",
    CTATitle: "Go to openid3",
    address: "0xdbCaf063873dC6be53c007Cf8f8447E303Cac8A3",
  },
  {
    name: "Nomis",
    logo: Nomis,
    keywords: ["reputation", "wallet score"],
    description:
      "Nomis is an Identity and Reputation Protocol that leverages users onchain activity to assign Reputation Scores to their wallets. It serves as the Layer for Web3 Personalization, enabling users to create, develop and leverage their onchain Reputation.",
    CTALink: "https://nomis.cc/linea-voyage",
    CTATitle: "Go To Nomis",
    address: "0x8535156C75750d79ee0D9829c5D4Ae6f5D9DbCB5",
  },
  {
    name: "Orange Protocol",
    logo: Orange,
    keywords: ["identity", "reputation"],
    description:
      "Orange is a reputation minting protocol that aggregates data and models to generate comprehensive trust proofs in the form of VCs and NFTs.",
    CTALink: "https://www.orangeprotocol.io/",
    CTATitle: "Go to orange",
    address: "0x3176383A7590D6B5c6F6268209f4c7FDeb7244Dc",
  },
  {
    name: "0xScore",
    logo: ZeroXScore,
    keywords: ["reputation", "wallet score"],
    description:
      "0xScore is a web3 reputational tool for wallets based on their on-chain activity. It allows you to analyze and compare wallets to understand their reputation and power.",
    CTALink: "https://0xscore.pro/linea-attestation",
    CTATitle: "Go To 0xScore",
    address: "0x04636DdD2feF7e9DB42a24821E489AD071749fEA",
  },
];
