import { Address, Hash } from "viem";
import { Module_filter, Module_orderBy } from "../../.graphclient";
import { AttestationPayload, Module } from "../types";
import { handleError } from "../utils/errorHandler";
import BaseDataMapper from "./BaseDataMapper";
import { abiModuleRegistry } from "../abi/ModuleRegistry";

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
    return await this.executeTransaction(request);
  }

  async simulateRegister(name: string, description: string, moduleAddress: Address) {
    return await this.simulateContract("register", [name, description, moduleAddress]);
  }

  async register(name: string, description: string, moduleAddress: Address) {
    const request = await this.simulateRegister(name, description, moduleAddress);
    return await this.executeTransaction(request);
  }

  async simulateRunModules(
    modulesAddresses: Address[],
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    value: number,
  ) {
    return await this.simulateContract("runModules", [modulesAddresses, attestationPayload, validationPayloads, value]);
  }

  async runModules(
    modulesAddresses: Address[],
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    value: number,
  ) {
    const request = await this.simulateRunModules(modulesAddresses, attestationPayload, validationPayloads, value);
    return await this.executeTransaction(request);
  }

  async simulateBulkRunModules(
    modulesAddresses: Address[],
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    value: number,
  ) {
    return await this.simulateContract("bulkRunModules", [
      modulesAddresses,
      attestationPayloads,
      validationPayloads,
      value,
    ]);
  }

  async bulkRunModules(
    modulesAddresses: Address[],
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    value: number,
  ) {
    const request = await this.simulateBulkRunModules(modulesAddresses, attestationPayloads, validationPayloads, value);
    return await this.executeTransaction(request);
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

  // TODO: Use correct type for args
  private async executeReadMethod(functionName: string, args: unknown[]) {
    return await this.web3Client.readContract({
      abi: abiModuleRegistry,
      address: this.conf.moduleRegistryAddress,
      functionName,
      args,
    });
  }

  // TODO: Use correct type for args
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
