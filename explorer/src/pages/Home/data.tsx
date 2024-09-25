import ZeroXScore from "@/assets/issuers/0xscore.svg?react";
import Aspecta from "@/assets/issuers/aspecta.svg?react";
import Automata from "@/assets/issuers/automata.svg?react";
import Hapi from "@/assets/issuers/hapi.svg?react";
import Nomis from "@/assets/issuers/nomis.svg?react";
import Okapi from "@/assets/issuers/okapi-black.svg?react";
import OkapiDark from "@/assets/issuers/okapi-white.svg?react";
import OpenId3 from "@/assets/issuers/openid3.svg?react";
import Orange from "@/assets/issuers/orange.svg?react";
import PadoDark from "@/assets/issuers/pado-dark.svg?react";
import Pado from "@/assets/issuers/pado.svg?react";
import PassportXyz from "@/assets/issuers/passport-xyz.svg?react";
import PrivadoID from "@/assets/issuers/privado-id.svg?react";
import Reclaim from "@/assets/issuers/reclaim.svg?react";
import Reputex from "@/assets/issuers/reputex.svg?react";
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
    attestationDefinitions: [
      {
        name: "Reputation attestation",
        logo: Trusta,
        description:
          "Trusta's Sybil Score attestation provides a simple, permissionless, and privacy-preserving way to verify your humanity based on machine-learning algorithm",
        portal: "0xb86b3e16b6b960fd822849fd4b4861d73805879b",
        schema: "0x63c8925414d0bd8e4b943b49867adef6fabf8fb66d9ecefacfa90272623edf9e",
        url: "https://trustgo.trustalabs.ai/etrusta/0x085ed975a8b6b860de3c2b871da60a3f9f48a5b8/lineaverax/m?chainId=324&s=EPR0QD9W52I8",
        chainId: "0xe708",
      },
      {
        name: "Humanity attestation",
        logo: Trusta,
        description:
          "Trusta's MEDIA Score attestation provides a simple, quantifiable and privacy-preserving way to evaluate your reputation based on your on-chain activity",
        portal: "0xb86b3e16b6b960fd822849fd4b4861d73805879b",
        schema: "0x105db2b6a3e9d79739bca3e1d9ddeec6bd68667cf1de8d4248020b91a9a80e46",
        url: "https://trustgo.trustalabs.ai/etrusta/0x085ed975a8b6b860de3c2b871da60a3f9f48a5b8/lineaverax/h?chainId=324&s=EPR0QD9W52I8",
        chainId: "0xe708",
      },
    ],
  },
  {
    name: "Passport XYZ",
    logo: PassportXyz,
    keywords: ["reputation", "wallet score"],
    description:
      "Passport XYZ enables web3 users to fairly participate in rewards, governance, and other community programs by helping partners better identify high-quality unique humans participating in their ecosystem.",
    CTALink: "https://passport.gitcoin.co/#/verax/dashboard",
    CTATitle: "Get your Passport",
    address: "0x96DB2c6D93A8a12089f7a6EdA5464e967308AdEd",
    attestationDefinitions: [
      {
        name: "Unique Humanity Score",
        logo: PassportXyz,
        description:
          "Passport XYZ's Unique Humanity Score is the sum of different verifiable credentials, which together represents how unique and human the associated account is. Partners typically require users to have a score of 20+ to participate in various programs.",
        portal: "0xcaa9e817f02486ce076560b77a86235ef91c5d5d",
        schema: "0x01f031da36192c34057c764239eb77bb6ec8ebfb808f72a7bb172f37a5bec31f",
        url: "https://passport.gitcoin.co/#/verax/dashboard",
        chainId: "0xe708",
      },
    ],
  },
  {
    name: "PADO Labs",
    logo: Pado,
    logoDark: PadoDark,
    keywords: ["zk-attestations"],
    description:
      "PADO is a zkAttestation protocol, dedicated to bringing Internet data into web3 smart contracts, expanding the capabilities of smart contracts, and enabling the monetization of personal data within data flows under privacy protection.",
    CTALink: "https://www.padolabs.org/events",
    CTATitle: "Go to Pado",
    address: "0xDB736B13E2f522dBE18B2015d0291E4b193D8eF6",
    attestationDefinitions: [
      {
        name: "Binance KYC",
        logo: Pado,
        logoDark: PadoDark,
        description: "PADO uses MPC-TLS and ZKP technology to attest you have a valid KYC on Binance",
        portal: "0xc4b7dcba12866f6f8181b949ca443232c4e94334",
        schema: "0x84fdf5748d9af166503472ff5deb0cd5f61f006169424805fd5554356ac6df10",
        url: "https://padolabs.org/events",
        chainId: "0xe708",
      },
    ],
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
    attestationDefinitions: [
      {
        name: "OKX KYC",
        logo: ZkPass,
        logoDark: ZkPassDark,
        description: "Prove you own OKX account with a valid KYC using zkPass' zk-TLS technology",
        portal: "0x3b30d7c4e5aa3d7da11431af23e8d1f7d25bb0b8",
        schema: "0x1299c489f12e79cf43672c791e9a962fb9ee2151784561f6ba2eb9ff6325a9a4",
        url: "https://verax.zkpass.org/verax",
        chainId: "0xe708",
      },
      {
        name: "Uber trips",
        logo: ZkPass,
        logoDark: ZkPassDark,
        description: "Prove you own an account on Uber with at least 10 trips using zkPass' zk-TLS technology",
        portal: "0x3b30d7c4e5aa3d7da11431af23e8d1f7d25bb0b8",
        schema: "0xc0980771b02c57e851f0ecca619d593de82dc84b25db9c9273bbf5b1537276ae",
        url: "https://verax.zkpass.org/verax",
        chainId: "0xe708",
      },
      {
        name: "Coinbase KYC",
        logo: ZkPass,
        logoDark: ZkPassDark,
        description: "Prove you own a Coinbase account with a valid KYC using zkPass' zk-TLS technology",
        portal: "0x3b30d7c4e5aa3d7da11431af23e8d1f7d25bb0b8",
        schema: "0x86e936ffddb895a13271ddb23cbf23b90ce44628b82de518dc0a6d117fed12db",
        url: "https://verax.zkpass.org/verax",
        chainId: "0xe708",
      },
    ],
  },
  {
    name: "Openid3",
    logo: OpenId3,
    keywords: ["zk-attestations", "social account attestation"],
    description: "A Decentralized authentication protocol that provides proofs for user's Web2 accounts.",
    CTALink: "https://auth.openid3.xyz",
    CTATitle: "Go to openid3",
    address: "0xdbCaf063873dC6be53c007Cf8f8447E303Cac8A3",
    attestationDefinitions: [
      {
        name: "Google account attestation",
        logo: OpenId3,
        description:
          "Openid3 uses zero-knowledge proof to attest you own a Google account without revealing any information from this account",
        portal: "0xce048492076b0130821866f6d05a0b621b1715c8",
        schema: "0x912214269b9b891a0d7451974030ba13207d3bf78e515351609de9dd8a339686",
        url: "https://app.orangeprotocol.io/campaigns/Linea/22",
        chainId: "0xe708",
      },
    ],
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
    attestationDefinitions: [
      {
        name: "Wallet Reputation score",
        logo: Nomis,
        description:
          "The Wallet Reputation score, from 0 to 100, is computed based of your onchain footprints thanks to AI-powered mathematical modeling",
        portal: "0x00df5a5eddb5e6a0d2ca38e193f82955a398b02a",
        schema: "0x5d7cf069e8113d144e3c7cbec09f8f9b59d5f67a89269c957d5b0b7e6ca782b7",
        url: "https://nomis.cc/linea-voyage",
        chainId: "0xe708",
      },
    ],
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
    attestationDefinitions: [
      {
        name: "Proof of personhood",
        logo: Orange,
        description: "Prove you are a real human using the BrightID network",
        portal: "0x158c2eba6d050e9ef7b07250d2f4443a002f21c0",
        schema: "0x0359a5c155f90c06ac75bcebd0d3cffaf13d0152f9a60d65b297baeb7476a024",
        url: "https://app.orangeprotocol.io/campaigns/Linea/22",
        chainId: "0xe708",
      },
    ],
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
    attestationDefinitions: [
      {
        name: "Reputation score",
        logo: ZeroXScore,
        description:
          "0xScore provides a numerical reputation score for web3 addresses based on their on-chain behavior",
        portal: "0xbdec68492d69a7ff1fb4c2abf5c28ade535dc88a",
        schema: "0x6350a66dfb1aebcab88bb92c6fc179eb618472b7e0a95dee7ca5982a34610030",
        url: "https://0xscore.io/linea-attestation",
        chainId: "0xe708",
      },
    ],
  },
  {
    name: "Aspecta",
    logo: Aspecta,
    keywords: ["reputation", "builder profile"],
    description:
      "Aspecta is an identity-centric hub for builder reputation, creation, and opportunity. We build an AI-powered identity for builders to demonstrate skills, experiences, and opinions based on GitHub and other data resources‘ insights.",
    CTALink: "https://aspecta.id/campaign/builders-voyage",
    CTATitle: "Go To Aspecta",
    address: "0xd70ced3de8aafe99b5202ed4f6ba24c4029b39d8",
    attestationDefinitions: [
      {
        name: "Builder Achievements",
        logo: Aspecta,
        description:
          "Claim your Builder credential. Receive badges based on your developer activity. Unlock token-gated experiences and more.",
        portal: "0x36933bd4288648d95a8275e663003ae7efd2199d",
        schema: "0xdb5ae35f38076cf76d5d1ca8e1e4f701ebd024773b19cd2b30601294943f3bff",
        url: "https://aspecta.ai/builder-matrix/Linea-builder-launchpad",
        chainId: "0xe708",
      },
    ],
  },
  {
    name: "Automata Network",
    logo: Automata,
    keywords: ["Proof of Machinehood", "Machine Attestation"],
    description:
      "Automata is a modular attestation layer that powers Proof of Machinehood. PoM is hardware-based attestation that provides verifiable claims about the identity, configuration and operational attributes of computing devices, which creates a viable framework for applications to be constructed upon an enduring bedrock of collective agency and data dignity.",
    CTALink: "https://pom.ata.network",
    CTATitle: "Attest your Machine",
    address: "0x95d06B395F04dc1bBD0CE9fcC501D7044ea25DAd",
    attestationDefinitions: [
      {
        name: "Proof of Machinehood",
        logo: Automata,
        description:
          "“Proof of Machinehood” is an on-chain hardware attestation validating machine authenticity and capabilities without excessive computation or capital. Each machine, verified by the manufacturer, can sign and share its data on-chain.",
        portal: "0xaf7452841e9a0851bead2d2b33f3494571a40d4c",
        schema: "0xfcd7908635f4a15e4c4ae351f13f9aa393e56e67aca82e5ffd3cf5c463464ee7",
        url: "https://pom.ata.network/",
        chainId: "0xe708",
      },
    ],
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
    attestationDefinitions: [
      // TODO: add Reclaim Protocol's information
    ],
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
    attestationDefinitions: [
      {
        name: "RubyScore",
        logo: RubyScore,
        description:
          "RubyScore uses on-chain metrics to determine the points assigned to each wallet, reflecting your activity",
        portal: "0xb9cc0bb020cf55197c4c3d826ac87cadba51f272",
        schema: "0xce6351ef35f71cd649b75be11a4d08a8420811e21db89085b27f56c9eeac1578",
        url: "https://rubyscore.io/attestation",
        chainId: "0xe708",
      },
    ],
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
    attestationDefinitions: [
      {
        name: "Proof of personhood",
        logo: Zeronym,
        logoDark: ZeronymDark,
        description:
          "Holonym provides various methods to prove that you are a human while protecting your privacy with zero-knowledge proofs",
        portal: "0x5631aecf3283922b6bf36d7485eb460f244bfac1",
        schema: "0x1c14fd320660a59a50eb1f795116193a59c26f2463c0705b79d8cb97aa9f419b",
        url: "",
        chainId: "0xe708",
      },
    ],
  },
  {
    name: "Hapi",
    logo: Hapi,
    keywords: ["Proof of Personhood", "Trust Score", "Security"],
    description:
      "HAPI ID is a digital identification of a user’s on-chain activity, created to simplify the interpretation of user’s action on the blockchain. Created for users, protocols, DApps, and businesses, HAPI ID serves as a one-stop unique solution against Sybils and for Users!",
    CTALink: "https://t.me/herewalletbot/app?startapp=web-score-hapi-mobi",
    CTATitle: "Mint your score",
    address: "0x62773b3217e066a9a4ebd98db4360d89671453df",
    attestationDefinitions: [
      {
        name: "HAPI score",
        logo: Hapi,
        description:
          "The HAPI Score is designed to assess the authenticity and activity of an on-chain account by analyzing various parameters related to its behavior and interactions.",
        portal: "0xbc6897b3cd9be7411ecb88ba2840e3b1e8d431fb",
        schema: "0xa913ce4f3de12a7b13304add3d7cd904794fc79c3d3f23b91a1914c2f19233e9",
        url: "https://t.me/herewalletbot/app?startapp=web-score-hapi-mobi",
        chainId: "0xe708",
      },
    ],
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
    attestationDefinitions: [
      {
        name: "dApp review",
        logo: Okapi,
        logoDark: OkapiDark,
        description: "Post your dApp reviews on-chain",
        portal: "0xea7d7e414c17ce831ba7237b08d832f5e5327303",
        schema: "0xec0f2d94ea5a78de8fcca98772fb8b4e36236bac1f081a6a8c745ed897c262b7",
        url: "",
        chainId: "0xe708",
      },
    ],
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
    attestationDefinitions: [
      {
        name: "Proof of Uniqueness",
        logo: PrivadoID,
        logoDark: PrivadoID,
        description:
          "Prove that you are a unique human in two steps, by passing this multi-level credentialing leveraging biometrics face-scan system that ensures only unique humans can attain Level 2",
        portal: "0x3486d714c6e6f7257fa7f0bb8396161150b9f100",
        schema: "0x021fa993b2ac55b95340608478282821b89398de6fa14073b4d44a3564a8c79d",
        url: "https://verax.privado.id/",
        chainId: "0xe708",
      },
    ],
  },
  {
    name: "ReputeX",
    logo: Reputex,
    logoDark: Reputex,
    keywords: ["Reputation"],
    description:
      "ReputeX is the Modular Web3 Reputation Layer, building a suite of Reputation, Credit and Engagement metrics specifically designed for the Web3 ecosystem.",
    CTALink: "https://reputex.io",
    CTATitle: "Go To ReputeX",
    address: "0x92300aed0cb2b0d392dbf912085b01c4b2251b7d",
    attestationDefinitions: [
      {
        name: "ReputeX Score",
        logo: Reputex,
        logoDark: Reputex,
        description:
          "Users can easily access their reputation scores by connecting their Web3 wallet to the ReputeX platform via the web app. Once connected, you can view and monitor your reputation score and take proactive measures to enhance it.",
        portal: "0xdb5b4874c0948a5a7a1bf7f68708f60c274a8a47",
        schema: "0xc51f34fd0d447bb8df012a3e48750a2fef499117a75988d80d098318e8c47b7e",
        url: "https://reputex.io/verax",
        chainId: "0xe708",
      },
    ],
  },
];
