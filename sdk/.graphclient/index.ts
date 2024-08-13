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
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export type Aggregation_interval =
  | 'hour'
  | 'day';

export type Attestation = {
  id: Scalars['ID']['output'];
  schemaId: Scalars['Bytes']['output'];
  replacedBy: Scalars['Bytes']['output'];
  attester: Scalars['Bytes']['output'];
  portal: Scalars['Bytes']['output'];
  attestedDate: Scalars['BigInt']['output'];
  expirationDate: Scalars['BigInt']['output'];
  revocationDate: Scalars['BigInt']['output'];
  version: Scalars['BigInt']['output'];
  revoked: Scalars['Boolean']['output'];
  subject: Scalars['Bytes']['output'];
  encodedSubject: Scalars['Bytes']['output'];
  attestationData: Scalars['Bytes']['output'];
  schemaString?: Maybe<Scalars['String']['output']>;
  decodedData?: Maybe<Array<Scalars['String']['output']>>;
};

export type Attestation_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  schemaId?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  replacedBy?: InputMaybe<Scalars['Bytes']['input']>;
  replacedBy_not?: InputMaybe<Scalars['Bytes']['input']>;
  replacedBy_gt?: InputMaybe<Scalars['Bytes']['input']>;
  replacedBy_lt?: InputMaybe<Scalars['Bytes']['input']>;
  replacedBy_gte?: InputMaybe<Scalars['Bytes']['input']>;
  replacedBy_lte?: InputMaybe<Scalars['Bytes']['input']>;
  replacedBy_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  replacedBy_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  replacedBy_contains?: InputMaybe<Scalars['Bytes']['input']>;
  replacedBy_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  attester?: InputMaybe<Scalars['Bytes']['input']>;
  attester_not?: InputMaybe<Scalars['Bytes']['input']>;
  attester_gt?: InputMaybe<Scalars['Bytes']['input']>;
  attester_lt?: InputMaybe<Scalars['Bytes']['input']>;
  attester_gte?: InputMaybe<Scalars['Bytes']['input']>;
  attester_lte?: InputMaybe<Scalars['Bytes']['input']>;
  attester_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  attester_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  attester_contains?: InputMaybe<Scalars['Bytes']['input']>;
  attester_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  portal?: InputMaybe<Scalars['Bytes']['input']>;
  portal_not?: InputMaybe<Scalars['Bytes']['input']>;
  portal_gt?: InputMaybe<Scalars['Bytes']['input']>;
  portal_lt?: InputMaybe<Scalars['Bytes']['input']>;
  portal_gte?: InputMaybe<Scalars['Bytes']['input']>;
  portal_lte?: InputMaybe<Scalars['Bytes']['input']>;
  portal_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  portal_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  portal_contains?: InputMaybe<Scalars['Bytes']['input']>;
  portal_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  attestedDate?: InputMaybe<Scalars['BigInt']['input']>;
  attestedDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  attestedDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  attestedDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  attestedDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  attestedDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  attestedDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  attestedDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expirationDate?: InputMaybe<Scalars['BigInt']['input']>;
  expirationDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  expirationDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expirationDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expirationDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expirationDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expirationDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expirationDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  revocationDate?: InputMaybe<Scalars['BigInt']['input']>;
  revocationDate_not?: InputMaybe<Scalars['BigInt']['input']>;
  revocationDate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  revocationDate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  revocationDate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  revocationDate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  revocationDate_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  revocationDate_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  version?: InputMaybe<Scalars['BigInt']['input']>;
  version_not?: InputMaybe<Scalars['BigInt']['input']>;
  version_gt?: InputMaybe<Scalars['BigInt']['input']>;
  version_lt?: InputMaybe<Scalars['BigInt']['input']>;
  version_gte?: InputMaybe<Scalars['BigInt']['input']>;
  version_lte?: InputMaybe<Scalars['BigInt']['input']>;
  version_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  version_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  revoked?: InputMaybe<Scalars['Boolean']['input']>;
  revoked_not?: InputMaybe<Scalars['Boolean']['input']>;
  revoked_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  revoked_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  subject?: InputMaybe<Scalars['Bytes']['input']>;
  subject_not?: InputMaybe<Scalars['Bytes']['input']>;
  subject_gt?: InputMaybe<Scalars['Bytes']['input']>;
  subject_lt?: InputMaybe<Scalars['Bytes']['input']>;
  subject_gte?: InputMaybe<Scalars['Bytes']['input']>;
  subject_lte?: InputMaybe<Scalars['Bytes']['input']>;
  subject_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subject_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  subject_contains?: InputMaybe<Scalars['Bytes']['input']>;
  subject_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  encodedSubject?: InputMaybe<Scalars['Bytes']['input']>;
  encodedSubject_not?: InputMaybe<Scalars['Bytes']['input']>;
  encodedSubject_gt?: InputMaybe<Scalars['Bytes']['input']>;
  encodedSubject_lt?: InputMaybe<Scalars['Bytes']['input']>;
  encodedSubject_gte?: InputMaybe<Scalars['Bytes']['input']>;
  encodedSubject_lte?: InputMaybe<Scalars['Bytes']['input']>;
  encodedSubject_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  encodedSubject_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  encodedSubject_contains?: InputMaybe<Scalars['Bytes']['input']>;
  encodedSubject_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  attestationData?: InputMaybe<Scalars['Bytes']['input']>;
  attestationData_not?: InputMaybe<Scalars['Bytes']['input']>;
  attestationData_gt?: InputMaybe<Scalars['Bytes']['input']>;
  attestationData_lt?: InputMaybe<Scalars['Bytes']['input']>;
  attestationData_gte?: InputMaybe<Scalars['Bytes']['input']>;
  attestationData_lte?: InputMaybe<Scalars['Bytes']['input']>;
  attestationData_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  attestationData_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  attestationData_contains?: InputMaybe<Scalars['Bytes']['input']>;
  attestationData_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaString?: InputMaybe<Scalars['String']['input']>;
  schemaString_not?: InputMaybe<Scalars['String']['input']>;
  schemaString_gt?: InputMaybe<Scalars['String']['input']>;
  schemaString_lt?: InputMaybe<Scalars['String']['input']>;
  schemaString_gte?: InputMaybe<Scalars['String']['input']>;
  schemaString_lte?: InputMaybe<Scalars['String']['input']>;
  schemaString_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaString_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaString_contains?: InputMaybe<Scalars['String']['input']>;
  schemaString_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaString_not_contains?: InputMaybe<Scalars['String']['input']>;
  schemaString_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaString_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaString_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaString_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaString_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaString_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaString_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaString_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaString_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  decodedData?: InputMaybe<Array<Scalars['String']['input']>>;
  decodedData_not?: InputMaybe<Array<Scalars['String']['input']>>;
  decodedData_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  decodedData_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  decodedData_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  decodedData_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Attestation_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Attestation_filter>>>;
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
  | 'encodedSubject'
  | 'attestationData'
  | 'schemaString'
  | 'decodedData';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Counter = {
  id: Scalars['ID']['output'];
  attestations?: Maybe<Scalars['Int']['output']>;
  modules?: Maybe<Scalars['Int']['output']>;
  portals?: Maybe<Scalars['Int']['output']>;
  schemas?: Maybe<Scalars['Int']['output']>;
};

export type Counter_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  attestations?: InputMaybe<Scalars['Int']['input']>;
  attestations_not?: InputMaybe<Scalars['Int']['input']>;
  attestations_gt?: InputMaybe<Scalars['Int']['input']>;
  attestations_lt?: InputMaybe<Scalars['Int']['input']>;
  attestations_gte?: InputMaybe<Scalars['Int']['input']>;
  attestations_lte?: InputMaybe<Scalars['Int']['input']>;
  attestations_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  attestations_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  modules?: InputMaybe<Scalars['Int']['input']>;
  modules_not?: InputMaybe<Scalars['Int']['input']>;
  modules_gt?: InputMaybe<Scalars['Int']['input']>;
  modules_lt?: InputMaybe<Scalars['Int']['input']>;
  modules_gte?: InputMaybe<Scalars['Int']['input']>;
  modules_lte?: InputMaybe<Scalars['Int']['input']>;
  modules_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  modules_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  portals?: InputMaybe<Scalars['Int']['input']>;
  portals_not?: InputMaybe<Scalars['Int']['input']>;
  portals_gt?: InputMaybe<Scalars['Int']['input']>;
  portals_lt?: InputMaybe<Scalars['Int']['input']>;
  portals_gte?: InputMaybe<Scalars['Int']['input']>;
  portals_lte?: InputMaybe<Scalars['Int']['input']>;
  portals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  portals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  schemas?: InputMaybe<Scalars['Int']['input']>;
  schemas_not?: InputMaybe<Scalars['Int']['input']>;
  schemas_gt?: InputMaybe<Scalars['Int']['input']>;
  schemas_lt?: InputMaybe<Scalars['Int']['input']>;
  schemas_gte?: InputMaybe<Scalars['Int']['input']>;
  schemas_lte?: InputMaybe<Scalars['Int']['input']>;
  schemas_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  schemas_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Counter_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Counter_filter>>>;
};

export type Counter_orderBy =
  | 'id'
  | 'attestations'
  | 'modules'
  | 'portals'
  | 'schemas';

export type Issuer = {
  id: Scalars['ID']['output'];
};

export type Issuer_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Issuer_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Issuer_filter>>>;
};

export type Issuer_orderBy =
  | 'id';

export type Module = {
  id: Scalars['ID']['output'];
  moduleAddress: Scalars['Bytes']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type Module_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  moduleAddress?: InputMaybe<Scalars['Bytes']['input']>;
  moduleAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  moduleAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  moduleAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  moduleAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  moduleAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  moduleAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  moduleAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  moduleAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  moduleAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Module_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Module_filter>>>;
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
  id: Scalars['ID']['output'];
  ownerAddress: Scalars['Bytes']['output'];
  modules?: Maybe<Array<Scalars['Bytes']['output']>>;
  isRevocable: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  ownerName: Scalars['String']['output'];
  attestationCounter?: Maybe<Scalars['Int']['output']>;
};

export type Portal_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  ownerAddress?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  ownerAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  ownerAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  ownerAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  modules?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  modules_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  modules_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  modules_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  modules_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  modules_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  isRevocable?: InputMaybe<Scalars['Boolean']['input']>;
  isRevocable_not?: InputMaybe<Scalars['Boolean']['input']>;
  isRevocable_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isRevocable_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerName?: InputMaybe<Scalars['String']['input']>;
  ownerName_not?: InputMaybe<Scalars['String']['input']>;
  ownerName_gt?: InputMaybe<Scalars['String']['input']>;
  ownerName_lt?: InputMaybe<Scalars['String']['input']>;
  ownerName_gte?: InputMaybe<Scalars['String']['input']>;
  ownerName_lte?: InputMaybe<Scalars['String']['input']>;
  ownerName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ownerName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ownerName_contains?: InputMaybe<Scalars['String']['input']>;
  ownerName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerName_not_contains?: InputMaybe<Scalars['String']['input']>;
  ownerName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerName_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ownerName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerName_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ownerName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ownerName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  attestationCounter?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_not?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_gt?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_lt?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_gte?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_lte?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  attestationCounter_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Portal_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Portal_filter>>>;
};

export type Portal_orderBy =
  | 'id'
  | 'ownerAddress'
  | 'modules'
  | 'isRevocable'
  | 'name'
  | 'description'
  | 'ownerName'
  | 'attestationCounter';

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
  issuer?: Maybe<Issuer>;
  issuers: Array<Issuer>;
  registryVersion?: Maybe<RegistryVersion>;
  registryVersions: Array<RegistryVersion>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryattestationArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryattestationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Attestation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Attestation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymoduleArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymodulesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Module_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Module_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryportalArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryportalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Portal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Portal_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryschemaArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryschemasArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Schema_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Schema_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycounterArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerycountersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Counter_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Counter_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryissuerArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryissuersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Issuer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Issuer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryregistryVersionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryregistryVersionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RegistryVersion_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RegistryVersion_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type RegistryVersion = {
  id: Scalars['ID']['output'];
  versionNumber?: Maybe<Scalars['Int']['output']>;
  timestamp?: Maybe<Scalars['BigInt']['output']>;
};

export type RegistryVersion_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  versionNumber?: InputMaybe<Scalars['Int']['input']>;
  versionNumber_not?: InputMaybe<Scalars['Int']['input']>;
  versionNumber_gt?: InputMaybe<Scalars['Int']['input']>;
  versionNumber_lt?: InputMaybe<Scalars['Int']['input']>;
  versionNumber_gte?: InputMaybe<Scalars['Int']['input']>;
  versionNumber_lte?: InputMaybe<Scalars['Int']['input']>;
  versionNumber_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  versionNumber_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RegistryVersion_filter>>>;
  or?: InputMaybe<Array<InputMaybe<RegistryVersion_filter>>>;
};

export type RegistryVersion_orderBy =
  | 'id'
  | 'versionNumber'
  | 'timestamp';

export type Schema = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  context: Scalars['String']['output'];
  schema: Scalars['String']['output'];
  attestationCounter?: Maybe<Scalars['Int']['output']>;
};

export type Schema_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  context?: InputMaybe<Scalars['String']['input']>;
  context_not?: InputMaybe<Scalars['String']['input']>;
  context_gt?: InputMaybe<Scalars['String']['input']>;
  context_lt?: InputMaybe<Scalars['String']['input']>;
  context_gte?: InputMaybe<Scalars['String']['input']>;
  context_lte?: InputMaybe<Scalars['String']['input']>;
  context_in?: InputMaybe<Array<Scalars['String']['input']>>;
  context_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  context_contains?: InputMaybe<Scalars['String']['input']>;
  context_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  context_not_contains?: InputMaybe<Scalars['String']['input']>;
  context_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  context_starts_with?: InputMaybe<Scalars['String']['input']>;
  context_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  context_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  context_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  context_ends_with?: InputMaybe<Scalars['String']['input']>;
  context_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  context_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  context_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schema?: InputMaybe<Scalars['String']['input']>;
  schema_not?: InputMaybe<Scalars['String']['input']>;
  schema_gt?: InputMaybe<Scalars['String']['input']>;
  schema_lt?: InputMaybe<Scalars['String']['input']>;
  schema_gte?: InputMaybe<Scalars['String']['input']>;
  schema_lte?: InputMaybe<Scalars['String']['input']>;
  schema_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schema_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schema_contains?: InputMaybe<Scalars['String']['input']>;
  schema_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_not_contains?: InputMaybe<Scalars['String']['input']>;
  schema_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_starts_with?: InputMaybe<Scalars['String']['input']>;
  schema_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  schema_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_ends_with?: InputMaybe<Scalars['String']['input']>;
  schema_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  schema_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  attestationCounter?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_not?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_gt?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_lt?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_gte?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_lte?: InputMaybe<Scalars['Int']['input']>;
  attestationCounter_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  attestationCounter_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Schema_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Schema_filter>>>;
};

export type Schema_orderBy =
  | 'id'
  | 'name'
  | 'description'
  | 'context'
  | 'schema'
  | 'attestationCounter';

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
  issuer?: Maybe<Issuer>;
  issuers: Array<Issuer>;
  registryVersion?: Maybe<RegistryVersion>;
  registryVersions: Array<RegistryVersion>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionattestationArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionattestationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Attestation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Attestation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmoduleArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmodulesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Module_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Module_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionportalArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionportalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Portal_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Portal_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionschemaArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionschemasArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Schema_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Schema_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncounterArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptioncountersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Counter_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Counter_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionissuerArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionissuersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Issuer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Issuer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionregistryVersionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionregistryVersionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RegistryVersion_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<RegistryVersion_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
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
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
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
  Aggregation_interval: Aggregation_interval;
  Attestation: ResolverTypeWrapper<Attestation>;
  Attestation_filter: Attestation_filter;
  Attestation_orderBy: Attestation_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']['output']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']['output']>;
  Counter: ResolverTypeWrapper<Counter>;
  Counter_filter: Counter_filter;
  Counter_orderBy: Counter_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']['output']>;
  Issuer: ResolverTypeWrapper<Issuer>;
  Issuer_filter: Issuer_filter;
  Issuer_orderBy: Issuer_orderBy;
  Module: ResolverTypeWrapper<Module>;
  Module_filter: Module_filter;
  Module_orderBy: Module_orderBy;
  OrderDirection: OrderDirection;
  Portal: ResolverTypeWrapper<Portal>;
  Portal_filter: Portal_filter;
  Portal_orderBy: Portal_orderBy;
  Query: ResolverTypeWrapper<{}>;
  RegistryVersion: ResolverTypeWrapper<RegistryVersion>;
  RegistryVersion_filter: RegistryVersion_filter;
  RegistryVersion_orderBy: RegistryVersion_orderBy;
  Schema: ResolverTypeWrapper<Schema>;
  Schema_filter: Schema_filter;
  Schema_orderBy: Schema_orderBy;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Attestation: Attestation;
  Attestation_filter: Attestation_filter;
  BigDecimal: Scalars['BigDecimal']['output'];
  BigInt: Scalars['BigInt']['output'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean']['output'];
  Bytes: Scalars['Bytes']['output'];
  Counter: Counter;
  Counter_filter: Counter_filter;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Int8: Scalars['Int8']['output'];
  Issuer: Issuer;
  Issuer_filter: Issuer_filter;
  Module: Module;
  Module_filter: Module_filter;
  Portal: Portal;
  Portal_filter: Portal_filter;
  Query: {};
  RegistryVersion: RegistryVersion;
  RegistryVersion_filter: RegistryVersion_filter;
  Schema: Schema;
  Schema_filter: Schema_filter;
  String: Scalars['String']['output'];
  Subscription: {};
  Timestamp: Scalars['Timestamp']['output'];
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String']['input'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String']['input'];
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
  encodedSubject?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
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

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type IssuerResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Issuer'] = ResolversParentTypes['Issuer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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
  attestationCounter?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
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
  issuer?: Resolver<Maybe<ResolversTypes['Issuer']>, ParentType, ContextType, RequireFields<QueryissuerArgs, 'id' | 'subgraphError'>>;
  issuers?: Resolver<Array<ResolversTypes['Issuer']>, ParentType, ContextType, RequireFields<QueryissuersArgs, 'skip' | 'first' | 'subgraphError'>>;
  registryVersion?: Resolver<Maybe<ResolversTypes['RegistryVersion']>, ParentType, ContextType, RequireFields<QueryregistryVersionArgs, 'id' | 'subgraphError'>>;
  registryVersions?: Resolver<Array<ResolversTypes['RegistryVersion']>, ParentType, ContextType, RequireFields<QueryregistryVersionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type RegistryVersionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['RegistryVersion'] = ResolversParentTypes['RegistryVersion']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  versionNumber?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SchemaResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Schema'] = ResolversParentTypes['Schema']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  context?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schema?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  attestationCounter?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
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
  issuer?: SubscriptionResolver<Maybe<ResolversTypes['Issuer']>, "issuer", ParentType, ContextType, RequireFields<SubscriptionissuerArgs, 'id' | 'subgraphError'>>;
  issuers?: SubscriptionResolver<Array<ResolversTypes['Issuer']>, "issuers", ParentType, ContextType, RequireFields<SubscriptionissuersArgs, 'skip' | 'first' | 'subgraphError'>>;
  registryVersion?: SubscriptionResolver<Maybe<ResolversTypes['RegistryVersion']>, "registryVersion", ParentType, ContextType, RequireFields<SubscriptionregistryVersionArgs, 'id' | 'subgraphError'>>;
  registryVersions?: SubscriptionResolver<Array<ResolversTypes['RegistryVersion']>, "registryVersions", ParentType, ContextType, RequireFields<SubscriptionregistryVersionsArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export interface TimestampScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type _Block_Resolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  parentHash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
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
  Int8?: GraphQLScalarType;
  Issuer?: IssuerResolvers<ContextType>;
  Module?: ModuleResolvers<ContextType>;
  Portal?: PortalResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RegistryVersion?: RegistryVersionResolvers<ContextType>;
  Schema?: SchemaResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = LineaAttestationRegistryTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

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
              config: {"endpoint":"https://api.studio.thegraph.com/query/67521/verax-v1-linea/v0.0.1"},
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

export const pollingInterval = null;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions()
        .then(meshOptions => getMesh(meshOptions))
        .then(newMesh =>
          meshInstance$.then(oldMesh => {
            oldMesh.destroy()
            meshInstance$ = Promise.resolve(newMesh)
          })
        ).catch(err => {
          console.error("Mesh polling failed so the existing version will be used:", err);
        });
      }, pollingInterval)
    }
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