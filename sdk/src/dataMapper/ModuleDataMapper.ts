import { Address } from "viem";
import { Module_filter, Module_orderBy } from "../../.graphclient";
import { AttestationPayload, Module } from "../types";
import { ActionType } from "../utils/constants";
import BaseDataMapper from "./BaseDataMapper";
import { abiModuleRegistry } from "../abi/ModuleRegistry";
import { handleError } from "../utils/errorHandler";
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

  async updateRouter(routerAddress: Address, waitForConfirmation: boolean = false) {
    const request = await this.simulateUpdateRouter(routerAddress);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateRegister(name: string, description: string, moduleAddress: Address) {
    return await this.simulateContract("register", [name, description, moduleAddress]);
  }

  async register(name: string, description: string, moduleAddress: Address, waitForConfirmation: boolean = false) {
    const request = await this.simulateRegister(name, description, moduleAddress);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
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
    waitForConfirmation: boolean = false,
  ) {
    const request = await this.simulateRunModules(modulesAddresses, attestationPayload, validationPayloads, value);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
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
    waitForConfirmation: boolean = false,
  ) {
    const request = await this.simulateBulkRunModules(modulesAddresses, attestationPayloads, validationPayloads);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async isContractAddress(contractAddress: Address) {
    return await this.executeReadMethod("isContractAddress", [contractAddress]);
  }

  async getModulesNumber() {
    return await super.findTotalCount();
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
    if (!this.walletClient) throw new Error("VeraxSDK - Wallet not available");
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
      handleError(ActionType.Simulation, err);
    }
  }
}
