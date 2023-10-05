import Conf from "./../interface/Conf";
import { findOneById } from "../AttestationRegistryWrapper";
import { PublicClient } from "viem";
import { ApolloClient } from "@apollo/client/core";

export default class BaseDataMapper {
  private conf: Conf;
  private web3Client: PublicClient;
  private apolloClient: ApolloClient<any>;

  constructor(_conf: Conf, _web3Client: PublicClient, _apolloClient: ApolloClient<any>) {
    this.conf = _conf;
    this.web3Client = _web3Client;
    this.apolloClient = _apolloClient;
  }

  findOneById(id: string): object {
    return findOneById(id);
  }
}
