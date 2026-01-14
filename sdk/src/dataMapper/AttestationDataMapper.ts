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
import { Address, Hex, WriteContractParameters } from "viem";
import { decodeWithRetry, encode } from "../utils/abiCoder";
import { executeTransaction } from "../utils/transactionSender";
import { getIPFSContent } from "../utils/ipfsClient";
import { VeraxSdk } from "../VeraxSdk";

export default class AttestationDataMapper extends BaseDataMapper<
  Attestation,
  Attestation_filter,
  Attestation_orderBy
> {
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
        return typeof count === "number" ? count : 0;
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
      attestation.offchainData = {
        schemaId: (attestation.decodedPayload as OffchainData[])[0].schemaId,
        uri: (attestation.decodedPayload as OffchainData[])[0].uri,
      };
      attestation.decodedPayload = {};
      if (attestation.offchainData.uri.startsWith("ipfs://")) {
        try {
          const ipfsHash = attestation.offchainData.uri.split("//")[1];
          const response = await getIPFSContent(ipfsHash);
          if (response.toString().startsWith("0x")) {
            const offChainDataSchema = (await this.veraxSdk.schema.findOneById(
              attestation.offchainData.schemaId,
            )) as Schema;
            attestation.decodedPayload = decodeWithRetry(offChainDataSchema.schema, attestation.attestationData as Hex);
          } else {
            attestation.decodedPayload = response as unknown as object;
          }
        } catch (error) {
          attestation.offchainData.error = (error as Error).message;
        }
      }
    }
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
    const registryAddresses = {
      [ChainName.LINEA_MAINNET]: VeraxSdk.DEFAULT_LINEA_MAINNET.attestationRegistryAddress,
      [ChainName.LINEA_SEPOLIA]: VeraxSdk.DEFAULT_LINEA_SEPOLIA.attestationRegistryAddress,
      [ChainName.ARBITRUM_MAINNET]: VeraxSdk.DEFAULT_ARBITRUM.attestationRegistryAddress,
      [ChainName.ARBITRUM_SEPOLIA]: VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA.attestationRegistryAddress,
      [ChainName.BASE_MAINNET]: VeraxSdk.DEFAULT_BASE.attestationRegistryAddress,
      [ChainName.BASE_SEPOLIA]: VeraxSdk.DEFAULT_BASE_SEPOLIA.attestationRegistryAddress,
      [ChainName.BSC_MAINNET]: VeraxSdk.DEFAULT_BSC.attestationRegistryAddress,
      [ChainName.BSC_TESTNET]: VeraxSdk.DEFAULT_BSC_TESTNET.attestationRegistryAddress,
    };

    const contractAddress = registryAddresses[chainName] as Address;
    if (!contractAddress) {
      throw new Error(`No contract address found for chain ${chainName}`);
    }

    return this.executeReadMethod(functionName, args);
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
