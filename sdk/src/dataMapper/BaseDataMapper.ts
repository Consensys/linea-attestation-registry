import { PublicClient, WalletClient } from "viem";
import { Conf, Schema } from "../types";
import { OrderDirection } from "../../.graphclient";
import { stringifyWhereClause, subgraphCall } from "../utils/graphClientHelper";

export default abstract class BaseDataMapper<T, TFilter, TOrder> {
  protected readonly conf: Conf;
  protected readonly web3Client: PublicClient;
  protected readonly walletClient: WalletClient | undefined;
  protected readonly findOneSchemaById: ((id: string) => Promise<Schema | undefined>) | undefined;
  protected abstract typeName: string;
  protected abstract gqlInterface: string;

  constructor(
    _conf: Conf,
    _web3Client: PublicClient,
    _walletClient?: WalletClient,
    _findOneSchemaById?: (id: string) => Promise<Schema | undefined>,
  ) {
    this.conf = _conf;
    this.web3Client = _web3Client;
    this.walletClient = _walletClient;
    this.findOneSchemaById = _findOneSchemaById;
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

  async findTotalCount() {
    const query = `query get_${this.typeName}_Counter { counters { ${this.typeName}s } }`;

    const { data, status } = await subgraphCall(query, this.conf.subgraphUrl);

    if (status != 200) {
      throw new Error(`Error(s) while fetching total count of ${this.typeName}s`);
    }

    return data?.data ? data.data["counters"][0][`${this.typeName}s`] : 0;
  }
}
