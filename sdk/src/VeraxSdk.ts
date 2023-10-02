import { linea, lineaTestnet } from "viem/chains";
import Conf from "./interface/Conf";
import AttestationDataMapper from "./dataMapper/AttestationDataMapper";
import SchemaDataMapper from "./dataMapper/SchemaDataMapper";
import ModuleDataMapper from "./dataMapper/ModuleDataMapper";
import PortalDataMapper from "./dataMapper/PortalDataMapper";
import { createPublicClient, http, PublicClient } from "viem";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";

export default class VeraxSdk {
  static DEFAULT_LINEA_MAINNET: Conf = {
    chain: linea,
    subgraphUrl: "https://graph-query.linea.build/subgraphs/name/Consensys/linea-attestation-registry",
    portalRegistryAddress: "foo",
    moduleRegistryAddress: "foo",
    schemaRegistryAddress: "foo",
    attestationRegistryAddress: "bar",
  };

  static DEFAULT_LINEA_TESTNET: Conf = {
    chain: lineaTestnet,
    subgraphUrl: "https://graph-query.goerli.linea.build/subgraphs/name/Consensys/linea-attestation-registry",
    portalRegistryAddress: "bar",
    moduleRegistryAddress: "bar",
    schemaRegistryAddress: "bar",
    attestationRegistryAddress: "bar",
  };

  private readonly web3Client: PublicClient;
  private readonly apolloClient: ApolloClient<any>;

  public attestationDataMapper: AttestationDataMapper;
  public schemaDataMapper: SchemaDataMapper;
  public moduleDataMapper: ModuleDataMapper;
  public portalDataMapper: PortalDataMapper;

  constructor(conf: Conf) {
    this.web3Client = createPublicClient({
      chain: conf.chain,
      transport: http(),
    });

    this.apolloClient = new ApolloClient({
      uri: conf.subgraphUrl,
      cache: new InMemoryCache(),
    });

    this.attestationDataMapper = new AttestationDataMapper(conf, this.web3Client, this.apolloClient);
    this.schemaDataMapper = new SchemaDataMapper(conf, this.web3Client, this.apolloClient);
    this.moduleDataMapper = new ModuleDataMapper(conf, this.web3Client, this.apolloClient);
    this.portalDataMapper = new PortalDataMapper(conf, this.web3Client, this.apolloClient);
  }
}
