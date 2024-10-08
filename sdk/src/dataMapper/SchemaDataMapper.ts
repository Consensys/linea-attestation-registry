import { Address, TransactionReceipt } from "viem";
import { MultichainSchemasQueryQuery, OrderDirection, Schema_filter, Schema_orderBy } from "../../.graphclient";
import { ChainName, Schema } from "../types";
import { ActionType } from "../utils/constants";
import BaseDataMapper from "./BaseDataMapper";
import { abiSchemaRegistry } from "../abi/SchemaRegistry";
import { executeTransaction } from "../utils/transactionSender";
import { handleError } from "../utils/errorHandler";

export default class SchemaDataMapper extends BaseDataMapper<Schema, Schema_filter, Schema_orderBy> {
  typeName = "schema";
  gqlInterface = `{
        id
        name
        description
        context
        schema
        attestationCounter
  }`;

  async findByMultiChain(
    chainNames: ChainName[],
    first?: number,
    skip?: number,
    where?: Schema_filter,
    orderBy?: Schema_orderBy,
    orderDirection?: OrderDirection,
  ) {
    const schemasResult = await this.crossChainClient.MultichainSchemasQuery({
      chainNames: chainNames,
      first: first,
      skip: skip,
      where: where,
      orderBy: orderBy,
      orderDirection: orderDirection,
    });

    const schemas: Schema[] = this.mapToSchemas(schemasResult);

    return schemas;
  }

  private mapToSchemas(schemasResult: MultichainSchemasQueryQuery): Schema[] {
    return schemasResult.multichainSchemas.map((pickSchema) => ({
      id: pickSchema.id,
      chainName: pickSchema.chainName || "",
      name: pickSchema.name,
      description: pickSchema.description,
      context: pickSchema.context,
      schema: pickSchema.schema,
      attestationCounter: pickSchema.attestationCounter || 0,
    }));
  }

  async simulateUpdateRouter(routerAddress: Address) {
    return this.simulateContract("updateRouter", [routerAddress]);
  }

  async updateRouter(
    routerAddress: Address,
    waitForConfirmation: boolean = false,
  ): Promise<Partial<TransactionReceipt>> {
    const request = await this.simulateUpdateRouter(routerAddress);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateCreate(name: string, description: string, context: string, schemaString: string) {
    return this.simulateContract("createSchema", [name, description, context, schemaString]);
  }

  async create(
    name: string,
    description: string,
    context: string,
    schemaString: string,
    waitForConfirmation: boolean = false,
  ) {
    const request = await this.simulateCreate(name, description, context, schemaString);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateUpdateContext(schemaId: string, context: string) {
    return this.simulateContract("updateContext", [schemaId, context]);
  }

  async updateContext(schemaId: string, context: string, waitForConfirmation: boolean = false) {
    const request = await this.simulateUpdateContext(schemaId, context);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async getIdFromSchemaString(schema: string) {
    return this.executeReadMethod("getIdFromSchemaString", [schema]);
  }

  async getSchema(schemaId: string) {
    return this.executeReadMethod("getSchema", [schemaId]);
  }

  async getSchemasNumber() {
    return this.executeReadMethod("getSchemasNumber", []);
  }

  async isRegistered(schemaId: string) {
    return this.executeReadMethod("isRegistered", [schemaId]);
  }

  async getSchemaIds(index: number) {
    return this.executeReadMethod("schemaIds", [index]);
  }

  private async executeReadMethod(functionName: string, args: unknown[]) {
    return this.web3Client.readContract({
      abi: abiSchemaRegistry,
      address: this.conf.schemaRegistryAddress,
      functionName,
      args,
    });
  }

  private async simulateContract(functionName: string, args: unknown[]) {
    if (!this.walletClient) throw new Error("VeraxSDK - Wallet not available");
    try {
      const { request } = await this.web3Client.simulateContract({
        address: this.conf.schemaRegistryAddress,
        abi: abiSchemaRegistry,
        functionName,
        account: this.walletClient.account,
        args,
      });

      return request;
    } catch (err) {
      handleError(ActionType.Simulation, err);
    }
  }
}
