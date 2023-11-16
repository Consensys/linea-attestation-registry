import { Address } from "viem";
import { Module_filter, Module_orderBy } from "../../.graphclient";
import { AttestationPayload, Module } from "../types";
import BaseDataMapper from "./BaseDataMapper";
import { abiModuleRegistry } from "../abi/ModuleRegistry";
import { handleSimulationError } from "../utils/simulationErrorHandler";
import { executeTransaction } from "../utils/transactionSender";
import { encode } from "../utils/abiCoder";

export default class ModuleDataMapper extends BaseDataMapper<Module, Module_filter, Module_orderBy> {
  typeName = "module";
  gqlInterface = `{
        id
        moduleAddress
        name
        description
  }`;

  async simulateUpdateRouter(routerAddress: Address) {
    return await this.simulateContract("updateRouter", [routerAddress]);
  }

  async updateRouter(routerAddress: Address) {
    const request = await this.simulateUpdateRouter(routerAddress);
    return await executeTransaction(this.walletClient, request);
  }

  async simulateRegister(name: string, description: string, moduleAddress: Address) {
    return await this.simulateContract("register", [name, description, moduleAddress]);
  }

  async register(name: string, description: string, moduleAddress: Address) {
    const request = await this.simulateRegister(name, description, moduleAddress);
    return await executeTransaction(this.walletClient, request);
  }

  async simulateRunModules(
    modulesAddresses: Address[],
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    value: number,
  ) {
    const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
    if (!matchingSchema) {
      throw new Error("No matching Schema");
    }
    const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);
    return this.simulateContract("runModules", [
      modulesAddresses,
      [attestationPayload.schemaId, attestationPayload.expirationDate, attestationPayload.subject, attestationData],
      validationPayloads,
      `0x${value}`,
    ]);
  }

  async runModules(
    modulesAddresses: Address[],
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    value: number,
  ) {
    const request = await this.simulateRunModules(modulesAddresses, attestationPayload, validationPayloads, value);
    return await executeTransaction(this.walletClient, request);
  }

  async simulateBulkRunModules(
    modulesAddresses: Address[],
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
  ) {
    const attestationPayloadsArg = [];

    for (const attestationPayload of attestationPayloads) {
      const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
      if (!matchingSchema) {
        throw new Error("No matching Schema");
      }
      const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);
      attestationPayloadsArg.push([
        attestationPayload.schemaId,
        attestationPayload.expirationDate,
        attestationPayload.subject,
        attestationData,
      ]);
    }
    return await this.simulateContract("bulkRunModules", [
      modulesAddresses,
      attestationPayloadsArg,
      validationPayloads,
    ]);
  }

  async bulkRunModules(
    modulesAddresses: Address[],
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
  ) {
    const request = await this.simulateBulkRunModules(modulesAddresses, attestationPayloads, validationPayloads);
    return await executeTransaction(this.walletClient, request);
  }

  async isContractAddress(contractAddress: Address) {
    return await this.executeReadMethod("isContractAddress", [contractAddress]);
  }

  async getModulesNumber() {
    return await this.executeReadMethod("getModulesNumber", []);
  }

  async isRegistered(moduleAddress: Address) {
    return await this.executeReadMethod("isRegistered", [moduleAddress]);
  }

  async getModuleAddress(index: number) {
    return await this.executeReadMethod("moduleAddresses", [index]);
  }

  async getModule(moduleAddress: Address) {
    return await this.executeReadMethod("modules", [moduleAddress]);
  }

  private async executeReadMethod(functionName: string, args: unknown[]) {
    return await this.web3Client.readContract({
      abi: abiModuleRegistry,
      address: this.conf.moduleRegistryAddress,
      functionName,
      args,
    });
  }

  private async simulateContract(functionName: string, args: unknown[]) {
    try {
      const { request } = await this.web3Client.simulateContract({
        address: this.conf.moduleRegistryAddress,
        abi: abiModuleRegistry,
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
