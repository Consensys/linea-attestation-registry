import { PublicClient, WalletClient } from "viem";
import { ApolloClient, gql } from "@apollo/client/core";
import { Conf, FilterMap, QueryResult } from "../types";
import { stringifyWhereClause } from "../utils/apolloClientHelper";
import VeraxSdk from "../VeraxSdk";

export default abstract class BaseDataMapper<T> {
  protected readonly conf: Conf;
  protected readonly web3Client: PublicClient;
  protected readonly walletClient: WalletClient;
  protected readonly apolloClient: ApolloClient<object>;
  protected readonly veraxSdk: VeraxSdk;
  protected abstract typeName: string;
  protected abstract gqlInterface: string;

  constructor(
    _conf: Conf,
    _web3Client: PublicClient,
    _walletClient: WalletClient,
    _apolloClient: ApolloClient<object>,
    _veraxSdk: VeraxSdk,
  ) {
    this.conf = _conf;
    this.web3Client = _web3Client;
    this.walletClient = _walletClient;
    this.apolloClient = _apolloClient;
    this.veraxSdk = _veraxSdk;
  }

  async findOneById(id: string): Promise<T> {
    const queryResult = await this.apolloClient.query<QueryResult<T, typeof this.typeName>>({
      query: gql(`query GetOne($id: ID!) { ${this.typeName}(id: $id) ${this.gqlInterface} }`),
      variables: { id },
    });

    return queryResult.data[this.typeName];
  }

  async findBy<T extends keyof FilterMap>(whereClause: Partial<FilterMap[T]>) {
    const queryResult = await this.apolloClient.query<QueryResult<Array<T>, typeof this.typeName>>({
      query: gql(`query GetBy { ${this.typeName}s(where: ${stringifyWhereClause(whereClause)}) ${this.gqlInterface} }`),
    });

    return queryResult.data[`${this.typeName}s`];
  }
}
