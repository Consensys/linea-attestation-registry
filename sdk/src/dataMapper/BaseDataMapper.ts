import { PublicClient } from "viem";
import { ApolloClient, gql } from "@apollo/client/core";
import { Conf } from "../types";

export default abstract class BaseDataMapper {
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

  async find(id: string) {
    const queryResult = await this.apolloClient.query({
      query: gql(`query GetOne($id: ID!) { ${this.typeName}(id: $id) ${this.gqlInterface} }`),
      variables: { id },
    });

    return JSON.stringify(queryResult.data[this.typeName]);
  }

  async findBy() {
    const queryResult = await this.apolloClient.query({
      query: gql(`query GetBy { ${this.typeName}s ${this.gqlInterface} }`),
    });

    return JSON.stringify(queryResult.data[`${this.typeName}s`]);
  }
}
