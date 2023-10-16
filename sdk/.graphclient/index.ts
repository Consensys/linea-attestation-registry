// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import BareMerger from "@graphql-mesh/merger-bare";
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { LineaAttestationRegistryTypes } from './sources/linea-attestation-registry/types';
import * as importedModule$0 from "./sources/linea-attestation-registry/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
};

export type Attestation = {
  id: Scalars['ID'];
  schemaId: Scalars['Bytes'];
  replacedBy: Scalars['Bytes'];
  attester: Scalars['Bytes'];
  portal: Scalars['Bytes'];
  attestedDate: Scalars['BigInt'];
  expirationDate: Scalars['BigInt'];
  revocationDate: Scalars['BigInt'];
  version: Scalars['BigInt'];
  revoked: Scalars['Boolean'];
  subject: Scalars['Bytes'];
  attestationData: Scalars['Bytes'];
  schemaString?: Maybe<Scalars['String']>;
  decodedData?: Maybe<Array<Scalars['String']>>;
};

export type Attestation_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  schemaId?: InputMaybe<Scalars['Bytes']>;
  schemaId_not?: InputMaybe<Scalars['Bytes']>;
  schemaId_in?: InputMaybe<Array<Scalars['Bytes']>>;
  schemaId_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  schemaId_contains?: InputMaybe<Scalars['Bytes']>;
  schemaId_not_contains?: InputMaybe<Scalars['Bytes']>;
  replacedBy?: InputMaybe<Scalars['Bytes']>;
  replacedBy_not?: InputMaybe<Scalars['Bytes']>;
  replacedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  replacedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  replacedBy_contains?: InputMaybe<Scalars['Bytes']>;
  replacedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  attester?: InputMaybe<Scalars['Bytes']>;
  attester_not?: InputMaybe<Scalars['Bytes']>;
  attester_in?: InputMaybe<Array<Scalars['Bytes']>>;
  attester_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  attester_contains?: InputMaybe<Scalars['Bytes']>;
  attester_not_contains?: InputMaybe<Scalars['Bytes']>;
  portal?: InputMaybe<Scalars['Bytes']>;
  portal_not?: InputMaybe<Scalars['Bytes']>;
  portal_in?: InputMaybe<Array<Scalars['Bytes']>>;
  portal_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  portal_contains?: InputMaybe<Scalars['Bytes']>;
  portal_not_contains?: InputMaybe<Scalars['Bytes']>;
  attestedDate?: InputMaybe<Scalars['BigInt']>;
  attestedDate_not?: InputMaybe<Scalars['BigInt']>;
  attestedDate_gt?: InputMaybe<Scalars['BigInt']>;
  attestedDate_lt?: InputMaybe<Scalars['BigInt']>;
  attestedDate_gte?: InputMaybe<Scalars['BigInt']>;
  attestedDate_lte?: InputMaybe<Scalars['BigInt']>;
  attestedDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  attestedDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expirationDate?: InputMaybe<Scalars['BigInt']>;
  expirationDate_not?: InputMaybe<Scalars['BigInt']>;
  expirationDate_gt?: InputMaybe<Scalars['BigInt']>;
  expirationDate_lt?: InputMaybe<Scalars['BigInt']>;
  expirationDate_gte?: InputMaybe<Scalars['BigInt']>;
  expirationDate_lte?: InputMaybe<Scalars['BigInt']>;
  expirationDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  expirationDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  revocationDate?: InputMaybe<Scalars['BigInt']>;
  revocationDate_not?: InputMaybe<Scalars['BigInt']>;
  revocationDate_gt?: InputMaybe<Scalars['BigInt']>;
  revocationDate_lt?: InputMaybe<Scalars['BigInt']>;
  revocationDate_gte?: InputMaybe<Scalars['BigInt']>;
  revocationDate_lte?: InputMaybe<Scalars['BigInt']>;
  revocationDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  revocationDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  version?: InputMaybe<Scalars['BigInt']>;
  version_not?: InputMaybe<Scalars['BigInt']>;
  version_gt?: InputMaybe<Scalars['BigInt']>;
  version_lt?: InputMaybe<Scalars['BigInt']>;
  version_gte?: InputMaybe<Scalars['BigInt']>;
  version_lte?: InputMaybe<Scalars['BigInt']>;
  version_in?: InputMaybe<Array<Scalars['BigInt']>>;
  version_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  revoked?: InputMaybe<Scalars['Boolean']>;
  revoked_not?: InputMaybe<Scalars['Boolean']>;
  revoked_in?: InputMaybe<Array<Scalars['Boolean']>>;
  revoked_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  subject?: InputMaybe<Scalars['Bytes']>;
  subject_not?: InputMaybe<Scalars['Bytes']>;
  subject_in?: InputMaybe<Array<Scalars['Bytes']>>;
  subject_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  subject_contains?: InputMaybe<Scalars['Bytes']>;
  subject_not_contains?: InputMaybe<Scalars['Bytes']>;
  attestationData?: InputMaybe<Scalars['Bytes']>;
  attestationData_not?: InputMaybe<Scalars['Bytes']>;
  attestationData_in?: InputMaybe<Array<Scalars['Bytes']>>;
  attestationData_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  attestationData_contains?: InputMaybe<Scalars['Bytes']>;
  attestationData_not_contains?: InputMaybe<Scalars['Bytes']>;
  schemaString?: InputMaybe<Scalars['String']>;
  schemaString_not?: InputMaybe<Scalars['String']>;
  schemaString_gt?: InputMaybe<Scalars['String']>;
  schemaString_lt?: InputMaybe<Scalars['String']>;
  schemaString_gte?: InputMaybe<Scalars['String']>;
  schemaString_lte?: InputMaybe<Scalars['String']>;
  schemaString_in?: InputMaybe<Array<Scalars['String']>>;
  schemaString_not_in?: InputMaybe<Array<Scalars['String']>>;
  schemaString_contains?: InputMaybe<Scalars['String']>;
  schemaString_contains_nocase?: InputMaybe<Scalars['String']>;
  schemaString_not_contains?: InputMaybe<Scalars['String']>;
  schemaString_not_contains_nocase?: InputMaybe<Scalars['String']>;
  schemaString_starts_with?: InputMaybe<Scalars['String']>;
  schemaString_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schemaString_not_starts_with?: InputMaybe<Scalars['String']>;
  schemaString_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schemaString_ends_with?: InputMaybe<Scalars['String']>;
  schemaString_ends_with_nocase?: InputMaybe<Scalars['String']>;
  schemaString_not_ends_with?: InputMaybe<Scalars['String']>;
  schemaString_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  decodedData?: InputMaybe<Array<Scalars['String']>>;
  decodedData_not?: InputMaybe<Array<Scalars['String']>>;
  decodedData_contains?: InputMaybe<Array<Scalars['String']>>;
  decodedData_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  decodedData_not_contains?: InputMaybe<Array<Scalars['String']>>;
  decodedData_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Attestation_orderBy =
  | 'id'
  | 'schemaId'
  | 'replacedBy'
  | 'attester'
  | 'portal'
  | 'attestedDate'
  | 'expirationDate'
  | 'revocationDate'
  | 'version'
  | 'revoked'
  | 'subject'
  | 'attestationData'
  | 'schemaString'
  | 'decodedData';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Counter = {
  id: Scalars['ID'];
  attestations?: Maybe<Scalars['Int']>;
  modules?: Maybe<Scalars['Int']>;
  portals?: Maybe<Scalars['Int']>;
  schemas?: Maybe<Scalars['Int']>;
};

export type Counter_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  attestations?: InputMaybe<Scalars['Int']>;
  attestations_not?: InputMaybe<Scalars['Int']>;
  attestations_gt?: InputMaybe<Scalars['Int']>;
  attestations_lt?: InputMaybe<Scalars['Int']>;
  attestations_gte?: InputMaybe<Scalars['Int']>;
  attestations_lte?: InputMaybe<Scalars['Int']>;
  attestations_in?: InputMaybe<Array<Scalars['Int']>>;
  attestations_not_in?: InputMaybe<Array<Scalars['Int']>>;
  modules?: InputMaybe<Scalars['Int']>;
  modules_not?: InputMaybe<Scalars['Int']>;
  modules_gt?: InputMaybe<Scalars['Int']>;
  modules_lt?: InputMaybe<Scalars['Int']>;
  modules_gte?: InputMaybe<Scalars['Int']>;
  modules_lte?: InputMaybe<Scalars['Int']>;
  modules_in?: InputMaybe<Array<Scalars['Int']>>;
  modules_not_in?: InputMaybe<Array<Scalars['Int']>>;
  portals?: InputMaybe<Scalars['Int']>;
  portals_not?: InputMaybe<Scalars['Int']>;
  portals_gt?: InputMaybe<Scalars['Int']>;
  portals_lt?: InputMaybe<Scalars['Int']>;
  portals_gte?: InputMaybe<Scalars['Int']>;
  portals_lte?: InputMaybe<Scalars['Int']>;
  portals_in?: InputMaybe<Array<Scalars['Int']>>;
  portals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  schemas?: InputMaybe<Scalars['Int']>;
  schemas_not?: InputMaybe<Scalars['Int']>;
  schemas_gt?: InputMaybe<Scalars['Int']>;
  schemas_lt?: InputMaybe<Scalars['Int']>;
  schemas_gte?: InputMaybe<Scalars['Int']>;
  schemas_lte?: InputMaybe<Scalars['Int']>;
  schemas_in?: InputMaybe<Array<Scalars['Int']>>;
  schemas_not_in?: InputMaybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Counter_orderBy =
  | 'id'
  | 'attestations'
  | 'modules'
  | 'portals'
  | 'schemas';

export type Module = {
  id: Scalars['ID'];
  moduleAddress: Scalars['Bytes'];
  name: Scalars['String'];
  description: Scalars['String'];
};

export type Module_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  moduleAddress?: InputMaybe<Scalars['Bytes']>;
  moduleAddress_not?: InputMaybe<Scalars['Bytes']>;
  moduleAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  moduleAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  moduleAddress_contains?: InputMaybe<Scalars['Bytes']>;
  moduleAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Module_orderBy =
  | 'id'
  | 'moduleAddress'
  | 'name'
  | 'description';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Portal = {
  id: Scalars['ID'];
  ownerAddress: Scalars['Bytes'];
  modules?: Maybe<Array<Scalars['Bytes']>>;
  isRevocable: Scalars['Boolean'];
  name: Scalars['String'];
  description: Scalars['String'];
  ownerName: Scalars['String'];
};

export type Portal_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ownerAddress?: InputMaybe<Scalars['Bytes']>;
  ownerAddress_not?: InputMaybe<Scalars['Bytes']>;
  ownerAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  ownerAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  ownerAddress_contains?: InputMaybe<Scalars['Bytes']>;
  ownerAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  modules?: InputMaybe<Array<Scalars['Bytes']>>;
  modules_not?: InputMaybe<Array<Scalars['Bytes']>>;
  modules_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  modules_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  modules_not_contains?: InputMaybe<Array<Scalars['Bytes']>>;
  modules_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']>>;
  isRevocable?: InputMaybe<Scalars['Boolean']>;
  isRevocable_not?: InputMaybe<Scalars['Boolean']>;
  isRevocable_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isRevocable_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerName?: InputMaybe<Scalars['String']>;
  ownerName_not?: InputMaybe<Scalars['String']>;
  ownerName_gt?: InputMaybe<Scalars['String']>;
  ownerName_lt?: InputMaybe<Scalars['String']>;
  ownerName_gte?: InputMaybe<Scalars['String']>;
  ownerName_lte?: InputMaybe<Scalars['String']>;
  ownerName_in?: InputMaybe<Array<Scalars['String']>>;
  ownerName_not_in?: InputMaybe<Array<Scalars['String']>>;
  ownerName_contains?: InputMaybe<Scalars['String']>;
  ownerName_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerName_not_contains?: InputMaybe<Scalars['String']>;
  ownerName_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerName_starts_with?: InputMaybe<Scalars['String']>;
  ownerName_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerName_not_starts_with?: InputMaybe<Scalars['String']>;
  ownerName_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerName_ends_with?: InputMaybe<Scalars['String']>;
  ownerName_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerName_not_ends_with?: InputMaybe<Scalars['String']>;
  ownerName_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Portal_orderBy =
  | 'id'
  | 'ownerAddress'
  | 'modules'
  | 'isRevocable'
  | 'name'
  | 'description'
  | 'ownerName';

export type Query = {
  attestation?: Maybe<Attestation>;
  attestations: Array<Attestation>;
  module?: Maybe<Module>;
  modules: Array<Module>;
  portal?: Maybe<Portal>;
  portals: Array<Portal>;
  schema?: Maybe<Schema>;
  schemas: Array<Schema>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryattestationArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryattestationsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Attestation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Attestation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymoduleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymodulesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Module_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Module_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryportalArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryportalsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Portal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Portal_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryschemaArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryschemasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Schema_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Schema_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycounterArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycountersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Counter_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Counter_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Schema = {
  id: Scalars['ID'];
  name: Scalars['String'];
  description: Scalars['String'];
  context: Scalars['String'];
  schema: Scalars['String'];
};

export type Schema_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  context?: InputMaybe<Scalars['String']>;
  context_not?: InputMaybe<Scalars['String']>;
  context_gt?: InputMaybe<Scalars['String']>;
  context_lt?: InputMaybe<Scalars['String']>;
  context_gte?: InputMaybe<Scalars['String']>;
  context_lte?: InputMaybe<Scalars['String']>;
  context_in?: InputMaybe<Array<Scalars['String']>>;
  context_not_in?: InputMaybe<Array<Scalars['String']>>;
  context_contains?: InputMaybe<Scalars['String']>;
  context_contains_nocase?: InputMaybe<Scalars['String']>;
  context_not_contains?: InputMaybe<Scalars['String']>;
  context_not_contains_nocase?: InputMaybe<Scalars['String']>;
  context_starts_with?: InputMaybe<Scalars['String']>;
  context_starts_with_nocase?: InputMaybe<Scalars['String']>;
  context_not_starts_with?: InputMaybe<Scalars['String']>;
  context_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  context_ends_with?: InputMaybe<Scalars['String']>;
  context_ends_with_nocase?: InputMaybe<Scalars['String']>;
  context_not_ends_with?: InputMaybe<Scalars['String']>;
  context_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  schema?: InputMaybe<Scalars['String']>;
  schema_not?: InputMaybe<Scalars['String']>;
  schema_gt?: InputMaybe<Scalars['String']>;
  schema_lt?: InputMaybe<Scalars['String']>;
  schema_gte?: InputMaybe<Scalars['String']>;
  schema_lte?: InputMaybe<Scalars['String']>;
  schema_in?: InputMaybe<Array<Scalars['String']>>;
  schema_not_in?: InputMaybe<Array<Scalars['String']>>;
  schema_contains?: InputMaybe<Scalars['String']>;
  schema_contains_nocase?: InputMaybe<Scalars['String']>;
  schema_not_contains?: InputMaybe<Scalars['String']>;
  schema_not_contains_nocase?: InputMaybe<Scalars['String']>;
  schema_starts_with?: InputMaybe<Scalars['String']>;
  schema_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schema_not_starts_with?: InputMaybe<Scalars['String']>;
  schema_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  schema_ends_with?: InputMaybe<Scalars['String']>;
  schema_ends_with_nocase?: InputMaybe<Scalars['String']>;
  schema_not_ends_with?: InputMaybe<Scalars['String']>;
  schema_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
};

export type Schema_orderBy =
  | 'id'
  | 'name'
  | 'description'
  | 'context'
  | 'schema';

export type Subscription = {
  attestation?: Maybe<Attestation>;
  attestations: Array<Attestation>;
  module?: Maybe<Module>;
  modules: Array<Module>;
  portal?: Maybe<Portal>;
  portals: Array<Portal>;
  schema?: Maybe<Schema>;
  schemas: Array<Schema>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionattestationArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionattestationsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Attestation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Attestation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmoduleArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmodulesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Module_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Module_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionportalArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionportalsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Portal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Portal_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionschemaArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionschemasArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Schema_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Schema_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncounterArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncountersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Counter_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Counter_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Attestation: ResolverTypeWrapper<Attestation>;
  Attestation_filter: Attestation_filter;
  Attestation_orderBy: Attestation_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Counter: ResolverTypeWrapper<Counter>;
  Counter_filter: Counter_filter;
  Counter_orderBy: Counter_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Module: ResolverTypeWrapper<Module>;
  Module_filter: Module_filter;
  Module_orderBy: Module_orderBy;
  OrderDirection: OrderDirection;
  Portal: ResolverTypeWrapper<Portal>;
  Portal_filter: Portal_filter;
  Portal_orderBy: Portal_orderBy;
  Query: ResolverTypeWrapper<{}>;
  Schema: ResolverTypeWrapper<Schema>;
  Schema_filter: Schema_filter;
  Schema_orderBy: Schema_orderBy;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Attestation: Attestation;
  Attestation_filter: Attestation_filter;
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  Counter: Counter;
  Counter_filter: Counter_filter;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Module: Module;
  Module_filter: Module_filter;
  Portal: Portal;
  Portal_filter: Portal_filter;
  Query: {};
  Schema: Schema;
  Schema_filter: Schema_filter;
  String: Scalars['String'];
  Subscription: {};
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AttestationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Attestation'] = ResolversParentTypes['Attestation']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  schemaId?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  replacedBy?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  attester?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  portal?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  attestedDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  expirationDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  revocationDate?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  revoked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  subject?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  attestationData?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  schemaString?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  decodedData?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type CounterResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Counter'] = ResolversParentTypes['Counter']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  attestations?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  modules?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  portals?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  schemas?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ModuleResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Module'] = ResolversParentTypes['Module']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moduleAddress?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PortalResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Portal'] = ResolversParentTypes['Portal']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ownerAddress?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  modules?: Resolver<Maybe<Array<ResolversTypes['Bytes']>>, ParentType, ContextType>;
  isRevocable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  attestation?: Resolver<Maybe<ResolversTypes['Attestation']>, ParentType, ContextType, RequireFields<QueryattestationArgs, 'id' | 'subgraphError'>>;
  attestations?: Resolver<Array<ResolversTypes['Attestation']>, ParentType, ContextType, RequireFields<QueryattestationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  module?: Resolver<Maybe<ResolversTypes['Module']>, ParentType, ContextType, RequireFields<QuerymoduleArgs, 'id' | 'subgraphError'>>;
  modules?: Resolver<Array<ResolversTypes['Module']>, ParentType, ContextType, RequireFields<QuerymodulesArgs, 'skip' | 'first' | 'subgraphError'>>;
  portal?: Resolver<Maybe<ResolversTypes['Portal']>, ParentType, ContextType, RequireFields<QueryportalArgs, 'id' | 'subgraphError'>>;
  portals?: Resolver<Array<ResolversTypes['Portal']>, ParentType, ContextType, RequireFields<QueryportalsArgs, 'skip' | 'first' | 'subgraphError'>>;
  schema?: Resolver<Maybe<ResolversTypes['Schema']>, ParentType, ContextType, RequireFields<QueryschemaArgs, 'id' | 'subgraphError'>>;
  schemas?: Resolver<Array<ResolversTypes['Schema']>, ParentType, ContextType, RequireFields<QueryschemasArgs, 'skip' | 'first' | 'subgraphError'>>;
  counter?: Resolver<Maybe<ResolversTypes['Counter']>, ParentType, ContextType, RequireFields<QuerycounterArgs, 'id' | 'subgraphError'>>;
  counters?: Resolver<Array<ResolversTypes['Counter']>, ParentType, ContextType, RequireFields<QuerycountersArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SchemaResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Schema'] = ResolversParentTypes['Schema']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  context?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schema?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  attestation?: SubscriptionResolver<Maybe<ResolversTypes['Attestation']>, "attestation", ParentType, ContextType, RequireFields<SubscriptionattestationArgs, 'id' | 'subgraphError'>>;
  attestations?: SubscriptionResolver<Array<ResolversTypes['Attestation']>, "attestations", ParentType, ContextType, RequireFields<SubscriptionattestationsArgs, 'skip' | 'first' | 'subgraphError'>>;
  module?: SubscriptionResolver<Maybe<ResolversTypes['Module']>, "module", ParentType, ContextType, RequireFields<SubscriptionmoduleArgs, 'id' | 'subgraphError'>>;
  modules?: SubscriptionResolver<Array<ResolversTypes['Module']>, "modules", ParentType, ContextType, RequireFields<SubscriptionmodulesArgs, 'skip' | 'first' | 'subgraphError'>>;
  portal?: SubscriptionResolver<Maybe<ResolversTypes['Portal']>, "portal", ParentType, ContextType, RequireFields<SubscriptionportalArgs, 'id' | 'subgraphError'>>;
  portals?: SubscriptionResolver<Array<ResolversTypes['Portal']>, "portals", ParentType, ContextType, RequireFields<SubscriptionportalsArgs, 'skip' | 'first' | 'subgraphError'>>;
  schema?: SubscriptionResolver<Maybe<ResolversTypes['Schema']>, "schema", ParentType, ContextType, RequireFields<SubscriptionschemaArgs, 'id' | 'subgraphError'>>;
  schemas?: SubscriptionResolver<Array<ResolversTypes['Schema']>, "schemas", ParentType, ContextType, RequireFields<SubscriptionschemasArgs, 'skip' | 'first' | 'subgraphError'>>;
  counter?: SubscriptionResolver<Maybe<ResolversTypes['Counter']>, "counter", ParentType, ContextType, RequireFields<SubscriptioncounterArgs, 'id' | 'subgraphError'>>;
  counters?: SubscriptionResolver<Array<ResolversTypes['Counter']>, "counters", ParentType, ContextType, RequireFields<SubscriptioncountersArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Attestation?: AttestationResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Counter?: CounterResolvers<ContextType>;
  Module?: ModuleResolvers<ContextType>;
  Portal?: PortalResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Schema?: SchemaResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = LineaAttestationRegistryTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/linea-attestation-registry/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const lineaAttestationRegistryTransforms = [];
const additionalTypeDefs = [] as any[];
const lineaAttestationRegistryHandler = new GraphqlHandler({
              name: "linea-attestation-registry",
              config: {"endpoint":"https://graph-query.linea.build/subgraphs/name/Consensys/linea-attestation-registry"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("linea-attestation-registry"),
              logger: logger.child("linea-attestation-registry"),
              importFn,
            });
sources[0] = {
          name: 'linea-attestation-registry',
          handler: lineaAttestationRegistryHandler,
          transforms: lineaAttestationRegistryTransforms
        }
const additionalResolvers = [] as any[]
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));