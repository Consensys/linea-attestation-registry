import { PublicClient, WalletClient } from "viem";
import { Conf, CrossChainClient } from "../types";
import { getBuiltGraphSDK, OrderDirection } from "../../.graphclient";
import { VeraxSdk } from "../VeraxSdk";
import { stringifyWhereClause, subgraphCall } from "../utils/graphClientHelper";

export default abstract class BaseDataMapper<T, TFilter, TOrder> {
  protected readonly conf: Conf;
  protected readonly web3Client: PublicClient;
  protected readonly walletClient: WalletClient | undefined;
  protected readonly crossChainClient: CrossChainClient;
  protected readonly veraxSdk: VeraxSdk;
  protected abstract typeName: string;
  protected abstract gqlInterface: string;

  constructor(_conf: Conf, _web3Client: PublicClient, _veraxSdk: VeraxSdk, _walletClient?: WalletClient) {
    this.conf = _conf;
    this.web3Client = _web3Client;
    this.veraxSdk = _veraxSdk;
    this.walletClient = _walletClient;
    this.crossChainClient = getBuiltGraphSDK();
  }

  async findOneById(id: string) {
    const query = `query get_${this.typeName} { ${this.typeName}(id: "${id}") ${this.gqlInterface} }`;

    const { data, status } = await subgraphCall(query, this.conf.subgraphUrl);

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

    const { data, status } = await subgraphCall(query, this.conf.subgraphUrl);

    if (status != 200) {
      throw new Error(`Error(s) while fetching ${this.typeName}s`);
    }

    return data?.data ? (data.data[`${this.typeName}s`] as T[]) : [];
  }
}
