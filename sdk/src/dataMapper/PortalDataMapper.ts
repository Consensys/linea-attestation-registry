import { AttestationPayload, Portal } from "../types";
import BaseDataMapper from "./BaseDataMapper";
import { abiDefaultPortal } from "../abi/DefaultPortal";
import { Address, Hash } from "viem";
import { encode } from "../utils/abiCoder";
import { Portal_filter, Portal_orderBy } from "../../.graphclient";
import { abiPortalRegistry } from "../abi/PortalRegistry";
import { handleError } from "../utils/errorHandler";

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
    const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);
    return await this.simulateContract(portalAddress, "attest", [
      [attestationPayload.schemaId, attestationPayload.expirationDate, attestationPayload.subject, attestationData],
      validationPayloads,
    ]);
  }

  async attest(portalAddress: Address, attestationPayload: AttestationPayload, validationPayloads: string[]) {
    const request = await this.simulateAttest(portalAddress, attestationPayload, validationPayloads);
    return await this.executeTransaction(request);
  }

  async simulateBulkAttest(
    portalAddress: Address,
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
  ) {
    const attestationPayloadsArg = [];

    for (const attestationPayload of attestationPayloads) {
      const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
      const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);

      attestationPayloadsArg.push([
        attestationPayload.schemaId,
        attestationPayload.expirationDate,
        attestationPayload.subject,
        attestationData,
      ]);
    }

    return await this.simulateContract(portalAddress, "bulkAttest", [attestationPayloadsArg, validationPayloads]);
  }

  async bulkAttest(portalAddress: Address, attestationPayloads: AttestationPayload[], validationPayloads: string[][]) {
    const request = await this.simulateBulkAttest(portalAddress, attestationPayloads, validationPayloads);
    return await this.executeTransaction(request);
  }

  async simulateRevoke(portalAddress: Address, attestationId: string) {
    return await this.simulateContract(portalAddress, "revoke", [attestationId]);
  }

  async revoke(portalAddress: Address, attestationId: string) {
    const request = await this.simulateRevoke(portalAddress, attestationId);
    return await this.executeTransaction(request);
  }

  async simulateBulkRevoke(portalAddress: Address, attestationIds: string[]) {
    return await this.simulateContract(portalAddress, "bulkRevoke", [attestationIds]);
  }

  async bulkRevoke(portalAddress: Address, attestationIds: string[]) {
    const request = await this.simulateBulkRevoke(portalAddress, attestationIds);
    return await this.executeTransaction(request);
  }

  async simulateReplace(
    portalAddress: Address,
    attestationId: string,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
  ) {
    const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
    const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);
    return await this.simulateContract(portalAddress, "replace", [
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
  ) {
    const request = await this.simulateReplace(portalAddress, attestationId, attestationPayload, validationPayloads);
    return await this.executeTransaction(request);
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
      const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);
      attestationPayloadsArg.push([
        attestationPayload.schemaId,
        attestationPayload.expirationDate,
        attestationPayload.subject,
        attestationData,
      ]);
    }
    return await this.simulateContract(portalAddress, "bulkReplace", [
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
  ) {
    const request = await this.simulateBulkReplace(
      portalAddress,
      attestationIds,
      attestationPayloads,
      validationPayloads,
    );
    return await this.executeTransaction(request);
  }

  private async simulateContract(portalAddress: Address, functionName: string, args: unknown[]) {
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
      handleError(err);
    }
  }

  async simulateRegister(id: Address, name: string, description: string, isRevocable: boolean, ownerName: string) {
    return this.simulatePortalRegistryContract("register", [id, name, description, isRevocable, ownerName]);
  }

  async register(id: Address, name: string, description: string, isRevocable: boolean, ownerName: string) {
    const request = await this.simulateRegister(id, name, description, isRevocable, ownerName);
    return await this.executeTransaction(request);
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
  ) {
    const request = await this.simulateDeployDefaultPortal(modules, name, description, isRevocable, ownerName);
    return await this.executeTransaction(request);
  }

  async getPortalByAddress(id: Address) {
    return await this.executePortalRegistryReadMethod("getPortalByAddress", [id]);
  }

  async isPortalRegistered(id: Address) {
    return await this.executePortalRegistryReadMethod("isRegistered", [id]);
  }

  private async executePortalRegistryReadMethod(functionName: string, args: unknown[]) {
    return await this.web3Client.readContract({
      abi: abiPortalRegistry,
      address: this.conf.portalRegistryAddress,
      functionName,
      args,
    });
  }

  private async simulatePortalRegistryContract(functionName: string, args: unknown[]) {
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
