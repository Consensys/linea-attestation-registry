// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace LineaAttestationRegistryTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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

  export type QuerySdk = {
      /** null **/
  attestation: InContextSdkMethod<Query['attestation'], QueryattestationArgs, MeshContext>,
  /** null **/
  attestations: InContextSdkMethod<Query['attestations'], QueryattestationsArgs, MeshContext>,
  /** null **/
  module: InContextSdkMethod<Query['module'], QuerymoduleArgs, MeshContext>,
  /** null **/
  modules: InContextSdkMethod<Query['modules'], QuerymodulesArgs, MeshContext>,
  /** null **/
  portal: InContextSdkMethod<Query['portal'], QueryportalArgs, MeshContext>,
  /** null **/
  portals: InContextSdkMethod<Query['portals'], QueryportalsArgs, MeshContext>,
  /** null **/
  schema: InContextSdkMethod<Query['schema'], QueryschemaArgs, MeshContext>,
  /** null **/
  schemas: InContextSdkMethod<Query['schemas'], QueryschemasArgs, MeshContext>,
  /** null **/
  counter: InContextSdkMethod<Query['counter'], QuerycounterArgs, MeshContext>,
  /** null **/
  counters: InContextSdkMethod<Query['counters'], QuerycountersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  attestation: InContextSdkMethod<Subscription['attestation'], SubscriptionattestationArgs, MeshContext>,
  /** null **/
  attestations: InContextSdkMethod<Subscription['attestations'], SubscriptionattestationsArgs, MeshContext>,
  /** null **/
  module: InContextSdkMethod<Subscription['module'], SubscriptionmoduleArgs, MeshContext>,
  /** null **/
  modules: InContextSdkMethod<Subscription['modules'], SubscriptionmodulesArgs, MeshContext>,
  /** null **/
  portal: InContextSdkMethod<Subscription['portal'], SubscriptionportalArgs, MeshContext>,
  /** null **/
  portals: InContextSdkMethod<Subscription['portals'], SubscriptionportalsArgs, MeshContext>,
  /** null **/
  schema: InContextSdkMethod<Subscription['schema'], SubscriptionschemaArgs, MeshContext>,
  /** null **/
  schemas: InContextSdkMethod<Subscription['schemas'], SubscriptionschemasArgs, MeshContext>,
  /** null **/
  counter: InContextSdkMethod<Subscription['counter'], SubscriptioncounterArgs, MeshContext>,
  /** null **/
  counters: InContextSdkMethod<Subscription['counters'], SubscriptioncountersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["linea-attestation-registry"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
