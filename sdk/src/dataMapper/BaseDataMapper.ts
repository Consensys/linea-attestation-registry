import { PublicClient } from "viem";
import { ApolloClient, gql } from "@apollo/client/core";
import { Conf, FilterMap } from "../types";
import { stringifyWhereClause } from "../utils/apolloClientHelper";

export default abstract class BaseDataMapper<T> {
  protected readonly conf: Conf;
  protected readonly web3Client: PublicClient;
  protected readonly apolloClient: ApolloClient<object>;
  protected abstract typeName: string;
  protected abstract gqlInterface: string;

  constructor(_conf: Conf, _web3Client: PublicClient, _apolloClient: ApolloClient<object>) {
    this.conf = _conf;
    this.web3Client = _web3Client;
    this.apolloClient = _apolloClient;
  }

  async findOneById(id: string): Promise<T> {
    const queryResult = await this.apolloClient.query<T>({
      query: gql(`query GetOne($id: ID!) { ${this.typeName}(id: $id) ${this.gqlInterface} }`),
      variables: { id },
    });

    return queryResult.data;
  }

  async findBy<T extends keyof FilterMap>(whereClause: Partial<FilterMap[T]>) {
    const queryResult = await this.apolloClient.query<Array<T>>({
      query: gql(`query GetBy { ${this.typeName}s(where: ${stringifyWhereClause(whereClause)}) ${this.gqlInterface} }`),
    });

    return queryResult.data;
  }
}
