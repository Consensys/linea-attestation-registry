import { AttestationPayload, Portal } from "../types";
import { ActionType } from "../utils/constants";
import BaseDataMapper from "./BaseDataMapper";
import { abiDefaultPortal } from "../abi/DefaultPortal";
import { Address } from "viem";
import { encode } from "../utils/abiCoder";
import { Portal_filter, Portal_orderBy } from "../../.graphclient";
import { abiPortalRegistry } from "../abi/PortalRegistry";
import { handleError } from "../utils/errorHandler";
import { executeTransaction } from "../utils/transactionSender";
import { Abi } from "viem";

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
        attestationCounter
  }`;

  async simulateAttest(
    portalAddress: Address,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    value: bigint = 0n,
    customAbi?: Abi,
  ) {
    const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
    if (!matchingSchema) {
      throw new Error("No matching Schema");
    }
    const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);
    return this.simulatePortalContract(
      portalAddress,
      "attest",
      [
        [attestationPayload.schemaId, attestationPayload.expirationDate, attestationPayload.subject, attestationData],
        validationPayloads,
      ],
      value,
      customAbi,
    );
  }

  async attest(
    portalAddress: Address,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    waitForConfirmation: boolean = false,
    value: bigint = 0n,
    customAbi?: Abi,
  ) {
    const request = await this.simulateAttest(portalAddress, attestationPayload, validationPayloads, value, customAbi);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateBulkAttest(
    portalAddress: Address,
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    customAbi?: Abi,
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
    return this.simulatePortalContract(
      portalAddress,
      "bulkAttest",
      [attestationPayloadsArg, validationPayloads],
      0n,
      customAbi,
    );
  }

  async simulateAttestV2(
    portalAddress: Address,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    value: bigint = 0n,
  ) {
    const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
    if (!matchingSchema) {
      throw new Error("No matching Schema");
    }
    const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);
    return this.simulatePortalContract(
      portalAddress,
      "attestV2",
      [
        [attestationPayload.schemaId, attestationPayload.expirationDate, attestationPayload.subject, attestationData],
        validationPayloads,
      ],
      value,
    );
  }

  async attestV2(
    portalAddress: Address,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    waitForConfirmation: boolean = false,
    value: bigint = 0n,
  ) {
    const request = await this.simulateAttestV2(portalAddress, attestationPayload, validationPayloads, value);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async bulkAttest(
    portalAddress: Address,
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    waitForConfirmation: boolean = false,
    customAbi?: Abi,
  ) {
    const request = await this.simulateBulkAttest(portalAddress, attestationPayloads, validationPayloads, customAbi);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateRevoke(portalAddress: Address, attestationId: string, customAbi?: Abi) {
    return this.simulatePortalContract(portalAddress, "revoke", [attestationId], 0n, customAbi);
  }

  async revoke(portalAddress: Address, attestationId: string, waitForConfirmation: boolean = false, customAbi?: Abi) {
    const request = await this.simulateRevoke(portalAddress, attestationId, customAbi);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateBulkRevoke(portalAddress: Address, attestationIds: string[], customAbi?: Abi) {
    return this.simulatePortalContract(portalAddress, "bulkRevoke", [attestationIds], 0n, customAbi);
  }

  async bulkRevoke(
    portalAddress: Address,
    attestationIds: string[],
    waitForConfirmation: boolean = false,
    customAbi?: Abi,
  ) {
    const request = await this.simulateBulkRevoke(portalAddress, attestationIds, customAbi);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateReplace(
    portalAddress: Address,
    attestationId: string,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    customAbi?: Abi,
  ) {
    const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
    if (!matchingSchema) {
      throw new Error("No matching Schema");
    }
    const attestationData = encode(matchingSchema.schema, attestationPayload.attestationData);
    return this.simulatePortalContract(
      portalAddress,
      "replace",
      [
        attestationId,
        [attestationPayload.schemaId, attestationPayload.expirationDate, attestationPayload.subject, attestationData],
        validationPayloads,
      ],
      0n,
      customAbi,
    );
  }

  async replace(
    portalAddress: Address,
    attestationId: string,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    waitForConfirmation: boolean = false,
    customAbi?: Abi,
  ) {
    const request = await this.simulateReplace(
      portalAddress,
      attestationId,
      attestationPayload,
      validationPayloads,
      customAbi,
    );
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateBulkReplace(
    portalAddress: Address,
    attestationIds: string[],
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    customAbi?: Abi,
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
    return this.simulatePortalContract(
      portalAddress,
      "bulkReplace",
      [attestationIds, attestationPayloadsArg, validationPayloads],
      0n,
      customAbi,
    );
  }

  async bulkReplace(
    portalAddress: Address,
    attestationIds: string[],
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    waitForConfirmation: boolean = false,
    customAbi?: Abi,
  ) {
    const request = await this.simulateBulkReplace(
      portalAddress,
      attestationIds,
      attestationPayloads,
      validationPayloads,
      customAbi,
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

  async getPortalByAddress(address: Address) {
    return await this.web3Client.readContract({
      address: this.conf.portalRegistryAddress,
      abi: abiPortalRegistry,
      functionName: "getPortal",
      args: [address],
    });
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
      handleError(ActionType.Simulation, err);
    }
  }
  private async simulatePortalContract(
    portalAddress: Address,
    functionName: string,
    args: unknown[],
    value: bigint = 0n,
    customAbi?: Abi,
  ) {
    if (!this.walletClient) throw new Error("VeraxSDK - Wallet not available");

    const abi = [...abiDefaultPortal, ...(customAbi || [])];

    try {
      const { request } = await this.web3Client.simulateContract({
        address: portalAddress,
        abi,
        functionName,
        account: this.walletClient.account,
        args,
        value,
      });
      return request;
    } catch (err) {
      handleError(ActionType.Simulation, err);
    }
  }
}
