import {
  arbitrum,
  arbitrumGoerli,
  arbitrumNova,
  arbitrumSepolia,
  base,
  baseSepolia,
  linea,
  lineaSepolia,
  lineaTestnet,
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

export class VeraxSdk {
  static DEFAULT_LINEA_MAINNET: Conf = {
    chain: linea,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://graph-query.linea.build/subgraphs/name/Consensys/linea-attestation-registry",
    portalRegistryAddress: "0xd5d61e4ECDf6d46A63BfdC262af92544DFc19083",
    moduleRegistryAddress: "0xf851513A732996F22542226341748f3C9978438f",
    schemaRegistryAddress: "0x0f95dCec4c7a93F2637eb13b655F2223ea036B59",
    attestationRegistryAddress: "0x3de3893aa4Cdea029e84e75223a152FD08315138",
  };

  static DEFAULT_LINEA_MAINNET_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_LINEA_MAINNET,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_LINEA_TESTNET: Conf = {
    chain: lineaTestnet,
    mode: SDKMode.BACKEND,
    subgraphUrl:
      "https://api.goldsky.com/api/public/project_clqghnrbp9nx201wtgylv8748/subgraphs/verax/subgraph-testnet/gn",
    portalRegistryAddress: "0x506f88a5Ca8D5F001f2909b029738A40042e42a6",
    moduleRegistryAddress: "0x1a20b2CFA134686306436D2c9f778D7eC6c43A43",
    schemaRegistryAddress: "0xB2c4Da1f8F08A0CA25862509E5431289BE2b598B",
    attestationRegistryAddress: "0xC765F28096F6121C2F2b82D35A4346280164428b",
  };

  static DEFAULT_ARBITRUM_NOVA: Conf = {
    chain: arbitrumNova,
    mode: SDKMode.BACKEND,
    subgraphUrl:
      "https://api.goldsky.com/api/public/project_clr9aj9alwgwg01q7ci1rh781/subgraphs/verax-arbitrum-nova/0.0.5/gn",
    portalRegistryAddress: "0xADc8da3d3388dEe74C7134fC4AEe1cF866Da5d38",
    moduleRegistryAddress: "0x46F7471cd2C1d69Cb5e62c1a34F3fCAf81304Fc3",
    schemaRegistryAddress: "0x9b5BABcEbf0E8550da1eCDe5674783179B6557FB",
    attestationRegistryAddress: "0xB9Cf26ED827Eb4A7079e8dedB0ea93D932A2e3e8",
  };

  static DEFAULT_ARBITRUM_NOVA_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_ARBITRUM_NOVA,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_LINEA_TESTNET_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_LINEA_TESTNET,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_LINEA_SEPOLIA: Conf = {
    chain: lineaSepolia,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.studio.thegraph.com/query/67946/verax-v1-linea-sepolia/v0.0.1",
    portalRegistryAddress: "0xF35fe79104e157703dbCC3Baa72a81A99591744D",
    moduleRegistryAddress: "0x3C443B9f0c8ed3A3270De7A4815487BA3223C2Fa",
    schemaRegistryAddress: "0x90b8542d7288a83EC887229A7C727989C3b56209",
    attestationRegistryAddress: "0xDaf3C3632327343f7df0Baad2dc9144fa4e1001F",
  };

  static DEFAULT_LINEA_SEPOLIA_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_LINEA_SEPOLIA,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_ARBITRUM_TESTNET: Conf = {
    chain: arbitrumGoerli,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/cliqueofficial/verax-arbitrum-goerli",
    portalRegistryAddress: "0x7d6a914C1e33C141CB4a5e0095c1075E5649aFB2",
    moduleRegistryAddress: "0x58EE79284bE65b217Db408A0991314f9Ae84348A",
    schemaRegistryAddress: "0x129043e80e0B4C7da61a622df0912c31D3414AA7",
    attestationRegistryAddress: "0xCD839595FdA5A8111d5E03D42d9D9af60ee67B66",
  };

  static DEFAULT_ARBITRUM_TESTNET_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_ARBITRUM_TESTNET,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_ARBITRUM_SEPOLIA: Conf = {
    chain: arbitrumSepolia,
    mode: SDKMode.BACKEND,
    subgraphUrl: "https://api.studio.thegraph.com/query/67946/verax-arbitrum-sepolia/v0.0.2",
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
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/cliqueofficial/verax-arbitrum",
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
    subgraphUrl: "https://api.studio.thegraph.com/query/67946/verax-v1-base-sepolia/v0.0.1",
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
    subgraphUrl: "https://api.studio.thegraph.com/query/67946/verax-v1-base/v0.0.1",
    portalRegistryAddress: "0xcbf28432C25B400E645F0EaC05F8954e8EE7c0d6",
    moduleRegistryAddress: "0xAd0C12db58098A6665CBEf48f60eB67d81d1F1ff",
    schemaRegistryAddress: "0x8081dCd745f160c148Eb5be510F78628A0951c31",
    attestationRegistryAddress: "0xA0080DBd35711faD39258E45d9A5D798852b05D4",
  };

  static DEFAULT_BASE_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_BASE,
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
