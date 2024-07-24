import ZeroXScore from "@/assets/issuers/0xscore.svg?react";
import Aspecta from "@/assets/issuers/aspecta.svg?react";
import Automata from "@/assets/issuers/automata.svg?react";
import Gitcoin from "@/assets/issuers/gitcoin.svg?react";
import Hapi from "@/assets/issuers/Hapi_logo_square.svg?react";
import IndexNetwork from "@/assets/issuers/index-network-black.svg?react";
import IndexNetworkDark from "@/assets/issuers/index-network.svg?react";
import Nomis from "@/assets/issuers/nomis.svg?react";
import Okapi from "@/assets/issuers/okapi-black.svg?react";
import OkapiDark from "@/assets/issuers/okapi-white.svg?react";
import OpenId3 from "@/assets/issuers/openid3.svg?react";
import Orange from "@/assets/issuers/orange.svg?react";
import PadoDark from "@/assets/issuers/pado-dark.svg?react";
import Pado from "@/assets/issuers/pado.svg?react";
import PrivadoID from "@/assets/issuers/privado-id.svg?react";
import Reclaim from "@/assets/issuers/reclaim.svg?react";
import RubyScore from "@/assets/issuers/rubyscore.svg?react";
import Trusta from "@/assets/issuers/trusta.svg?react";
import Zeronym from "@/assets/issuers/zeronym-black.svg?react";
import ZeronymDark from "@/assets/issuers/zeronym-white.svg?react";
import ZkPassDark from "@/assets/issuers/zkpass-dark.svg?react";
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
    logoDark: PadoDark,
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
    logoDark: ZkPassDark,
    keywords: ["zk-attestations"],
    description:
      "Generating a zero-knowledge proof based on an HTTPS Web Session that represents your IRL assets and identity, right in the browser locally, and no API authorization is required.",
    CTALink: "https://verax.zkpass.org/verax",
    CTATitle: "Go To zkPass",
    address: "0x182085Ce8b0faDdc8503D9921dF6Af076281A6A9",
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
      "Nomis is an Identity and Reputation Protocol that leverages users on-chain activity to assign Reputation Scores to their wallets. It serves as the Layer for Web3 Personalization, enabling users to create, develop and leverage their on-chain Reputation.",
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
  {
    name: "Aspecta",
    logo: Aspecta,
    keywords: ["reputation", "builder profile"],
    description:
      "Aspecta is an identity-centric hub for builder reputation, creation, and opportunity. We build an AI-powered identity for builders to demonstrate skills, experiences, and opinions based on GitHub and other data resources‘ insights.",
    CTALink: "https://aspecta.id/campaign/builders-voyage",
    CTATitle: "Go To Aspecta",
    address: "0x36933bd4288648d95a8275e663003ae7efd2199d",
  },
  {
    name: "Automata Network",
    logo: Automata,
    keywords: ["Proof of Machinehood", "Machine Attestation"],
    description:
      "Automata is a modular attestation layer that powers Proof of Machinehood. PoM is hardware-based attestation that provides verifiable claims about the identity, configuration and operational attributes of computing devices, which creates a viable framework for applications to be constructed upon an enduring bedrock of collective agency and data dignity.",
    CTALink: "https://pom.ata.network",
    CTATitle: "Go To Automata",
    address: "0x95d06B395F04dc1bBD0CE9fcC501D7044ea25DAd",
  },
  {
    name: "Reclaim Protocol",
    logo: Reclaim,
    keywords: ["zk-attestations"],
    description:
      "Reclaim Protocol bridges web2 and web3 by allowing users to manage their personal data. Interoperable technology enables the secure extraction and moving of any piece of personal information. Anything visible in the UI of a web service can be seamlessly transformed into anonymous zero-knowledge proof. The main areas of interest for Reclaim include user data enrichment, Sybil resistance for web3, proof-of-humanity methodologies, and web2 commercial use cases.",
    CTALink: "https://publish-credentials.reclaimprotocol.org/create-credential",
    CTATitle: "Go To Reclaim Protocol",
    address: "0xc15718EEC68DbCA02C4B4215B87beef46C3106d5",
  },
  {
    name: "RubyScore",
    logo: RubyScore,
    keywords: ["reputation", "wallet score"],
    description:
      "RubyScore - Onchain ranking protocol. We conduct a comprehensive ranking of the entire Layer 2 to help users understand their position among all participants and evaluate their wallets based on various parameters.",
    CTALink: "https://rubyscore.io/attestation",
    CTATitle: "Go To RubyScore",
    address: "0xb9cc0bb020cf55197c4c3d826ac87cadba51f272",
  },
  {
    name: "Zeronym by Holonym",
    logo: Zeronym,
    logoDark: ZeronymDark,
    keywords: ["Proof of Personhood"],
    description: "Prove your personhood with Zeronym by Holonym without revealing any information about your identity",
    CTALink: "https://holonym.id/",
    CTATitle: "Go To Holonym",
    address: "0xdca2e9ae8423d7b0f94d7f9fc09e698a45f3c851",
  },
  {
    name: "Hapi",
    logo: Hapi,
    keywords: ["Proof of Personhood", "Trust Score", "Security"],
    description:
      "HAPI ID is a digital identification of a user’s on-chain activity, created to simplify the interpretation of user’s action on the blockchain. Created for users, protocols, DApps, and businesses, HAPI ID serves as a one-stop unique solution against Sybils and for Users!",
    CTALink: "https://hapi.one",
    CTATitle: "Go To Hapi",
    address: "0x62773b3217e066a9a4ebd98db4360d89671453df",
  },
  {
    name: "Okapi",
    logo: Okapi,
    logoDark: OkapiDark,
    keywords: ["Proof of Personhood"],
    description:
      "Okapi is a social discovery protocol that leverages the wisdom of the crowd to guide users' journey through the entirety of web3",
    CTALink: "https://www.okapi.xyz",
    CTATitle: "Go To Okapi",
    address: "0xab3fa8a72eb66a128e8a84baa8c9578180806c6f",
  },
  {
    name: "Index Network",
    logo: IndexNetwork,
    logoDark: IndexNetworkDark,
    keywords: ["Discoverability"],
    description:
      "Index Network is a discovery protocol that enables truly personalized and autonomous experiences across the web. By utilizing decentralized agents and semantic indexes, it facilitates the discovery of information in various fields, including science, journalism, e-commerce, and social interactions. Index Network transforms discovery into a protocol, making it a foundational layer for better information and user experience in web3.",
    CTALink: "https://index.network/",
    CTATitle: "Go To Index Network",
    address: "0x0000000000000000000000000000000000000000",
  },
  {
    name: "Privado ID",
    logo: PrivadoID,
    logoDark: PrivadoID,
    keywords: ["Proof of Uniqueness", "Proof of Liveness", "Reputation"],
    description:
      "Unlock your exclusive early adopter rewards while outsmarting bots! Participate in incentive programs or interact with dApps while preserving your privacy. Claim your Proof of Uniqueness (PoU) and Proof of Liveness (PoL) credentials and reuse them across any EVM-compatible chain.",
    CTALink: "https://www.privado.id/",
    CTATitle: "Go To Privado ID",
    address: "0x80203136fae3111b810106baa500231d4fd08fc6",
  },
];