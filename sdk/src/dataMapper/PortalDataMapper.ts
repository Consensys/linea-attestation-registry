import { AttestationPayload, Portal } from "../types";
import { ActionType } from "../utils/constants";
import BaseDataMapper from "./BaseDataMapper";
import { abiDefaultPortal } from "../abi/DefaultPortal";
import { Abi, Address } from "viem";
import { encode } from "../utils/abiCoder";
import { Portal_filter, Portal_orderBy } from "../../.graphclient";
import { abiPortalRegistry } from "../abi/PortalRegistry";
import { handleError } from "../utils/errorHandler";
import { executeTransaction } from "../utils/transactionSender";
import { Constants } from "../utils/constants";
import { IPFSService } from "../utils/ipfsService";
import { OffChainAttestationPayload } from "../types";
import { encodeAbiParameters } from "viem";

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

  /**
   * Simulates issuing an off-chain attestation by first uploading the payload to IPFS
   * and then preparing an on-chain attestation with the IPFS URI.
   * 
   * @param portalAddress - The address of the portal to issue the attestation through
   * @param attestationPayload - The payload containing both attestation and off-chain data
   * @param validationPayloads - Optional validation payloads for portal modules
   * @param customAbi - Optional custom ABI for the portal contract
   * @returns A simulated transaction request
   * @throws {Error} If schema validation fails or IPFS upload fails
   */
  async simulateAttestOffChain(
    portalAddress: Address,
    attestationPayload: OffChainAttestationPayload,
    validationPayloads: string[] = [],
    customAbi?: Abi
  ) {
    // Validate input parameters
    if (!portalAddress) throw new Error("Portal address is required");
    if (!attestationPayload?.offchainData) {
      throw new Error("Attestation payload with offchainData is required");
    }

    const { schemaId, payload } = attestationPayload.offchainData;
    
    // Validate schema exists and is registered
    const schema = await this.veraxSdk.schema.findOneById(schemaId);
    if (!schema) {
      throw new Error(
        `Schema ${schemaId} not found. The schema must be registered in the SchemaRegistry before issuing off-chain attestations.`
      );
    }

    // Validate IPFS configuration
    if (!this.conf.offchainConfig?.ipfsConfig) {
      throw new Error(
        "IPFS configuration missing. Please provide IPFS credentials in the SDK configuration."
      );
    }

    // Validate payload against schema using IPFSService
    const ipfsService = new IPFSService(this.conf.offchainConfig.ipfsConfig);
    try {
      // Parse schema string into SchemaDefinition if needed
      const schemaDefinition = typeof schema.schema === 'string' 
        ? JSON.parse(schema.schema)
        : schema.schema;
      ipfsService.validateOffchainPayload(payload, schemaDefinition);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid schema format for ${schemaId}: Schema must be a valid JSON object`);
      }
      throw new Error(`Invalid payload for schema ${schemaId}: ${(error as Error).message}`);
    }

    // Convert payload to string if it's an object
    const payloadString = typeof payload === "string" 
      ? payload
      : JSON.stringify(payload);

    // Upload to IPFS with retries and timeout
    let uri: string;
    try {
      uri = await ipfsService.uploadToIPFS(payloadString);
    } catch (error) {
      throw new Error(
        `Failed to upload payload to IPFS: ${(error as Error).message}. ` +
        "Please check your IPFS configuration and network connection."
      );
    }

    // Prepare on-chain attestation using the OFFCHAIN_DATA_SCHEMA
    const onChainPayload = {
      ...attestationPayload,
      schemaId: Constants.OFFCHAIN_DATA_SCHEMA_ID,
      attestationData: encodeAbiParameters(
        [
          { name: "schemaId", type: "bytes32" },
          { name: "uri", type: "string" },
        ],
        [schemaId as `0x${string}`, uri],
      ),
    };

    // Issue on-chain attestation through the portal
    try {
      return await this.simulatePortalContract(
        portalAddress,
        "attest",
        [
          [
            onChainPayload.schemaId,
            onChainPayload.expirationDate,
            onChainPayload.subject,
            onChainPayload.attestationData,
          ],
          validationPayloads,
        ],
        0n,
        customAbi
      );
    } catch (error) {
      throw new Error(
        `Failed to simulate on-chain attestation: ${(error as Error).message}`
      );
    }
  }

  /**
   * Issues an off-chain attestation by uploading the payload to IPFS and creating
   * an on-chain attestation with the IPFS URI.
   * 
   * @param portalAddress - The address of the portal to issue the attestation through
   * @param attestationPayload - The payload containing both attestation and off-chain data
   * @param validationPayloads - Optional validation payloads for portal modules
   * @param waitForConfirmation - Whether to wait for transaction confirmation
   * @param customAbi - Optional custom ABI for the portal contract
   * @returns The transaction response
   */
  async attestOffChain(
    portalAddress: Address,
    attestationPayload: OffChainAttestationPayload,
    validationPayloads: string[] = [],
    waitForConfirmation: boolean = false,
    customAbi?: Abi
  ) {
    const request = await this.simulateAttestOffChain(
      portalAddress,
      attestationPayload,
      validationPayloads,
      customAbi
    );
    return executeTransaction(request, this.web3Client, this.walletClient, waitForConfirmation);
  }

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
    customAbi?: Abi,
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
      customAbi,
    );
  }

  async attestV2(
    portalAddress: Address,
    attestationPayload: AttestationPayload,
    validationPayloads: string[],
    waitForConfirmation: boolean = false,
    value: bigint = 0n,
    customAbi?: Abi,
  ) {
    const request = await this.simulateAttestV2(
      portalAddress,
      attestationPayload,
      validationPayloads,
      value,
      customAbi,
    );
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
