import { PublicClient, WalletClient } from "viem";
import { ChainName, Conf, CrossChainClient } from "../types";
import { OrderDirection } from "../../.graphclient";
import { VeraxSdk } from "../VeraxSdk";
import { subgraphCall } from "../utils/graphClientHelper";
import { getCustomGraphSDKForChains } from "../utils/graphClientBuilder";
import { getSDKForChains } from "../utils/meshInstanceManager";
import { getConfiguredSubgraphUrl } from "../utils/urlResolver";
import { NetworkType, inferNetworkType } from "../utils/networkTypeUtils";

type FilterTypeName = "attestation" | "module" | "portal" | "schema" | "auditInformation" | "audit" | "blockChanged";

const GRAPHQL_NAME_PATTERN = /^[_A-Za-z][_0-9A-Za-z]*$/;
const GRAPHQL_ID_PATTERN = /^[A-Za-z0-9_.:-]+$/;
const MAX_GRAPHQL_INT = 2147483647;

const ID_FILTER_SUFFIXES = ["", "_not", "_gt", "_lt", "_gte", "_lte", "_in", "_not_in"] as const;
const STRING_FILTER_SUFFIXES = [
  ...ID_FILTER_SUFFIXES,
  "_contains",
  "_contains_nocase",
  "_not_contains",
  "_not_contains_nocase",
  "_starts_with",
  "_starts_with_nocase",
  "_not_starts_with",
  "_not_starts_with_nocase",
  "_ends_with",
  "_ends_with_nocase",
  "_not_ends_with",
  "_not_ends_with_nocase",
] as const;
const BYTES_FILTER_SUFFIXES = [...ID_FILTER_SUFFIXES, "_contains", "_not_contains"] as const;
const BOOLEAN_FILTER_SUFFIXES = ["", "_not", "_in", "_not_in"] as const;
const ARRAY_FILTER_SUFFIXES = ["", "_not", "_contains", "_not_contains"] as const;
const ARRAY_STRING_FILTER_SUFFIXES = [
  "",
  "_not",
  "_contains",
  "_contains_nocase",
  "_not_contains",
  "_not_contains_nocase",
] as const;

function buildFilterKeys(
  fields: Record<string, readonly string[]>,
  nestedFilterKeys: readonly string[] = [],
): ReadonlySet<string> {
  return new Set([
    ...Object.entries(fields).flatMap(([field, suffixes]) => suffixes.map((suffix) => `${field}${suffix}`)),
    ...nestedFilterKeys,
    "_change_block",
    "and",
    "or",
  ]);
}

const FILTER_KEYS_BY_TYPE: Record<FilterTypeName, ReadonlySet<string>> = {
  attestation: buildFilterKeys(
    {
      id: ID_FILTER_SUFFIXES,
      schema: STRING_FILTER_SUFFIXES,
      replacedBy: BYTES_FILTER_SUFFIXES,
      attester: BYTES_FILTER_SUFFIXES,
      portal: STRING_FILTER_SUFFIXES,
      attestedDate: ID_FILTER_SUFFIXES,
      expirationDate: ID_FILTER_SUFFIXES,
      revocationDate: ID_FILTER_SUFFIXES,
      version: ID_FILTER_SUFFIXES,
      revoked: BOOLEAN_FILTER_SUFFIXES,
      subject: BYTES_FILTER_SUFFIXES,
      encodedSubject: BYTES_FILTER_SUFFIXES,
      attestationData: BYTES_FILTER_SUFFIXES,
      decodedData: ARRAY_STRING_FILTER_SUFFIXES,
      auditInformation: STRING_FILTER_SUFFIXES,
    },
    ["schema_", "portal_", "auditInformation_"],
  ),
  module: buildFilterKeys(
    {
      id: ID_FILTER_SUFFIXES,
      moduleAddress: BYTES_FILTER_SUFFIXES,
      name: STRING_FILTER_SUFFIXES,
      description: STRING_FILTER_SUFFIXES,
      auditInformation: STRING_FILTER_SUFFIXES,
    },
    ["auditInformation_"],
  ),
  portal: buildFilterKeys(
    {
      id: ID_FILTER_SUFFIXES,
      ownerAddress: BYTES_FILTER_SUFFIXES,
      modules: ARRAY_FILTER_SUFFIXES,
      isRevocable: BOOLEAN_FILTER_SUFFIXES,
      name: STRING_FILTER_SUFFIXES,
      description: STRING_FILTER_SUFFIXES,
      ownerName: STRING_FILTER_SUFFIXES,
      attestationCounter: ID_FILTER_SUFFIXES,
      auditInformation: STRING_FILTER_SUFFIXES,
    },
    ["auditInformation_"],
  ),
  schema: buildFilterKeys(
    {
      id: ID_FILTER_SUFFIXES,
      name: STRING_FILTER_SUFFIXES,
      description: STRING_FILTER_SUFFIXES,
      context: STRING_FILTER_SUFFIXES,
      schema: STRING_FILTER_SUFFIXES,
      attestationCounter: ID_FILTER_SUFFIXES,
      auditInformation: STRING_FILTER_SUFFIXES,
    },
    ["auditInformation_"],
  ),
  auditInformation: buildFilterKeys(
    {
      id: ID_FILTER_SUFFIXES,
      creation: STRING_FILTER_SUFFIXES,
      lastModification: STRING_FILTER_SUFFIXES,
      modifications: ARRAY_STRING_FILTER_SUFFIXES,
    },
    ["creation_", "lastModification_", "modifications_"],
  ),
  audit: buildFilterKeys({
    id: ID_FILTER_SUFFIXES,
    blockNumber: ID_FILTER_SUFFIXES,
    transactionHash: BYTES_FILTER_SUFFIXES,
    transactionTimestamp: ID_FILTER_SUFFIXES,
    fromAddress: BYTES_FILTER_SUFFIXES,
    toAddress: BYTES_FILTER_SUFFIXES,
    valueTransferred: ID_FILTER_SUFFIXES,
    gasPrice: ID_FILTER_SUFFIXES,
  }),
  blockChanged: new Set(["number_gte"]),
};

const NESTED_FILTER_TYPES: Partial<Record<FilterTypeName, Record<string, FilterTypeName>>> = {
  attestation: {
    schema_: "schema",
    portal_: "portal",
    auditInformation_: "auditInformation",
    _change_block: "blockChanged",
  },
  module: {
    auditInformation_: "auditInformation",
    _change_block: "blockChanged",
  },
  portal: {
    auditInformation_: "auditInformation",
    _change_block: "blockChanged",
  },
  schema: {
    auditInformation_: "auditInformation",
    _change_block: "blockChanged",
  },
  auditInformation: {
    creation_: "audit",
    lastModification_: "audit",
    modifications_: "audit",
    _change_block: "blockChanged",
  },
  audit: {
    _change_block: "blockChanged",
  },
};

const ORDER_FIELDS_BY_TYPE: Partial<Record<FilterTypeName, ReadonlySet<string>>> = {
  attestation: new Set([
    "id",
    "schema",
    "schema__id",
    "schema__name",
    "schema__description",
    "schema__context",
    "schema__schema",
    "schema__attestationCounter",
    "replacedBy",
    "attester",
    "portal",
    "portal__id",
    "portal__ownerAddress",
    "portal__isRevocable",
    "portal__name",
    "portal__description",
    "portal__ownerName",
    "portal__attestationCounter",
    "attestedDate",
    "expirationDate",
    "revocationDate",
    "version",
    "revoked",
    "subject",
    "encodedSubject",
    "attestationData",
    "decodedData",
    "auditInformation",
    "auditInformation__id",
  ]),
  module: new Set(["id", "moduleAddress", "name", "description", "auditInformation", "auditInformation__id"]),
  portal: new Set([
    "id",
    "ownerAddress",
    "modules",
    "isRevocable",
    "name",
    "description",
    "ownerName",
    "attestationCounter",
    "auditInformation",
    "auditInformation__id",
  ]),
  schema: new Set([
    "id",
    "name",
    "description",
    "context",
    "schema",
    "attestationCounter",
    "auditInformation",
    "auditInformation__id",
  ]),
};

function isRecord(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export default abstract class BaseDataMapper<T, TFilter, TOrder> {
  protected readonly conf: Conf;
  protected readonly web3Client: PublicClient;
  protected readonly walletClient: WalletClient | undefined;
  protected readonly veraxSdk: VeraxSdk;
  protected abstract typeName: string;
  protected abstract gqlInterface: string;

  /**
   * Cache of cross-chain clients keyed by network type.
   * Maintains separate clients for mainnet and testnet to prevent cache pollution.
   */
  private crossChainClients: Map<NetworkType, Promise<CrossChainClient>> = new Map();

  constructor(_conf: Conf, _web3Client: PublicClient, _veraxSdk: VeraxSdk, _walletClient?: WalletClient) {
    this.conf = _conf;
    this.web3Client = _web3Client;
    this.veraxSdk = _veraxSdk;
    this.walletClient = _walletClient;
  }

  /**
   * Gets a cross-chain client for the specified chain names.
   * Automatically infers the network type (mainnet/testnet) and returns
   * an appropriately isolated client to prevent cache pollution.
   *
   * @param chainNames - Array of chain names to query
   * @returns Promise resolving to a CrossChainClient
   * @throws Error if chain names mix mainnet and testnet
   */
  protected async getCrossChainClient(chainNames: (ChainName | string)[]): Promise<CrossChainClient> {
    const networkType = inferNetworkType(chainNames);

    // Check if we have a cached client for this network type
    let clientPromise = this.crossChainClients.get(networkType);

    if (!clientPromise) {
      // Create new client with proper isolation
      if (this.conf.subgraphUrlOverrides) {
        // Use custom SDK builder with URL overrides
        clientPromise = getCustomGraphSDKForChains(chainNames, this.conf.subgraphUrlOverrides);
      } else {
        // Use standard SDK with network-type isolation
        clientPromise = getSDKForChains(chainNames);
      }

      this.crossChainClients.set(networkType, clientPromise);
    }

    return clientPromise;
  }

  async findOneById(id: string) {
    const safeId = this.validateId(id);
    const query = `query get_${this.typeName}($id: ID!) { ${this.typeName}(id: $id) ${this.gqlInterface} }`;

    const subgraphUrl = getConfiguredSubgraphUrl(this.conf);
    const { data, status } = await subgraphCall(query, subgraphUrl, { id: safeId });

    if (status != 200) {
      throw new Error(`Error(s) while fetching ${this.typeName}`);
    }

    return data?.data ? (data.data[`${this.typeName}`] as T) : undefined;
  }

  async findBy(first?: number, skip?: number, where?: TFilter, orderBy?: TOrder, orderDirection?: OrderDirection) {
    const variables = {
      first: this.validatePaginationValue("first", first, 100),
      skip: this.validatePaginationValue("skip", skip, 0),
      where: this.validateWhere(where),
      orderBy: this.validateOrderBy(orderBy),
      orderDirection: this.validateOrderDirection(orderDirection),
    };
    const graphQLTypeName = this.getGraphQLTypeName();
    const query = `
        query get_${this.typeName}s(
          $first: Int
          $skip: Int
          $where: ${graphQLTypeName}_filter
          $orderBy: ${graphQLTypeName}_orderBy
          $orderDirection: OrderDirection
        ){
          ${this.typeName}s(
            first: $first
            skip: $skip
            where: $where
            orderBy: $orderBy
            orderDirection: $orderDirection
          )
          ${this.gqlInterface}
        }
    `;

    const subgraphUrl = getConfiguredSubgraphUrl(this.conf);
    const { data, status } = await subgraphCall(query, subgraphUrl, variables);

    if (status != 200) {
      throw new Error(`Error(s) while fetching ${this.typeName}s`);
    }

    return data?.data ? (data.data[`${this.typeName}s`] as T[]) : [];
  }

  async findTotalCount() {
    const query = `query get_${this.typeName}_Counter { counters { ${this.typeName}s } }`;

    const subgraphUrl = getConfiguredSubgraphUrl(this.conf);
    const { data, status } = await subgraphCall(query, subgraphUrl);

    if (status != 200) {
      throw new Error(`Error(s) while fetching total count of ${this.typeName}s`);
    }

    return data?.data ? data.data["counters"][0][`${this.typeName}s`] : 0;
  }

  private getGraphQLTypeName() {
    return `${this.typeName.charAt(0).toUpperCase()}${this.typeName.slice(1)}`;
  }

  private getFilterTypeName() {
    return `${this.typeName.charAt(0).toLowerCase()}${this.typeName.slice(1)}`;
  }

  private validateId(id: unknown) {
    if (typeof id !== "string" || id.length === 0 || !GRAPHQL_ID_PATTERN.test(id)) {
      throw new Error(`Invalid ${this.typeName} id`);
    }

    return id;
  }

  private validatePaginationValue(name: string, value: unknown, defaultValue: number) {
    if (value === undefined) {
      return defaultValue;
    }

    if (!Number.isInteger(value) || (value as number) < 0 || (value as number) > MAX_GRAPHQL_INT) {
      throw new Error(`Invalid pagination value for ${name}`);
    }

    return value as number;
  }

  private validateWhere(where: unknown) {
    if (where === undefined || where === null) {
      return null;
    }

    this.validateFilterObject(where, this.getFilterTypeName(), "where");
    return where as Record<string, unknown>;
  }

  private validateOrderBy(orderBy: unknown) {
    if (orderBy === undefined || orderBy === null) {
      return null;
    }

    if (typeof orderBy !== "string" || !GRAPHQL_NAME_PATTERN.test(orderBy)) {
      throw new Error(`Invalid orderBy field for ${this.typeName}s`);
    }

    const orderFields = ORDER_FIELDS_BY_TYPE[this.getFilterTypeName() as FilterTypeName];
    if (orderFields && !orderFields.has(orderBy)) {
      throw new Error(`Invalid orderBy field for ${this.typeName}s`);
    }

    return orderBy;
  }

  private validateOrderDirection(orderDirection: unknown) {
    if (orderDirection === undefined || orderDirection === null) {
      return null;
    }

    if (orderDirection !== "asc" && orderDirection !== "desc") {
      throw new Error(`Invalid orderDirection for ${this.typeName}s`);
    }

    return orderDirection;
  }

  private validateFilterObject(filter: unknown, filterTypeName: string, path: string) {
    if (filter === null || filter === undefined) {
      return;
    }

    if (!isRecord(filter)) {
      throw new Error(`Invalid filter at ${path}`);
    }

    const filterType = filterTypeName as FilterTypeName;
    const allowedKeys = FILTER_KEYS_BY_TYPE[filterType];
    const nestedTypes = NESTED_FILTER_TYPES[filterType] ?? {};

    for (const [key, value] of Object.entries(filter)) {
      if (!GRAPHQL_NAME_PATTERN.test(key)) {
        throw new Error(`Invalid filter key "${path}.${key}"`);
      }

      if (allowedKeys && !allowedKeys.has(key)) {
        throw new Error(`Invalid filter key "${path}.${key}"`);
      }

      if (key === "and" || key === "or") {
        if (!Array.isArray(value)) {
          throw new Error(`Invalid filter at ${path}.${key}`);
        }

        value.forEach((nestedFilter, index) => {
          this.validateFilterObject(nestedFilter, filterTypeName, `${path}.${key}[${index}]`);
        });
        continue;
      }

      const nestedType = nestedTypes[key];
      if (nestedType) {
        this.validateFilterObject(value, nestedType, `${path}.${key}`);
      }
    }
  }
}
