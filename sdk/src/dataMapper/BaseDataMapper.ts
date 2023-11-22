import { PublicClient, WalletClient } from "viem";
import { Conf } from "../types";
import { OrderDirection } from "../../.graphclient";
import { VeraxSdk } from "../VeraxSdk";
import { stringifyWhereClause } from "../utils/graphClientHelper";
import axios from "axios";

export default abstract class BaseDataMapper<T, TFilter, TOrder> {
  protected readonly conf: Conf;
  protected readonly web3Client: PublicClient;
  protected readonly walletClient: WalletClient;
  protected readonly veraxSdk: VeraxSdk;
  protected abstract typeName: string;
  protected abstract gqlInterface: string;

  constructor(_conf: Conf, _web3Client: PublicClient, _walletClient: WalletClient, _veraxSdk: VeraxSdk) {
    this.conf = _conf;
    this.web3Client = _web3Client;
    this.walletClient = _walletClient;
    this.veraxSdk = _veraxSdk;
  }

  async findOneById(id: string) {
    const query = `query get_${this.typeName} { ${this.typeName}(id: "${id}") ${this.gqlInterface} }`;

    const { data, status } = await this.subgraphCall(query);

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

    const { data, status } = await this.subgraphCall(query);

    if (status != 200) {
      throw new Error(`Error(s) while fetching ${this.typeName}s`);
    }

    return data?.data ? (data.data[`${this.typeName}s`] as T[]) : [];
  }

  async subgraphCall(query: string) {
    return axios.post(
      this.conf.subgraphUrl,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
  }
}
