import { Address } from "viem";
import { Schema_filter, Schema_orderBy } from "../../.graphclient";
import { Schema } from "../types";
import BaseDataMapper from "./BaseDataMapper";
import { abiSchemaRegistry } from "../abi/SchemaRegistry";
import { executeTransaction } from "../utils/transactionSender";
import { handleSimulationError } from "../utils/simulationErrorHandler";

export default class SchemaDataMapper extends BaseDataMapper<Schema, Schema_filter, Schema_orderBy> {
  typeName = "schema";
  gqlInterface = `{
        id
        name
        description
        context
        schema
  }`;

  async simulateUpdateRouter(routerAddress: Address) {
    return this.simulateContract("updateRouter", [routerAddress]);
  }

  async updateRouter(routerAddress: Address) {
    const request = await this.simulateUpdateRouter(routerAddress);
    return executeTransaction(this.walletClient, request);
  }

  async simulateCreate(name: string, description: string, context: string, schemaString: string) {
    return this.simulateContract("createSchema", [name, description, context, schemaString]);
  }

  async create(name: string, description: string, context: string, schemaString: string) {
    const request = await this.simulateCreate(name, description, context, schemaString);
    return executeTransaction(this.walletClient, request);
  }

  async simulateUpdateContext(schemaId: string, context: string) {
    return this.simulateContract("updateContext", [schemaId, context]);
  }

  async updateContext(schemaId: string, context: string) {
    const request = await this.simulateUpdateContext(schemaId, context);
    return executeTransaction(this.walletClient, request);
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
      handleSimulationError(err);
    }
  }
}
