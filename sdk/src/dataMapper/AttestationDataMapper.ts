import BaseDataMapper from "./BaseDataMapper";
import { abiAttestationRegistry } from "../abi/AttestationRegistry";
import { Attestation, AttestationPayload, ChainName, OffchainData, Schema, TransactionOptions } from "../types";
import { ActionType, Constants } from "../utils/constants";
import {
  Attestation_filter,
  Attestation_orderBy,
  MultichainAttestationsQueryQuery,
  OrderDirection,
} from "../../.graphclient";
import { handleError } from "../utils/errorHandler";
import { Address, createPublicClient, Hex, http, PublicClient, WriteContractParameters } from "viem";
import { decodeWithRetry, encode } from "../utils/abiCoder";
import { executeTransaction } from "../utils/transactionSender";
import { getIPFSContent } from "../utils/ipfsClient";
import { VeraxSdk } from "../VeraxSdk";

type StructuredOffchainDataError = {
  code: "MALFORMED_POINTER" | "MALFORMED_FETCHED_CONTENT";
  message: string;
};

type EnrichedOffchainData = Omit<OffchainData, "error"> & {
  error?: OffchainData["error"] | StructuredOffchainDataError;
};

export default class AttestationDataMapper extends BaseDataMapper<
  Attestation,
  Attestation_filter,
  Attestation_orderBy
> {
  private readonly chainReadClients = new Map<ChainName, PublicClient>();

  typeName = "attestation";
  gqlInterface = `{
            id
            replacedBy
            attester
            attestedDate
            expirationDate
            revocationDate
            version
            revoked
            subject
            encodedSubject
            attestationData
            decodedData
            schema {
                id
                name
                description
                context
                schema
                attestationCounter
            }
            portal {
                id
                ownerAddress
                modules
                isRevocable
                name
                description
                ownerName
                attestationCounter
            }
  }`;

  override async findOneById(id: string) {
    const attestation = await super.findOneById(id);
    if (attestation !== undefined) {
      await this.enrichAttestation(attestation);
    }
    return attestation;
  }

  override async findBy(
    first?: number,
    skip?: number,
    where?: Attestation_filter,
    orderBy?: Attestation_orderBy,
    orderDirection?: OrderDirection,
  ) {
    const attestations = await super.findBy(first, skip, where, orderBy, orderDirection);
    await Promise.all(
      attestations.map(async (attestation) => {
        await this.enrichAttestation(attestation);
      }),
    );
    return attestations;
  }

  async findByMultiChain(
    chainNames: ChainName[],
    first?: number,
    skip?: number,
    where?: Attestation_filter,
    orderBy?: Attestation_orderBy,
    orderDirection?: OrderDirection,
  ) {
    const crossChainClient = await this.getCrossChainClient(chainNames);
    const attestationsResult = await crossChainClient.MultichainAttestationsQuery({
      chainNames: chainNames,
      first: first,
      skip: skip,
      where: where,
      orderBy: orderBy,
      orderDirection: orderDirection,
    });

    const attestations: Attestation[] = this.mapToAttestations(attestationsResult);

    await Promise.all(
      attestations.map(async (attestation) => {
        await this.enrichAttestation(attestation);
      }),
    );

    return attestations;
  }

  async getAttestationCountMultiChain(chainNames: ChainName[]): Promise<number> {
    const countPromises = chainNames.map(async (chainName) => {
      try {
        const count = await this.executeReadMethodForChain(chainName, "getAttestationIdCounter", []);
        return this.toAttestationCount(count);
      } catch (_error) {
        return 0;
      }
    });

    const counts = await Promise.all(countPromises);

    return counts.reduce((sum, count) => sum + count, 0);
  }

  private mapToAttestations(attestationsResult: MultichainAttestationsQueryQuery): Attestation[] {
    return attestationsResult.multichainAttestations.map((pickAttestation) => ({
      id: pickAttestation.id,
      attestationId: pickAttestation.id,
      chainName: pickAttestation.chainName || "",
      replacedBy: pickAttestation.replacedBy,
      attester: pickAttestation.attester,
      attestedDate: pickAttestation.attestedDate,
      expirationDate: pickAttestation.expirationDate,
      revocationDate: pickAttestation.revocationDate,
      version: pickAttestation.version,
      revoked: pickAttestation.revoked,
      subject: pickAttestation.subject,
      encodedSubject: pickAttestation.encodedSubject,
      attestationData: pickAttestation.attestationData,
      decodedData: pickAttestation.decodedData || [],
      decodedPayload: {},
      schema: {
        id: pickAttestation.schema.id,
        name: pickAttestation.schema.name,
        description: pickAttestation.schema.description,
        context: pickAttestation.schema.context,
        schema: pickAttestation.schema.schema,
        attestationCounter: pickAttestation.schema.attestationCounter || 0,
      },
      portal: {
        id: pickAttestation.portal.id as Address,
        ownerAddress: pickAttestation.portal.ownerAddress,
        modules: pickAttestation.portal.modules as Address[],
        isRevocable: pickAttestation.portal.isRevocable,
        name: pickAttestation.portal.name,
        description: pickAttestation.portal.description,
        ownerName: pickAttestation.portal.ownerName,
        attestationCounter: pickAttestation.portal.attestationCounter || 0,
      },
    }));
  }

  private async enrichAttestation(attestation: Attestation) {
    attestation.decodedPayload = decodeWithRetry(attestation.schema.schema, attestation.attestationData as Hex);

    attestation.attestedDate = Number(attestation.attestedDate);
    attestation.expirationDate = Number(attestation.expirationDate);
    attestation.revocationDate = Number(attestation.revocationDate);

    attestation.version = Number(attestation.version);

    // Check if data is stored off-chain
    if (attestation.schema.id === Constants.OFFCHAIN_DATA_SCHEMA_ID) {
      attestation.offchainData = this.getOffchainDataPointer(attestation.decodedPayload);
      attestation.decodedPayload = {};
      if (attestation.offchainData.error) {
        return;
      }
      if (attestation.offchainData.uri.startsWith("ipfs://")) {
        try {
          const ipfsHash = attestation.offchainData.uri.split("//")[1];
          const response = await getIPFSContent(ipfsHash);
          const responseContent = response.toString();
          if (responseContent.startsWith("0x")) {
            const offChainDataSchema = (await this.veraxSdk.schema.findOneById(attestation.offchainData.schemaId)) as
              | Schema
              | undefined;

            if (!offChainDataSchema) {
              this.setStructuredOffchainDataError(attestation.offchainData, {
                code: "MALFORMED_FETCHED_CONTENT",
                message: "Malformed fetched off-chain content: referenced schema was not found.",
              });
              return;
            }

            const decodedPayload = decodeWithRetry(offChainDataSchema.schema, responseContent as Hex);
            if (!decodedPayload.length) {
              this.setStructuredOffchainDataError(attestation.offchainData, {
                code: "MALFORMED_FETCHED_CONTENT",
                message: "Malformed fetched off-chain content: could not decode IPFS response with referenced schema.",
              });
              return;
            }

            attestation.decodedPayload = decodedPayload as object;
          } else {
            attestation.decodedPayload = response as unknown as object;
          }
        } catch (error) {
          attestation.offchainData.error = (error as Error).message;
        }
      }
    }
  }

  private getOffchainDataPointer(decodedPayload: unknown): OffchainData {
    const pointer = Array.isArray(decodedPayload) ? decodedPayload[0] : undefined;

    if (
      !this.isRecord(pointer) ||
      typeof pointer.schemaId !== "string" ||
      pointer.schemaId.length === 0 ||
      typeof pointer.uri !== "string" ||
      pointer.uri.length === 0
    ) {
      return this.createOffchainData("", "", {
        code: "MALFORMED_POINTER",
        message: "Malformed off-chain pointer: expected decoded payload with string schemaId and uri.",
      });
    }

    return this.createOffchainData(pointer.schemaId, pointer.uri);
  }

  private createOffchainData(schemaId: string, uri: string, error?: StructuredOffchainDataError): OffchainData {
    const offchainData: EnrichedOffchainData = { schemaId, uri };

    if (error) {
      offchainData.error = error;
    }

    return offchainData as OffchainData;
  }

  private setStructuredOffchainDataError(offchainData: OffchainData, error: StructuredOffchainDataError) {
    (offchainData as EnrichedOffchainData).error = error;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  async getRelatedAttestations(id: string) {
    return this.findBy(
      undefined,
      undefined,
      {
        attestationData_contains: id,
        schema_in: [Constants.RELATIONSHIP_SCHEMA_ID, Constants.NAMED_GRAPH_RELATIONSHIP_SCHEMA_ID],
      },
      undefined,
      undefined,
    );
  }

  async simulateMassImport(portalAddress: Address, attestationPayloads: AttestationPayload[]) {
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

    return this.simulateContract("massImport", [attestationPayloadsArg, portalAddress]);
  }

  async massImport(portalAddress: Address, attestationPayloads: AttestationPayload[], options?: TransactionOptions) {
    const request = await this.simulateMassImport(portalAddress, attestationPayloads);
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
  }

  async simulateIncrementVersionNumber() {
    return this.simulateContract("incrementVersionNumber", []);
  }

  async incrementVersionNumber(options?: TransactionOptions) {
    const request = await this.simulateIncrementVersionNumber();
    return executeTransaction(request, this.web3Client, this.walletClient, options?.waitForConfirmation);
  }

  async isRegistered(attestationId: string) {
    return this.executeReadMethod("isRegistered", [attestationId]);
  }

  async isRevocable(portalId: string) {
    return this.executeReadMethod("isRevocable", [portalId]);
  }

  async getAttestation(attestationId: string) {
    return this.executeReadMethod("getAttestation", [attestationId]);
  }

  async getVersionNumber() {
    return this.executeReadMethod("getVersionNumber", []);
  }

  async getAttestationIdCounter() {
    return this.executeReadMethod("getAttestationIdCounter", []);
  }

  async balanceOf(account: Address, id: number) {
    return this.executeReadMethod("balanceOf", [account, id]);
  }

  async balanceOfBatch(accounts: Address[], ids: number[]) {
    return this.executeReadMethod("balanceOfBatch", [accounts, ids]);
  }

  private async executeReadMethod(functionName: string, args: unknown[]) {
    return this.web3Client.readContract({
      abi: abiAttestationRegistry,
      address: this.conf.attestationRegistryAddress,
      functionName,
      args,
    });
  }

  private async executeReadMethodForChain(chainName: ChainName, functionName: string, args: unknown[]) {
    const chainConf = this.getConfForChain(chainName);
    if (!chainConf?.attestationRegistryAddress) {
      throw new Error(`No contract address found for chain ${chainName}`);
    }

    let chainReadClient = this.chainReadClients.get(chainName);
    if (!chainReadClient) {
      chainReadClient = createPublicClient({
        chain: chainConf.chain,
        transport: http(chainConf.rpcUrl),
      });
      this.chainReadClients.set(chainName, chainReadClient);
    }

    return chainReadClient.readContract({
      abi: abiAttestationRegistry,
      address: chainConf.attestationRegistryAddress,
      functionName,
      args,
    });
  }

  private toAttestationCount(count: unknown) {
    if (typeof count === "number") return count;
    if (typeof count === "bigint") return Number(count);
    return 0;
  }

  private getConfForChain(chainName: ChainName) {
    const confByChainName = {
      [ChainName.LINEA_MAINNET]: VeraxSdk.DEFAULT_LINEA_MAINNET,
      [ChainName.LINEA_SEPOLIA]: VeraxSdk.DEFAULT_LINEA_SEPOLIA,
      [ChainName.ARBITRUM_MAINNET]: VeraxSdk.DEFAULT_ARBITRUM,
      [ChainName.ARBITRUM_SEPOLIA]: VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA,
      [ChainName.BASE_MAINNET]: VeraxSdk.DEFAULT_BASE,
      [ChainName.BASE_SEPOLIA]: VeraxSdk.DEFAULT_BASE_SEPOLIA,
      [ChainName.BSC_MAINNET]: VeraxSdk.DEFAULT_BSC,
      [ChainName.BSC_TESTNET]: VeraxSdk.DEFAULT_BSC_TESTNET,
    };

    return confByChainName[chainName];
  }

  private async simulateContract(functionName: string, args: unknown[]): Promise<WriteContractParameters> {
    if (!this.walletClient) throw new Error("VeraxSDK - Wallet not available");
    try {
      const { request } = await this.web3Client.simulateContract({
        address: this.conf.attestationRegistryAddress,
        abi: abiAttestationRegistry,
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
