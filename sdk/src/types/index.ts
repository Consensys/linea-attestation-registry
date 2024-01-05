import { Address, Chain, EIP1193Provider } from "viem";
import { SDKMode } from "../utils/constants";

export interface Conf {
  chain: Chain;
  mode: SDKMode;
  subgraphUrl: string;
  portalRegistryAddress: Address;
  moduleRegistryAddress: Address;
  schemaRegistryAddress: Address;
  attestationRegistryAddress: Address;
}

export type AttestationPayload = {
  schemaId: string; // The identifier of the schema this attestation adheres to.
  expirationDate: number; // The expiration date of the attestation.
  subject: string; // The ID of the attestee, EVM address, DID, URL etc.
  attestationData: object[]; // The attestation data.
};

export type AttestationWithDecodeObject = Attestation & {
  decodeObject: { [propName: string]: unknown };
};

export type Attestation = OnChainAttestation & {
  id: string;
  schemaString: string;
  decodedData: string[];
  decodedPayload: object;
  offchainData?: OffchainData;
};

export type OffchainData = { schemaId: string; uri: string; error?: string };

export type OnChainAttestation = {
  attestationId: string; // The unique identifier of the attestation.
  schemaId: string; // The identifier of the schema this attestation adheres to.
  replacedBy: string | null; // Whether the attestation was replaced by a new one.
  attester: Address; // The address issuing the attestation to the subject.
  portal: Address; // The id of the portal that created the attestation.
  attestedDate: number; // The date the attestation is issued.
  expirationDate: number; // The expiration date of the attestation.
  revocationDate: number | null; // The date when the attestation was revoked.
  version: number; // Version of the registry when the attestation was created.
  revoked: boolean; // Whether the attestation is revoked or not.
  subject: string; // The ID of the attestee, EVM address, DID, URL etc.
  attestationData: string; // The attestation data.
};

export type Schema = {
  id: string; // The ID of the schema.
  name: string; // The name of the schema.
  description: string; // A description of the schema.
  context: string; // The context of the schema.
  schema: string; // The schema definition.
};

export type Portal = {
  id: Address; // The unique identifier of the portal (address).
  ownerAddress: Address; // The address of the owner of this portal.
  modules: Address[]; // Addresses of modules implemented by the portal.
  isRevocable: boolean; // Whether attestations issued can be revoked.
  name: string; // The name of the portal.
  description: string; // A description of the portal.
  ownerName: string; // The name of the owner of this portal.
};

export type Module = OnChainModule & { id: string };

export type OnChainModule = {
  moduleAddress: Address; // The address of the module.
  name: string; // The name of the module.
  description: string; // A description of the module.
};

declare global {
  interface Window {
    ethereum: EIP1193Provider;
  }
}
