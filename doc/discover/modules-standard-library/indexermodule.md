---
description: >-
  The IndexerModule provides efficient on-chain indexing of attestations by various parameters (subject, schema,
  attester, portal). It allows for quick retrieval of attestation IDs without relying solely on off-chain indexers.
---

# IndexerModule

## [Link to the code](https://github.com/Consensys/linea-attestation-registry/blob/dev/contracts/src/stdlib/IndexerModuleV2.sol)

## When to use this module?

Use this module when you need:

- On-chain queryability of attestations by subject, schema, attester, or portal
- Fast lookup of all attestations for a specific address or entity
- To build on-chain logic that depends on finding related attestations
- A backup indexing mechanism in case off-chain indexers are unavailable

The IndexerModule is particularly useful for smart contracts that need to query attestations on-chain, such as
reputation systems or access control mechanisms.

## When not to use this module?

Don't use this module if:

- You only need off-chain querying (use the subgraph instead - it's more efficient and cost-effective)
- You're creating many attestations and want to minimize gas costs (indexing adds gas overhead)
- You need to track revoked attestations separately (this module doesn't un-index revoked attestations)

## Important disclaimers

{% hint style="warning" %} **This module has several limitations:**

1. **Does not un-index revoked attestations** - Revoked attestations remain in the index
2. **Does not work as intended with bulk attestations** - The attestation ID prediction may be incorrect during bulk
   operations
3. **Does not consider chain prefix** - The indexed attestation ID doesn't include the chain prefix used by the registry
   {% endhint %}

## How to use this module?

### 1. Include the module when registering your portal

Add the IndexerModule address to your portal's modules array. The module will automatically index attestations as they
are created.

### 2. Query attestations

The IndexerModule provides several public view functions to retrieve attestation IDs:

#### Get attestations by subject

```solidity
function getAttestationIdsBySubject(bytes calldata subject) external view returns (bytes32[] memory);
```

Returns all attestation IDs for a given subject.

#### Get attestations by subject and schema

```solidity
function getAttestationIdsBySubjectBySchema(
  bytes calldata subject,
  bytes32 schemaId
) external view returns (bytes32[] memory);
```

Returns all attestation IDs for a specific subject and schema combination.

#### Get attestations by attester

```solidity
function getAttestationIdsByAttester(address attester) external view returns (bytes32[] memory);
```

Returns all attestation IDs created by a specific attester.

#### Get attestations by schema

```solidity
function getAttestationIdsBySchema(bytes32 schema) external view returns (bytes32[] memory);
```

Returns all attestation IDs using a specific schema.

#### Get attestations by portal

```solidity
function getAttestationIdsByPortal(address portal) external view returns (bytes32[] memory);
```

Returns all attestation IDs created through a specific portal.

#### Get attestations by portal and subject

```solidity
function getAttestationIdsByPortalBySubject(
  address portal,
  bytes calldata subject
) external view returns (bytes32[] memory);
```

Returns all attestation IDs for a specific portal and subject combination.

### 3. Manually index existing attestations

If you want to index attestations that were created before the module was added, you can use:

```solidity
function indexAttestation(bytes32 attestationId) public;

function indexAttestations(bytes32[] calldata attestationIds) external;
```

These functions allow anyone to index existing attestations by providing their IDs.

## How to check if an attestation is indexed?

```solidity
function getIndexedAttestationStatus(bytes32 attestationId) external view returns (bool);
```

Returns `true` if the attestation has been indexed, `false` otherwise.

## Gas considerations

{% hint style="info" %} Indexing attestations adds gas overhead to each attestation creation. Consider this trade-off
between on-chain queryability and gas costs when deciding whether to use this module. {% endhint %}
