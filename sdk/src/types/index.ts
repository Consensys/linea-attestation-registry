import { Address, Chain, EIP1193Provider } from "viem";
import { SDKMode } from "../utils/constants";
import {
  MultichainAttestationsQueryQuery,
  MultichainPortalsQueryQuery,
  MultichainSchemasQueryQuery,
  MultichainModulesQueryQuery,
  MultichainAttestationsQueryQueryVariables,
  MultichainPortalsQueryQueryVariables,
  MultichainSchemasQueryQueryVariables,
  MultichainModulesQueryQueryVariables,
} from "../../.graphclient";

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

export type Attestation = OnChainAttestation & {
  id: string;
  decodedData: string[];
  decodedPayload: object;
  offchainData?: OffchainData;
  chainName?: string;
};

export type OffchainData = { schemaId: string; uri: string; error?: string };

export type OnChainAttestation = {
  attestationId: string; // The unique identifier of the attestation.
  schema: Schema; // The Schema this attestation adheres to.
  replacedBy: string | null; // Whether the attestation was replaced by a new one.
  attester: Address; // The address issuing the attestation to the subject.
  portal: Portal; // The Portal that created the attestation.
  attestedDate: number; // The date the attestation is issued.
  expirationDate: number; // The expiration date of the attestation.
  revocationDate: number | null; // The date when the attestation was revoked.
  version: number; // Version of the registry when the attestation was created.
  revoked: boolean; // Whether the attestation is revoked or not.
  subject: string; // The ID of the attestee, EVM address, DID, URL, etc., tentatively decoded as an ETH address.
  encodedSubject: string; // The raw version of the subject, as it was registered on-chain.
  attestationData: string; // The attestation data.
};

export type Schema = {
  id: string; // The ID of the schema.
  name: string; // The name of the schema.
  description: string; // A description of the schema.
  context: string; // The context of the schema.
  schema: string; // The schema definition.
  attestationCounter: number; // The number of attestations issued with this schema.
  chainName?: string;
};

export type Portal = {
  id: Address; // The unique identifier of the portal (address).
  ownerAddress: Address; // The address of the owner of this portal.
  modules: Address[]; // Addresses of modules implemented by the portal.
  isRevocable: boolean; // Whether attestations issued can be revoked.
  name: string; // The name of the portal.
  description: string; // A description of the portal.
  ownerName: string; // The name of the owner of this portal.
  attestationCounter: number; // The number of attestations issued by the portal.
  chainName?: string;
};

export type Module = OnChainModule & { id: string };

export type OnChainModule = {
  moduleAddress: Address; // The address of the module.
  name: string; // The name of the module.
  description: string; // A description of the module.
  chainName?: string;
};

export type CrossChainClient = {
  MultichainAttestationsQuery(
    variables: MultichainAttestationsQueryQueryVariables,
    options?: unknown,
  ): Promise<MultichainAttestationsQueryQuery>;
  MultichainPortalsQuery(
    variables: MultichainPortalsQueryQueryVariables,
    options?: unknown,
  ): Promise<MultichainPortalsQueryQuery>;
  MultichainSchemasQuery(
    variables: MultichainSchemasQueryQueryVariables,
    options?: unknown,
  ): Promise<MultichainSchemasQueryQuery>;
  MultichainModulesQuery(
    variables: MultichainModulesQueryQueryVariables,
    options?: unknown,
  ): Promise<MultichainModulesQueryQuery>;
};

export enum ChainName {
  LINEA_MAINNET = "verax-v2-linea",
  LINEA_SEPOLIA = "verax-v2-linea-sepolia",
  ARBITRUM_NOVA = "verax-v2-arbitrum-nova",
  ARBITRUM_SEPOLIA = "verax-v2-arbitrum-sepolia",
  ARBITRUM_MAINNET = "verax-v2-arbitrum",
  BASE_MAINNET = "verax-v2-base",
  BASE_SEPOLIA = "verax-v2-base-sepolia",
  BSC_MAINNET = "verax-v2-bsc",
  BSC_TESTNET = "verax-v2-bsc-testnet",
}

declare global {
  interface Window {
    ethereum: EIP1193Provider;
  }
}
