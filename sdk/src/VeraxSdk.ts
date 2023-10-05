import { linea, lineaTestnet } from "viem/chains";
import AttestationDataMapper from "./dataMapper/AttestationDataMapper";
import SchemaDataMapper from "./dataMapper/SchemaDataMapper";
import ModuleDataMapper from "./dataMapper/ModuleDataMapper";
import PortalDataMapper from "./dataMapper/PortalDataMapper";
import { createPublicClient, http, PublicClient } from "viem";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { Conf } from "./types";
import UtilsDataMapper from "./dataMapper/UtilsDataMapper";

export default class VeraxSdk {
  static DEFAULT_LINEA_MAINNET: Conf = {
    chain: linea,
    subgraphUrl: "https://graph-query.linea.build/subgraphs/name/Consensys/linea-attestation-registry",
    portalRegistryAddress: "0xd5d61e4ECDf6d46A63BfdC262af92544DFc19083",
    moduleRegistryAddress: "0xf851513A732996F22542226341748f3C9978438f",
    schemaRegistryAddress: "0x0f95dCec4c7a93F2637eb13b655F2223ea036B59",
    attestationRegistryAddress: "0x3de3893aa4Cdea029e84e75223a152FD08315138",
  };

  static DEFAULT_LINEA_TESTNET: Conf = {
    chain: lineaTestnet,
    subgraphUrl: "https://graph-query.goerli.linea.build/subgraphs/name/Consensys/linea-attestation-registry",
    portalRegistryAddress: "0x506f88a5Ca8D5F001f2909b029738A40042e42a6",
    moduleRegistryAddress: "0x1a20b2CFA134686306436D2c9f778D7eC6c43A43",
    schemaRegistryAddress: "0xB2c4Da1f8F08A0CA25862509E5431289BE2b598B",
    attestationRegistryAddress: "0xC765F28096F6121C2F2b82D35A4346280164428b",
  };

  private readonly web3Client: PublicClient;
  private readonly apolloClient: ApolloClient<object>;

  public attestation: AttestationDataMapper;
  public schema: SchemaDataMapper;
  public module: ModuleDataMapper;
  public portal: PortalDataMapper;
  public utils: UtilsDataMapper;

  constructor(conf: Conf) {
    this.web3Client = createPublicClient({
      chain: conf.chain,
      transport: http(),
    });

    this.apolloClient = new ApolloClient({
      uri: conf.subgraphUrl,
      cache: new InMemoryCache(),
    });

    this.attestation = new AttestationDataMapper(conf, this.web3Client, this.apolloClient);
    this.schema = new SchemaDataMapper(conf, this.web3Client, this.apolloClient);
    this.module = new ModuleDataMapper(conf, this.web3Client, this.apolloClient);
    this.portal = new PortalDataMapper(conf, this.web3Client, this.apolloClient);
    this.utils = new UtilsDataMapper(conf, this.web3Client, this.apolloClient);
  }
}
