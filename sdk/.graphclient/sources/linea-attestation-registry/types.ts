// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace LineaAttestationRegistryTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  schema: Schema;
  replacedBy: Scalars['Bytes']['output'];
  attester: Scalars['Bytes']['output'];
  portal: Portal;
  attestedDate: Scalars['BigInt']['output'];
  expirationDate: Scalars['BigInt']['output'];
  revocationDate: Scalars['BigInt']['output'];
  version: Scalars['BigInt']['output'];
  revoked: Scalars['Boolean']['output'];
  subject: Scalars['Bytes']['output'];
  encodedSubject: Scalars['Bytes']['output'];
  attestationData: Scalars['Bytes']['output'];
  decodedData?: Maybe<Array<Scalars['String']['output']>>;
  auditInformation: AuditInformation;
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
  schema_?: InputMaybe<Schema_filter>;
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
  portal?: InputMaybe<Scalars['String']['input']>;
  portal_not?: InputMaybe<Scalars['String']['input']>;
  portal_gt?: InputMaybe<Scalars['String']['input']>;
  portal_lt?: InputMaybe<Scalars['String']['input']>;
  portal_gte?: InputMaybe<Scalars['String']['input']>;
  portal_lte?: InputMaybe<Scalars['String']['input']>;
  portal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  portal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  portal_contains?: InputMaybe<Scalars['String']['input']>;
  portal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  portal_not_contains?: InputMaybe<Scalars['String']['input']>;
  portal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  portal_starts_with?: InputMaybe<Scalars['String']['input']>;
  portal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  portal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  portal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  portal_ends_with?: InputMaybe<Scalars['String']['input']>;
  portal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  portal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  portal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  portal_?: InputMaybe<Portal_filter>;
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
  decodedData?: InputMaybe<Array<Scalars['String']['input']>>;
  decodedData_not?: InputMaybe<Array<Scalars['String']['input']>>;
  decodedData_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  decodedData_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  decodedData_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  decodedData_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_?: InputMaybe<AuditInformation_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Attestation_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Attestation_filter>>>;
};

export type Attestation_orderBy =
  | 'id'
  | 'schema'
  | 'schema__id'
  | 'schema__name'
  | 'schema__description'
  | 'schema__context'
  | 'schema__schema'
  | 'schema__attestationCounter'
  | 'replacedBy'
  | 'attester'
  | 'portal'
  | 'portal__id'
  | 'portal__ownerAddress'
  | 'portal__isRevocable'
  | 'portal__name'
  | 'portal__description'
  | 'portal__ownerName'
  | 'portal__attestationCounter'
  | 'attestedDate'
  | 'expirationDate'
  | 'revocationDate'
  | 'version'
  | 'revoked'
  | 'subject'
  | 'encodedSubject'
  | 'attestationData'
  | 'decodedData'
  | 'auditInformation'
  | 'auditInformation__id';

export type Audit = {
  id: Scalars['ID']['output'];
  blockNumber: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  transactionTimestamp: Scalars['BigInt']['output'];
  fromAddress: Scalars['Bytes']['output'];
  toAddress?: Maybe<Scalars['Bytes']['output']>;
  valueTransferred?: Maybe<Scalars['BigInt']['output']>;
  gasPrice?: Maybe<Scalars['BigInt']['output']>;
};

export type AuditInformation = {
  id: Scalars['ID']['output'];
  creation: Audit;
  lastModification: Audit;
  modifications: Array<Audit>;
};


export type AuditInformationmodificationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Audit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Audit_filter>;
};

export type AuditInformation_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  creation?: InputMaybe<Scalars['String']['input']>;
  creation_not?: InputMaybe<Scalars['String']['input']>;
  creation_gt?: InputMaybe<Scalars['String']['input']>;
  creation_lt?: InputMaybe<Scalars['String']['input']>;
  creation_gte?: InputMaybe<Scalars['String']['input']>;
  creation_lte?: InputMaybe<Scalars['String']['input']>;
  creation_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creation_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  creation_contains?: InputMaybe<Scalars['String']['input']>;
  creation_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creation_not_contains?: InputMaybe<Scalars['String']['input']>;
  creation_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  creation_starts_with?: InputMaybe<Scalars['String']['input']>;
  creation_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creation_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  creation_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creation_ends_with?: InputMaybe<Scalars['String']['input']>;
  creation_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creation_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  creation_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  creation_?: InputMaybe<Audit_filter>;
  lastModification?: InputMaybe<Scalars['String']['input']>;
  lastModification_not?: InputMaybe<Scalars['String']['input']>;
  lastModification_gt?: InputMaybe<Scalars['String']['input']>;
  lastModification_lt?: InputMaybe<Scalars['String']['input']>;
  lastModification_gte?: InputMaybe<Scalars['String']['input']>;
  lastModification_lte?: InputMaybe<Scalars['String']['input']>;
  lastModification_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lastModification_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lastModification_contains?: InputMaybe<Scalars['String']['input']>;
  lastModification_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lastModification_not_contains?: InputMaybe<Scalars['String']['input']>;
  lastModification_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  lastModification_starts_with?: InputMaybe<Scalars['String']['input']>;
  lastModification_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastModification_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  lastModification_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastModification_ends_with?: InputMaybe<Scalars['String']['input']>;
  lastModification_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastModification_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  lastModification_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lastModification_?: InputMaybe<Audit_filter>;
  modifications?: InputMaybe<Array<Scalars['String']['input']>>;
  modifications_not?: InputMaybe<Array<Scalars['String']['input']>>;
  modifications_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  modifications_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  modifications_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  modifications_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  modifications_?: InputMaybe<Audit_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AuditInformation_filter>>>;
  or?: InputMaybe<Array<InputMaybe<AuditInformation_filter>>>;
};

export type AuditInformation_orderBy =
  | 'id'
  | 'creation'
  | 'creation__id'
  | 'creation__blockNumber'
  | 'creation__transactionHash'
  | 'creation__transactionTimestamp'
  | 'creation__fromAddress'
  | 'creation__toAddress'
  | 'creation__valueTransferred'
  | 'creation__gasPrice'
  | 'lastModification'
  | 'lastModification__id'
  | 'lastModification__blockNumber'
  | 'lastModification__transactionHash'
  | 'lastModification__transactionTimestamp'
  | 'lastModification__fromAddress'
  | 'lastModification__toAddress'
  | 'lastModification__valueTransferred'
  | 'lastModification__gasPrice'
  | 'modifications';

export type Audit_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  transactionTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  transactionTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  transactionTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  transactionTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  transactionTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  fromAddress?: InputMaybe<Scalars['Bytes']['input']>;
  fromAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  fromAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  fromAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  fromAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  fromAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  fromAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  fromAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  fromAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  fromAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  toAddress?: InputMaybe<Scalars['Bytes']['input']>;
  toAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  toAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  toAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  toAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  toAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  toAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  toAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  toAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  toAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  valueTransferred?: InputMaybe<Scalars['BigInt']['input']>;
  valueTransferred_not?: InputMaybe<Scalars['BigInt']['input']>;
  valueTransferred_gt?: InputMaybe<Scalars['BigInt']['input']>;
  valueTransferred_lt?: InputMaybe<Scalars['BigInt']['input']>;
  valueTransferred_gte?: InputMaybe<Scalars['BigInt']['input']>;
  valueTransferred_lte?: InputMaybe<Scalars['BigInt']['input']>;
  valueTransferred_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  valueTransferred_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Audit_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Audit_filter>>>;
};

export type Audit_orderBy =
  | 'id'
  | 'blockNumber'
  | 'transactionHash'
  | 'transactionTimestamp'
  | 'fromAddress'
  | 'toAddress'
  | 'valueTransferred'
  | 'gasPrice';

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
  auditInformation: AuditInformation;
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
  auditInformation?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_?: InputMaybe<AuditInformation_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Issuer_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Issuer_filter>>>;
};

export type Issuer_orderBy =
  | 'id'
  | 'auditInformation'
  | 'auditInformation__id';

export type Module = {
  id: Scalars['ID']['output'];
  moduleAddress: Scalars['Bytes']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  auditInformation: AuditInformation;
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
  auditInformation?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_?: InputMaybe<AuditInformation_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Module_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Module_filter>>>;
};

export type Module_orderBy =
  | 'id'
  | 'moduleAddress'
  | 'name'
  | 'description'
  | 'auditInformation'
  | 'auditInformation__id';

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
  auditInformation: AuditInformation;
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
  auditInformation?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_?: InputMaybe<AuditInformation_filter>;
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
  | 'attestationCounter'
  | 'auditInformation'
  | 'auditInformation__id';

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
  auditInformation?: Maybe<AuditInformation>;
  auditInformations: Array<AuditInformation>;
  audit?: Maybe<Audit>;
  audits: Array<Audit>;
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


export type QueryauditInformationArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryauditInformationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AuditInformation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AuditInformation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryauditArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryauditsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Audit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Audit_filter>;
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
  auditInformation: AuditInformation;
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
  auditInformation?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_?: InputMaybe<AuditInformation_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RegistryVersion_filter>>>;
  or?: InputMaybe<Array<InputMaybe<RegistryVersion_filter>>>;
};

export type RegistryVersion_orderBy =
  | 'id'
  | 'versionNumber'
  | 'timestamp'
  | 'auditInformation'
  | 'auditInformation__id';

export type Schema = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  description: Scalars['String']['output'];
  context: Scalars['String']['output'];
  schema: Scalars['String']['output'];
  attestationCounter?: Maybe<Scalars['Int']['output']>;
  auditInformation: AuditInformation;
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
  auditInformation?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lt?: InputMaybe<Scalars['String']['input']>;
  auditInformation_gte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_lte?: InputMaybe<Scalars['String']['input']>;
  auditInformation_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  auditInformation_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  auditInformation_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  auditInformation_?: InputMaybe<AuditInformation_filter>;
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
  | 'attestationCounter'
  | 'auditInformation'
  | 'auditInformation__id';

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
  auditInformation?: Maybe<AuditInformation>;
  auditInformations: Array<AuditInformation>;
  audit?: Maybe<Audit>;
  audits: Array<Audit>;
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


export type SubscriptionauditInformationArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionauditInformationsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AuditInformation_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AuditInformation_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionauditArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionauditsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Audit_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Audit_filter>;
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
  /** null **/
  issuer: InContextSdkMethod<Query['issuer'], QueryissuerArgs, MeshContext>,
  /** null **/
  issuers: InContextSdkMethod<Query['issuers'], QueryissuersArgs, MeshContext>,
  /** null **/
  registryVersion: InContextSdkMethod<Query['registryVersion'], QueryregistryVersionArgs, MeshContext>,
  /** null **/
  registryVersions: InContextSdkMethod<Query['registryVersions'], QueryregistryVersionsArgs, MeshContext>,
  /** null **/
  auditInformation: InContextSdkMethod<Query['auditInformation'], QueryauditInformationArgs, MeshContext>,
  /** null **/
  auditInformations: InContextSdkMethod<Query['auditInformations'], QueryauditInformationsArgs, MeshContext>,
  /** null **/
  audit: InContextSdkMethod<Query['audit'], QueryauditArgs, MeshContext>,
  /** null **/
  audits: InContextSdkMethod<Query['audits'], QueryauditsArgs, MeshContext>,
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
  /** null **/
  issuer: InContextSdkMethod<Subscription['issuer'], SubscriptionissuerArgs, MeshContext>,
  /** null **/
  issuers: InContextSdkMethod<Subscription['issuers'], SubscriptionissuersArgs, MeshContext>,
  /** null **/
  registryVersion: InContextSdkMethod<Subscription['registryVersion'], SubscriptionregistryVersionArgs, MeshContext>,
  /** null **/
  registryVersions: InContextSdkMethod<Subscription['registryVersions'], SubscriptionregistryVersionsArgs, MeshContext>,
  /** null **/
  auditInformation: InContextSdkMethod<Subscription['auditInformation'], SubscriptionauditInformationArgs, MeshContext>,
  /** null **/
  auditInformations: InContextSdkMethod<Subscription['auditInformations'], SubscriptionauditInformationsArgs, MeshContext>,
  /** null **/
  audit: InContextSdkMethod<Subscription['audit'], SubscriptionauditArgs, MeshContext>,
  /** null **/
  audits: InContextSdkMethod<Subscription['audits'], SubscriptionauditsArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["linea-attestation-registry"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      ["chainName"]: Scalars['ID']
    };
}
