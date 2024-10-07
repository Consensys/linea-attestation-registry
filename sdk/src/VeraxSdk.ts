import {
  arbitrum,
  arbitrumNova,
  arbitrumSepolia,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  linea,
  lineaSepolia,
} from "viem/chains";
import AttestationDataMapper from "./dataMapper/AttestationDataMapper";
import SchemaDataMapper from "./dataMapper/SchemaDataMapper";
import ModuleDataMapper from "./dataMapper/ModuleDataMapper";
import PortalDataMapper from "./dataMapper/PortalDataMapper";
import { Address, createPublicClient, createWalletClient, custom, Hex, http, PublicClient, WalletClient } from "viem";
import UtilsDataMapper from "./dataMapper/UtilsDataMapper";
import { privateKeyToAccount } from "viem/accounts";
import { Conf } from "./types";
import { SDKMode } from "./utils/constants";

export * from "./types";
export * from "./utils/constants";

export class VeraxSdk {
  static DEFAULT_LINEA_MAINNET: Conf = {
    chain: linea,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.studio.thegraph.com/query/67521/verax-v2-linea/v0.0.1",
    // Backup URL: subgraphUrl: "https://api.goldsky.com/api/public/project_clxx488osyuf501vygg71f86w/subgraphs/verax-v2-linea/0.0.1/gn",
    portalRegistryAddress: "0xd5d61e4ECDf6d46A63BfdC262af92544DFc19083",
    moduleRegistryAddress: "0xf851513A732996F22542226341748f3C9978438f",
    schemaRegistryAddress: "0x0f95dCec4c7a93F2637eb13b655F2223ea036B59",
    attestationRegistryAddress: "0x3de3893aa4Cdea029e84e75223a152FD08315138",
  };

  static DEFAULT_LINEA_MAINNET_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_LINEA_MAINNET,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_ARBITRUM_NOVA: Conf = {
    chain: arbitrumNova,
    mode: SDKMode.BACKEND,
    subgraphUrl:
      "https://api.goldsky.com/api/public/project_cm06hsedxpgls01xm39r67el8/subgraphs/verax-v2-arbitrum-nova/0.0.1/gn",
    portalRegistryAddress: "0xADc8da3d3388dEe74C7134fC4AEe1cF866Da5d38",
    moduleRegistryAddress: "0x46F7471cd2C1d69Cb5e62c1a34F3fCAf81304Fc3",
    schemaRegistryAddress: "0x9b5BABcEbf0E8550da1eCDe5674783179B6557FB",
    attestationRegistryAddress: "0xB9Cf26ED827Eb4A7079e8dedB0ea93D932A2e3e8",
  };

  static DEFAULT_ARBITRUM_NOVA_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_ARBITRUM_NOVA,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_LINEA_SEPOLIA: Conf = {
    chain: lineaSepolia,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.studio.thegraph.com/query/67521/verax-v2-linea-sepolia/v0.0.2",
    portalRegistryAddress: "0xF35fe79104e157703dbCC3Baa72a81A99591744D",
    moduleRegistryAddress: "0x3C443B9f0c8ed3A3270De7A4815487BA3223C2Fa",
    schemaRegistryAddress: "0x90b8542d7288a83EC887229A7C727989C3b56209",
    attestationRegistryAddress: "0xDaf3C3632327343f7df0Baad2dc9144fa4e1001F",
  };

  static DEFAULT_LINEA_SEPOLIA_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_LINEA_SEPOLIA,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_ARBITRUM_SEPOLIA: Conf = {
    chain: arbitrumSepolia,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.studio.thegraph.com/query/67521/verax-v2-arbitrum-sepolia/v0.0.2",
    portalRegistryAddress: "0x1ceb52584B6C45C7049dc7fDC476bC138E4beaDE",
    moduleRegistryAddress: "0xEC572277d4E87a64DcfA774ED219Dd4E69E4BDc6",
    schemaRegistryAddress: "0x025531b655D9EE335B8E6cc4C118b313f26ACc8F",
    attestationRegistryAddress: "0xee5e23492bf49C1F4CF0676b3bF49d78A6dD61c5",
  };

  static DEFAULT_ARBITRUM_SEPOLIA_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_ARBITRUM: Conf = {
    chain: arbitrum,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.studio.thegraph.com/query/67521/verax-v2-arbitrum/v0.0.2",
    portalRegistryAddress: "0x4042D0A54f997EE3a1b0F51e4813654199BFd8bD",
    moduleRegistryAddress: "0x3acF4daAB6cbc01546Dd4a96c9665B398d48A4ba",
    schemaRegistryAddress: "0xE96072F46EA0e42e538762dDc0aFa4ED8AE6Ec27",
    attestationRegistryAddress: "0x335E9719e8eFE2a19A92E07BC4836160fC31cd7C",
  };

  static DEFAULT_ARBITRUM_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_ARBITRUM,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_BASE_SEPOLIA: Conf = {
    chain: baseSepolia,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.studio.thegraph.com/query/67521/verax-v2-base-sepolia/v0.0.2",
    portalRegistryAddress: "0x025531b655D9EE335B8E6cc4C118b313f26ACc8F",
    moduleRegistryAddress: "0xEC572277d4E87a64DcfA774ED219Dd4E69E4BDc6",
    schemaRegistryAddress: "0x66D2F3DCc970343b83a6263E20832184fa71CFe7",
    attestationRegistryAddress: "0x374B686137eC0DB442a8d833451f8C12cD4B5De4",
  };

  static DEFAULT_BASE_SEPOLIA_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_BASE_SEPOLIA,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_BASE: Conf = {
    chain: base,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.studio.thegraph.com/query/67521/verax-v2-base/v0.0.1",
    portalRegistryAddress: "0xcbf28432C25B400E645F0EaC05F8954e8EE7c0d6",
    moduleRegistryAddress: "0xAd0C12db58098A6665CBEf48f60eB67d81d1F1ff",
    schemaRegistryAddress: "0x8081dCd745f160c148Eb5be510F78628A0951c31",
    attestationRegistryAddress: "0xA0080DBd35711faD39258E45d9A5D798852b05D4",
  };

  static DEFAULT_BASE_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_BASE,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_BSC_TESTNET: Conf = {
    chain: bscTestnet,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.studio.thegraph.com/query/67521/verax-v2-bsc-testnet/v0.0.1",
    portalRegistryAddress: "0xA4a7517F62216BD42e42a67dF09C25adc72A5897",
    moduleRegistryAddress: "0x6c46c245918d4fcfC13F0a9e2e49d4E2739A353a",
    schemaRegistryAddress: "0x51929da151eC2C5a5881C750E5b9941eACC46c1d",
    attestationRegistryAddress: "0x5Cc4029f0dDae1FFE527385459D06d81DFD50EEe",
  };

  static DEFAULT_BSC_TESTNET_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_BSC_TESTNET,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_BSC: Conf = {
    chain: bsc,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.studio.thegraph.com/query/67521/verax-v2-bsc/v0.0.1",
    portalRegistryAddress: "0xb2553A7E443DFA7C9dEc01D327FdDff1A5eF59b0",
    moduleRegistryAddress: "0xD70a06f7A0f197D55Fa841fcF668782b2B8266eB",
    schemaRegistryAddress: "0x29205492435E1b06B20CeAeEC4AC41bcF595DFFd",
    attestationRegistryAddress: "0x3D8A3a8FF21bD295dbBD5319C399e2C4FD27F261",
  };

  static DEFAULT_BSC_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_BSC,
    mode: SDKMode.FRONTEND,
  };

  private readonly web3Client: PublicClient;
  private readonly walletClient: WalletClient | undefined;

  public attestation: AttestationDataMapper;
  public schema: SchemaDataMapper;
  public module: ModuleDataMapper;
  public portal: PortalDataMapper;
  public utils: UtilsDataMapper;

  constructor(conf: Conf, publicAddress?: Address, privateKey?: Hex) {
    this.web3Client = createPublicClient({
      chain: conf.chain,
      transport: http(),
    });

    if (conf.mode === SDKMode.BACKEND) {
      this.walletClient = createWalletClient({
        chain: conf.chain,
        account: privateKey ? privateKeyToAccount(privateKey) : undefined,
        transport: http(),
      });
    } else if (typeof window.ethereum !== "undefined") {
      this.walletClient = createWalletClient({
        chain: conf.chain,
        account: publicAddress,
        transport: custom(window.ethereum),
      });
    }

    this.attestation = new AttestationDataMapper(conf, this.web3Client, this, this.walletClient);
    this.schema = new SchemaDataMapper(conf, this.web3Client, this, this.walletClient);
    this.module = new ModuleDataMapper(conf, this.web3Client, this, this.walletClient);
    this.portal = new PortalDataMapper(conf, this.web3Client, this, this.walletClient);
    this.utils = new UtilsDataMapper(conf, this.web3Client, this, this.walletClient);
  }
}
