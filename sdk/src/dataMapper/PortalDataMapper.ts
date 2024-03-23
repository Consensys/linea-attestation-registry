import { AttestationPayload, Portal } from "../types";
import BaseDataMapper from "./BaseDataMapper";
import { abiDefaultPortal } from "../abi/DefaultPortal";
import { Address } from "viem";
import { encode } from "../utils/abiCoder";
import { Portal_filter, Portal_orderBy } from "../../.graphclient";
import { abiPortalRegistry } from "../abi/PortalRegistry";
import { handleSimulationError } from "../utils/simulationErrorHandler";
import { executeTransaction } from "../utils/transactionSender";

export default class PortalDataMapper extends BaseDataMapper<Portal, Portal_filter, Portal_orderBy> {
  typeName = "portal";
  gqlInterface = `{
        id
        ownerAddress
        modules
        isRevocable
        name
        description
        ownerName
  }`;

  async simulateAttest(portalAddress: Address, attestationPayload: AttestationPayload, validationPayloads: string[]) {
    const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
    if (!matchingSchema) {
      throw new Error("No matching Schema");
    }
    const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);
    return this.simulatePortalContract(portalAddress, "attest", [
      [attestationPayload.schemaId, attestationPayload.expirationDate, attestationPayload.subject, attestationData],
      validationPayloads,
    ]);
  }

  async attest(
    portalAddress: Address,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    waitForConfirmation: boolean = false,
  ) {
    const request = await this.simulateAttest(portalAddress, attestationPayload, validationPayloads);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateBulkAttest(
    portalAddress: Address,
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
    return this.simulatePortalContract(portalAddress, "bulkAttest", [attestationPayloadsArg, validationPayloads]);
  }

  async bulkAttest(
    portalAddress: Address,
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    waitForConfirmation: boolean = false,
  ) {
    const request = await this.simulateBulkAttest(portalAddress, attestationPayloads, validationPayloads);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateRevoke(portalAddress: Address, attestationId: string) {
    return this.simulatePortalContract(portalAddress, "revoke", [attestationId]);
  }

  async revoke(portalAddress: Address, attestationId: string, waitForConfirmation: boolean = false) {
    const request = await this.simulateRevoke(portalAddress, attestationId);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateBulkRevoke(portalAddress: Address, attestationIds: string[]) {
    return this.simulatePortalContract(portalAddress, "bulkRevoke", [attestationIds]);
  }

  async bulkRevoke(portalAddress: Address, attestationIds: string[], waitForConfirmation: boolean = false) {
    const request = await this.simulateBulkRevoke(portalAddress, attestationIds);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateReplace(
    portalAddress: Address,
    attestationId: string,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
  ) {
    const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
    if (!matchingSchema) {
      throw new Error("No matching Schema");
    }
    const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);
    return this.simulatePortalContract(portalAddress, "replace", [
      attestationId,
      [attestationPayload.schemaId, attestationPayload.expirationDate, attestationPayload.subject, attestationData],
      validationPayloads,
    ]);
  }

  async replace(
    portalAddress: Address,
    attestationId: string,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    waitForConfirmation: boolean = false,
  ) {
    const request = await this.simulateReplace(portalAddress, attestationId, attestationPayload, validationPayloads);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateBulkReplace(
    portalAddress: Address,
    attestationIds: string[],
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
    return this.simulatePortalContract(portalAddress, "bulkReplace", [
      attestationIds,
      attestationPayloadsArg,
      validationPayloads,
    ]);
  }

  async bulkReplace(
    portalAddress: Address,
    attestationIds: string[],
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    waitForConfirmation: boolean = false,
  ) {
    const request = await this.simulateBulkReplace(
      portalAddress,
      attestationIds,
      attestationPayloads,
      validationPayloads,
    );
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateRegister(id: Address, name: string, description: string, isRevocable: boolean, ownerName: string) {
    return this.simulatePortalRegistryContract("register", [id, name, description, isRevocable, ownerName]);
  }

  async register(
    id: Address,
    name: string,
    description: string,
    isRevocable: boolean,
    ownerName: string,
    waitForConfirmation: boolean = false,
  ) {
    const request = await this.simulateRegister(id, name, description, isRevocable, ownerName);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateDeployDefaultPortal(
    modules: Address[],
    name: string,
    description: string,
    isRevocable: boolean,
    ownerName: string,
  ) {
    return this.simulatePortalRegistryContract("deployDefaultPortal", [
      modules,
      name,
      description,
      isRevocable,
      ownerName,
    ]);
  }

  async deployDefaultPortal(
    modules: Address[],
    name: string,
    description: string,
    isRevocable: boolean,
    ownerName: string,
    waitForConfirmation: boolean = false,
  ) {
    const request = await this.simulateDeployDefaultPortal(modules, name, description, isRevocable, ownerName);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async getPortalByAddress(id: Address) {
    return this.executePortalRegistryReadMethod("getPortalByAddress", [id]);
  }

  async getPortalOwnerAddress(id: Address) {
    return this.executePortalRegistryReadMethod("getPortalOwnerAddress", [id]);
  }

  async isPortalRegistered(id: Address) {
    return this.executePortalRegistryReadMethod("isRegistered", [id]);
  }

  private async executePortalRegistryReadMethod(functionName: string, args: unknown[]) {
    return this.web3Client.readContract({
      abi: abiPortalRegistry,
      address: this.conf.portalRegistryAddress,
      functionName,
      args,
    });
  }

  private async simulatePortalRegistryContract(functionName: string, args: unknown[]) {
    if (!this.walletClient) throw new Error("VeraxSDK - Wallet not available");
    try {
      const { request } = await this.web3Client.simulateContract({
        address: this.conf.portalRegistryAddress,
        abi: abiPortalRegistry,
        functionName,
        account: this.walletClient.account,
        args,
      });

      return request;
    } catch (err) {
      handleSimulationError(err);
    }
  }

  private async simulatePortalContract(portalAddress: Address, functionName: string, args: unknown[]) {
    if (!this.walletClient) throw new Error("VeraxSDK - Wallet not available");
    try {
      const { request } = await this.web3Client.simulateContract({
        address: portalAddress,
        abi: abiDefaultPortal,
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
