import { AttestationPayload, Portal } from "../types";
import BaseDataMapper from "./BaseDataMapper";
import { abiDefaultPortal } from "../abi/DefaultPortal";
import { Address, BaseError, ContractFunctionRevertedError, Hash } from "viem";
import { encode } from "../utils/abiCoder";
import { Portal_filter, Portal_orderBy } from "../../.graphclient";
import { abiPortalRegistry } from "../abi/PortalRegistry";

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

    try {
      const { request } = await this.web3Client.simulateContract({
        address: portalAddress,
        abi: abiDefaultPortal,
        functionName: "attest",
        account: this.walletClient.account,
        args: [
          [attestationPayload.schemaId, attestationPayload.expirationDate, attestationPayload.subject, attestationData],
          validationPayloads,
        ],
      });

      return request;
    } catch (err) {
      this.handleError(err);
    }
  }

  async attest(portalAddress: Address, attestationPayload: AttestationPayload, validationPayloads: string[]) {
    const request = await this.simulateAttest(portalAddress, attestationPayload, validationPayloads);
    const hash: Hash = await this.walletClient.writeContract(request);

    console.log(`Transaction sent with hash ${hash}`);

    return hash;
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

    try {
      const { request } = await this.web3Client.simulateContract({
        address: portalAddress,
        abi: abiDefaultPortal,
        functionName: "bulkAttest",
        account: this.walletClient.account,
        args: [attestationPayloadsArg, validationPayloads],
      });

      return request;
    } catch (err) {
      this.handleError(err);
    }
  }

  async bulkAttest(portalAddress: Address, attestationPayloads: AttestationPayload[], validationPayloads: string[][]) {
    const request = await this.simulateBulkAttest(portalAddress, attestationPayloads, validationPayloads);
    const hash: Hash = await this.walletClient.writeContract(request);

    console.log(`Transaction sent with hash ${hash}`);

    return hash;
  }

  async replace() {
    throw new Error("Not implemented");
  }

  async simulateRevoke(portalAddress: Address, attestationId: string) {
    try {
      const { request } = await this.web3Client.simulateContract({
        address: portalAddress,
        abi: abiDefaultPortal,
        functionName: "revoke",
        account: this.walletClient.account,
        args: [attestationId],
      });

      return request;
    } catch (err) {
      this.handleError(err);
    }
  }

  async revoke(portalAddress: Address, attestationId: string) {
    const request = await this.simulateRevoke(portalAddress, attestationId);
    const hash: Hash = await this.walletClient.writeContract(request);

    console.log(`Transaction sent with hash ${hash}`);

    return hash;
  }

  async simulateBulkRevoke(portalAddress: Address, attestationIds: string[]) {
    try {
      const { request } = await this.web3Client.simulateContract({
        address: portalAddress,
        abi: abiDefaultPortal,
        functionName: "bulkRevoke",
        account: this.walletClient.account,
        args: [attestationIds],
      });

      return request;
    } catch (err) {
      this.handleError(err);
    }
  }

  async bulkRevoke(portalAddress: Address, attestationIds: string[]) {
    const request = await this.simulateBulkRevoke(portalAddress, attestationIds);
    const hash: Hash = await this.walletClient.writeContract(request);

    console.log(`Transaction sent with hash ${hash}`);

    return hash;
  }

  async massImport() {
    throw new Error("Not implemented");
  }

  async simulateRegister(id: Address, name: string, description: string, isRevocable: boolean, ownerName: string) {
    return this.simulatePortalRegistryContract("register", [id, name, description, isRevocable, ownerName]);
  }

  async register(id: Address, name: string, description: string, isRevocable: boolean, ownerName: string) {
    const request = await this.simulateRegister(id, name, description, isRevocable, ownerName);
    return await this.executeTransaction(request);
  }

  async simulateClone(modules: Address[], name: string, description: string, isRevocable: boolean, ownerName: string) {
    return this.simulatePortalRegistryContract("deployDefaultPortal", [
      modules,
      name,
      description,
      isRevocable,
      ownerName,
    ]);
  }

  async clone(modules: Address[], name: string, description: string, isRevocable: boolean, ownerName: string) {
    const request = await this.simulateClone(modules, name, description, isRevocable, ownerName);
    return await this.executeTransaction(request);
  }

  async getPortalByAddress(id: Address) {
    return await this.executePortalRegistryReadMethod("getPortalByAddress", [id]);
  }

  async isPortalRegistered(id: Address) {
    return await this.executePortalRegistryReadMethod("isRegistered", [id]);
  }

  async getPortalsCount() {
    return await this.executePortalRegistryReadMethod("getPortalsCount", []);
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
      this.handleError(err);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async executeTransaction(request: any) {
    const hash: Hash = await this.walletClient.writeContract(request);
    console.log(`Transaction sent with hash ${hash}`);
    return hash;
  }

  private handleError(err: unknown): never {
    if (err instanceof BaseError) {
      const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
      if (revertError instanceof ContractFunctionRevertedError) {
        const errorName = revertError.data?.errorName ?? "";
        console.error(`Failing with ${errorName}`);
      }
    }
    console.error(err);

    throw new Error("Simulation failed");
  }
}
