import BaseDataMapper from "./BaseDataMapper";
import { abiAttestationRegistry } from "../abi/AttestationRegistry";
import { Attestation, AttestationPayload, AttestationWithDecodeObject, Schema } from "../types";
import { Attestation_filter, Attestation_orderBy, OrderDirection } from "../../.graphclient";
import { Constants } from "../utils/constants";
import { handleSimulationError } from "../utils/simulationErrorHandler";
import { Address } from "viem";
import { decodeWithRetry, encode } from "../utils/abiCoder";
import { executeTransaction } from "../utils/transactionSender";

export default class AttestationDataMapper extends BaseDataMapper<
  Attestation,
  Attestation_filter,
  Attestation_orderBy
> {
  typeName = "attestation";
  gqlInterface = `{
            id
            schemaId
            replacedBy
            attester
            portal
            attestedDate
            expirationDate
            revocationDate
            version
            revoked
            subject
            attestationData
            schemaString
            decodedData
  }`;

  override async findOneById(id: string) {
    const attestation = await super.findOneById(id);
    if (attestation !== undefined) {
      const schema = (await this.veraxSdk.schema.getSchema(attestation.schemaId)) as Schema;
      attestation.decodedPayload = decodeWithRetry(schema.schema, attestation.attestationData as `0x${string}`);
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
    attestations.forEach(async (attestation) => {
      const schema = (await this.veraxSdk.schema.getSchema(attestation.schemaId)) as Schema;
      attestation.decodedPayload = decodeWithRetry(schema.schema, attestation.attestationData as `0x${string}`);
    });

    return attestations;
  }

  async getRelatedAttestations(id: string) {
    return this.findBy(
      undefined,
      undefined,
      {
        attestationData_contains: id,
        schemaId_in: [Constants.RELATIONSHIP_SCHEMA_ID, Constants.NAMED_GRAPH_RELATIONSHIP_SCHEMA_ID],
      },
      undefined,
      undefined,
    );
  }

  async simulateUpdateRouter(routerAddress: Address) {
    return this.simulateContract("updateRouter", [routerAddress]);
  }

  async updateRouter(routerAddress: Address) {
    const request = await this.simulateUpdateRouter(routerAddress);
    return executeTransaction(this.walletClient, request);
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

  async massImport(portalAddress: Address, attestationPayloads: AttestationPayload[]) {
    const request = await this.simulateMassImport(portalAddress, attestationPayloads);
    return executeTransaction(this.walletClient, request);
  }

  async simulateIncrementVersionNumber() {
    return this.simulateContract("incrementVersionNumber", []);
  }

  async incrementVersionNumber() {
    const request = await this.simulateIncrementVersionNumber();
    return executeTransaction(this.walletClient, request);
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

  async getAttestationWithDecodeObject(attestationId: string) {
    const attestation = await this.findOneById(attestationId);
    if (!attestation) {
      return null;
    }
    const attestationWithDecodeObject: AttestationWithDecodeObject = { ...attestation, decodeObject: {} };
    const schema = (await this.veraxSdk.schema.getSchema(attestation.schemaId)) as Schema;
    const splitSchema = schema.schema.split(",");
    const schemaFields = splitSchema.map<string>((item) => item.trim().split(" ")[1]);
    for (let i = 0; i < schemaFields.length; i++) {
      attestationWithDecodeObject.decodeObject[schemaFields[i]] = attestation.decodedData[i];
    }
    return attestationWithDecodeObject;
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

  private async simulateContract(functionName: string, args: unknown[]) {
    if (!this.walletClient) throw new Error("Account not available");
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
      handleSimulationError(err);
    }
  }
}
