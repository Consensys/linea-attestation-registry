import { Address, Hash } from "viem";
import { Schema_filter, Schema_orderBy } from "../../.graphclient";
import { Schema } from "../types";
import { handleError } from "../utils/errorHandler";
import BaseDataMapper from "./BaseDataMapper";
import { abiSchemaRegistry } from "../abi/SchemaRegistry";

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
    return await this.simulateContract("updateRouter", [routerAddress]);
  }

  async updateRouter(routerAddress: Address) {
    const request = await this.simulateUpdateRouter(routerAddress);
    return await this.executeTransaction(request);
  }

  async simulateCreate(name: string, description: string, context: string, schemaString: string) {
    return await this.simulateContract("createSchema", [name, description, context, schemaString]);
  }

  async create(name: string, description: string, context: string, schemaString: string) {
    const request = await this.simulateCreate(name, description, context, schemaString);
    return await this.executeTransaction(request);
  }

  async simulateUpdateContext(schemaId: string, context: string) {
    return await this.simulateContract("updateContext", [schemaId, context]);
  }

  async updateContext(schemaId: string, context: string) {
    const request = await this.simulateUpdateContext(schemaId, context);
    return await this.executeTransaction(request);
  }

  async getIdFromSchemaString(schema: string) {
    return await this.executeReadMethod("getIdFromSchemaString", [schema]);
  }

  async getSchema(schemaId: string) {
    return await this.executeReadMethod("getSchema", [schemaId]);
  }

  async getSchemasNumber() {
    return await this.executeReadMethod("getSchemasNumber", []);
  }

  async isRegistered(schemaId: string) {
    return await this.executeReadMethod("isRegistered", [schemaId]);
  }

  async getSchemaIds(index: number) {
    return await this.executeReadMethod("schemaIds", [index]);
  }

  // TODO: Use correct type for args
  private async executeReadMethod(functionName: string, args: unknown[]) {
    return await this.web3Client.readContract({
      abi: abiSchemaRegistry,
      address: this.conf.schemaRegistryAddress,
      functionName,
      args,
    });
  }

  // TODO: Use correct type for args
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
      handleError(err);
    }
  }

  // TODO: Use correct type for request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async executeTransaction(request: any) {
    const hash: Hash = await this.walletClient.writeContract(request);
    console.log(`Transaction sent with hash ${hash}`);
    return hash;
  }
}
