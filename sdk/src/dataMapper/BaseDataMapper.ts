import { PublicClient, WalletClient } from "viem";
import { ChainName, Conf, CrossChainClient } from "../types";
import { OrderDirection } from "../../.graphclient";
import { VeraxSdk } from "../VeraxSdk";
import { stringifyWhereClause, subgraphCall } from "../utils/graphClientHelper";
import { getCustomGraphSDKForChains } from "../utils/graphClientBuilder";
import { getSDKForChains } from "../utils/meshInstanceManager";
import { getConfiguredSubgraphUrl } from "../utils/urlResolver";
import { NetworkType, inferNetworkType } from "../utils/networkTypeUtils";

export default abstract class BaseDataMapper<T, TFilter, TOrder> {
  protected readonly conf: Conf;
  protected readonly web3Client: PublicClient;
  protected readonly walletClient: WalletClient | undefined;
  protected readonly veraxSdk: VeraxSdk;
  protected abstract typeName: string;
  protected abstract gqlInterface: string;

  /**
   * Cache of cross-chain clients keyed by network type.
   * Maintains separate clients for mainnet and testnet to prevent cache pollution.
   */
  private crossChainClients: Map<NetworkType, Promise<CrossChainClient>> = new Map();

  constructor(_conf: Conf, _web3Client: PublicClient, _veraxSdk: VeraxSdk, _walletClient?: WalletClient) {
    this.conf = _conf;
    this.web3Client = _web3Client;
    this.veraxSdk = _veraxSdk;
    this.walletClient = _walletClient;
  }

  /**
   * Gets a cross-chain client for the specified chain names.
   * Automatically infers the network type (mainnet/testnet) and returns
   * an appropriately isolated client to prevent cache pollution.
   *
   * @param chainNames - Array of chain names to query
   * @returns Promise resolving to a CrossChainClient
   * @throws Error if chain names mix mainnet and testnet
   */
  protected async getCrossChainClient(chainNames: (ChainName | string)[]): Promise<CrossChainClient> {
    const networkType = inferNetworkType(chainNames);

    // Check if we have a cached client for this network type
    let clientPromise = this.crossChainClients.get(networkType);

    if (!clientPromise) {
      // Create new client with proper isolation
      if (this.conf.subgraphUrlOverrides) {
        // Use custom SDK builder with URL overrides
        clientPromise = getCustomGraphSDKForChains(chainNames, this.conf.subgraphUrlOverrides);
      } else {
        // Use standard SDK with network-type isolation
        clientPromise = getSDKForChains(chainNames);
      }

      this.crossChainClients.set(networkType, clientPromise);
    }

    return clientPromise;
  }

  async findOneById(id: string) {
    const query = `query get_${this.typeName} { ${this.typeName}(id: "${id}") ${this.gqlInterface} }`;

    const subgraphUrl = getConfiguredSubgraphUrl(this.conf);
    const { data, status } = await subgraphCall(query, subgraphUrl);

    if (status != 200) {
      throw new Error(`Error(s) while fetching ${this.typeName}`);
    }

    return data?.data ? (data.data[`${this.typeName}`] as T) : undefined;
  }

  async findBy(first?: number, skip?: number, where?: TFilter, orderBy?: TOrder, orderDirection?: OrderDirection) {
    const query = `
        query get_${this.typeName}s{
          ${this.typeName}s(
            first: ${first || 100}
            skip: ${skip || 0}
            where: ${where ? stringifyWhereClause(where) : null}
            orderBy: ${orderBy || null}
            orderDirection: ${orderDirection || null}
          )
          ${this.gqlInterface}
        }
    `;

    const subgraphUrl = getConfiguredSubgraphUrl(this.conf);
    const { data, status } = await subgraphCall(query, subgraphUrl);

    if (status != 200) {
      throw new Error(`Error(s) while fetching ${this.typeName}s`);
    }

    return data?.data ? (data.data[`${this.typeName}s`] as T[]) : [];
  }

  async findTotalCount() {
    const query = `query get_${this.typeName}_Counter { counters { ${this.typeName}s } }`;

    const subgraphUrl = getConfiguredSubgraphUrl(this.conf);
    const { data, status } = await subgraphCall(query, subgraphUrl);

    if (status != 200) {
      throw new Error(`Error(s) while fetching total count of ${this.typeName}s`);
    }

    return data?.data ? data.data["counters"][0][`${this.typeName}s`] : 0;
  }
}
