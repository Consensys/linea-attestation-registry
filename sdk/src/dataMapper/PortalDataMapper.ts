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
    customAbi?: any,
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
    customAbi?: any,
  ) {
    const request = await this.simulateAttest(portalAddress, attestationPayload, validationPayloads, value, customAbi);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateBulkAttest(
    portalAddress: Address,
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    customAbi?: any,
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

  async bulkAttest(
    portalAddress: Address,
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    waitForConfirmation: boolean = false,
    customAbi?: any,
  ) {
    const request = await this.simulateBulkAttest(portalAddress, attestationPayloads, validationPayloads, customAbi);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateRevoke(portalAddress: Address, attestationId: string, customAbi?: any) {
    return this.simulatePortalContract(portalAddress, "revoke", [attestationId], 0n, customAbi);
  }

  async revoke(portalAddress: Address, attestationId: string, waitForConfirmation: boolean = false, customAbi?: any) {
    const request = await this.simulateRevoke(portalAddress, attestationId, customAbi);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateBulkRevoke(portalAddress: Address, attestationIds: string[], customAbi?: any) {
    return this.simulatePortalContract(portalAddress, "bulkRevoke", [attestationIds], 0n, customAbi);
  }

  async bulkRevoke(
    portalAddress: Address,
    attestationIds: string[],
    waitForConfirmation: boolean = false,
    customAbi?: any,
  ) {
    const request = await this.simulateBulkRevoke(portalAddress, attestationIds, customAbi);
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

  async simulateReplace(
    portalAddress: Address,
    attestationId: string,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    customAbi?: any,
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
    customAbi?: any,
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
    customAbi?: any,
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
    customAbi?: any,
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

  private async simulatePortalContract(
    portalAddress: Address,
    functionName: string,
    args: unknown[],
    value: bigint = 0n,
    customAbi?: any,
  ) {
    if (!this.walletClient) throw new Error("VeraxSDK - Wallet not available");

    const abi = customAbi ? [...abiDefaultPortal, ...customAbi] : abiDefaultPortal;

    try {
      const { request } = await this.web3Client.simulateContract({
        address: portalAddress,
        abi: abi,
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
