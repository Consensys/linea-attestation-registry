import { AttestationPayload, OffChainAttestationPayload, Portal, TransactionOptions } from "../types";
import { ActionType, Constants } from "../utils/constants";
import BaseDataMapper from "./BaseDataMapper";
import { abiDefaultPortal } from "../abi/DefaultPortal";
import { Abi, Address, WriteContractParameters } from "viem";
import { encode } from "../utils/abiCoder";
import { Portal_filter, Portal_orderBy } from "../../.graphclient";
import { abiPortalRegistry } from "../abi/PortalRegistry";
import { handleError } from "../utils/errorHandler";
import { executeTransaction } from "../utils/transactionSender";
import { IPFSService } from "../utils/ipfsService";

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
    options?: TransactionOptions,
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
      options?.value,
      options?.customAbi,
    );
  }

  async attest(
    portalAddress: Address,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    options?: TransactionOptions,
  ) {
    const request = await this.simulateAttest(portalAddress, attestationPayload, validationPayloads, options);
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
  }

  async simulateBulkAttest(
    portalAddress: Address,
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    options?: TransactionOptions,
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
      options?.value,
      options?.customAbi,
    );
  }

  async simulateAttestOffChain(
    portalAddress: Address,
    attestationPayload: OffChainAttestationPayload,
    validationPayloads: string[] = [],
    options?: TransactionOptions,
  ) {
    if (!attestationPayload?.offchainData) {
      throw new Error("Attestation payload with offchainData is required");
    }

    const { schemaId, payload } = attestationPayload.offchainData;

    const matchingSchema = await this.veraxSdk.schema.findOneById(attestationPayload.schemaId);
    if (!matchingSchema) {
      throw new Error("No matching Schema");
    }

    // Validate IPFS configuration
    if (!this.conf.offchainConfig?.projectId || !this.conf.offchainConfig?.projectSecret) {
      throw new Error("IPFS configuration missing projectId or projectSecret");
    }

    const ipfsService = new IPFSService(this.conf.offchainConfig);

    // Upload to IPFS
    let uri: string;
    try {
      uri = await ipfsService.uploadToIPFS(payload);
    } catch (error) {
      throw new Error(`Failed to upload payload to IPFS: ${(error as Error).message}`);
    }

    // Prepare onchain Attestation using the OFFCHAIN_DATA_SCHEMA
    const onChainPayload: AttestationPayload = {
      ...attestationPayload,
      schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID,
      attestationData: [
        {
          schemaId,
          uri,
        },
      ],
    };

    // Issue onchain Attestation through the Portal
    return this.simulateAttest(portalAddress, onChainPayload, validationPayloads, options);
  }

  async attestOffChain(
    portalAddress: Address,
    attestationPayload: OffChainAttestationPayload,
    validationPayloads: string[] = [],
    options?: TransactionOptions,
  ) {
    const request = await this.simulateAttestOffChain(portalAddress, attestationPayload, validationPayloads, options);
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
  }

  async bulkAttest(
    portalAddress: Address,
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    options?: TransactionOptions,
  ) {
    const request = await this.simulateBulkAttest(portalAddress, attestationPayloads, validationPayloads, options);
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
  }

  async simulateRevoke(portalAddress: Address, attestationId: string, options?: TransactionOptions) {
    return this.simulatePortalContract(portalAddress, "revoke", [attestationId], options?.value, options?.customAbi);
  }

  async revoke(portalAddress: Address, attestationId: string, options?: TransactionOptions) {
    const request = await this.simulateRevoke(portalAddress, attestationId, options);
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
  }

  async simulateBulkRevoke(portalAddress: Address, attestationIds: string[], options?: TransactionOptions) {
    return this.simulatePortalContract(
      portalAddress,
      "bulkRevoke",
      [attestationIds],
      options?.value,
      options?.customAbi,
    );
  }

  async bulkRevoke(portalAddress: Address, attestationIds: string[], options?: TransactionOptions) {
    const request = await this.simulateBulkRevoke(portalAddress, attestationIds, options);
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
  }

  async simulateReplace(
    portalAddress: Address,
    attestationId: string,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    options?: TransactionOptions,
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
      options?.value,
      options?.customAbi,
    );
  }

  async replace(
    portalAddress: Address,
    attestationId: string,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    options?: TransactionOptions,
  ) {
    const request = await this.simulateReplace(
      portalAddress,
      attestationId,
      attestationPayload,
      validationPayloads,
      options,
    );
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
  }

  async simulateBulkReplace(
    portalAddress: Address,
    attestationIds: string[],
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    options?: TransactionOptions,
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
      options?.value,
      options?.customAbi,
    );
  }

  async bulkReplace(
    portalAddress: Address,
    attestationIds: string[],
    attestationPayloads: AttestationPayload[],
    validationPayloads: string[][],
    options?: TransactionOptions,
  ) {
    const request = await this.simulateBulkReplace(
      portalAddress,
      attestationIds,
      attestationPayloads,
      validationPayloads,
      options,
    );
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
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
    options?: TransactionOptions,
  ) {
    const request = await this.simulateRegister(id, name, description, isRevocable, ownerName);
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
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
    options?: TransactionOptions,
  ) {
    const request = await this.simulateDeployDefaultPortal(modules, name, description, isRevocable, ownerName);
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
  }

  async getPortalByAddress(address: Address) {
    return await this.web3Client.readContract({
      address: this.conf.portalRegistryAddress,
      abi: abiPortalRegistry,
      functionName: "getPortalByAddress",
      args: [address],
    });
  }

  async getPortalOwner(address: Address) {
    return await this.web3Client.readContract({
      address: this.conf.portalRegistryAddress,
      abi: abiPortalRegistry,
      functionName: "getPortalOwner",
      args: [address],
    });
  }

  async getPortalRevocability(address: Address) {
    return await this.web3Client.readContract({
      address: this.conf.portalRegistryAddress,
      abi: abiPortalRegistry,
      functionName: "getPortalRevocability",
      args: [address],
    });
  }

  async getPortalsNumber() {
    return super.findTotalCount();
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

  private async simulatePortalRegistryContract(
    functionName: string,
    args: unknown[],
  ): Promise<WriteContractParameters> {
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
  ): Promise<WriteContractParameters> {
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
