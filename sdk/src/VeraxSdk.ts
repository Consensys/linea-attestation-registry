import { arbitrum, arbitrumGoerli, linea, lineaTestnet } from "viem/chains";
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
    subgraphUrl: "https://graph-query.goerli.linea.build/subgraphs/name/Consensys/linea-attestation-registry",
    portalRegistryAddress: "0x506f88a5Ca8D5F001f2909b029738A40042e42a6",
    moduleRegistryAddress: "0x1a20b2CFA134686306436D2c9f778D7eC6c43A43",
    schemaRegistryAddress: "0xB2c4Da1f8F08A0CA25862509E5431289BE2b598B",
    attestationRegistryAddress: "0xC765F28096F6121C2F2b82D35A4346280164428b",
  };

  static DEFAULT_LINEA_TESTNET_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_LINEA_TESTNET,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_ARBITRUM_TESTNET: Conf = {
    chain: arbitrumGoerli,
    mode: SDKMode.BACKEND,
    subgraphUrl: "ADD_SUBGRAPH_URL_HERE",
    portalRegistryAddress: "0x7d6a914C1e33C141CB4a5e0095c1075E5649aFB2",
    moduleRegistryAddress: "0x58EE79284bE65b217Db408A0991314f9Ae84348A",
    schemaRegistryAddress: "0x129043e80e0B4C7da61a622df0912c31D3414AA7",
    attestationRegistryAddress: "0xCD839595FdA5A8111d5E03D42d9D9af60ee67B66",
  };

  static DEFAULT_ARBITRUM_TESTNET_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_ARBITRUM_TESTNET,
    mode: SDKMode.FRONTEND,
  };

  static DEFAULT_ARBITRUM: Conf = {
    chain: arbitrum,
    mode: SDKMode.BACKEND,
    subgraphUrl: "ADD_SUBGRAPH_URL_HERE",
    portalRegistryAddress: "0x4042D0A54f997EE3a1b0F51e4813654199BFd8bD",
    moduleRegistryAddress: "0x3acF4daAB6cbc01546Dd4a96c9665B398d48A4ba",
    schemaRegistryAddress: "0xE96072F46EA0e42e538762dDc0aFa4ED8AE6Ec27",
    attestationRegistryAddress: "0x335E9719e8eFE2a19A92E07BC4836160fC31cd7C",
  };

  static DEFAULT_ARBITRUM_FRONTEND: Conf = {
    ...VeraxSdk.DEFAULT_ARBITRUM,
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
