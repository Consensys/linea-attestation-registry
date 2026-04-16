# Canonical Schemas

Verax bootstraps a small set of canonical schemas that multiple tools in the stack already understand.

These schemas are created by the post-deployment flow in `contracts/script/deploy/postDeployment.ts`.

## Relationship

```solidity
(bytes32 subject, string predicate, bytes32 object)
```

This schema is used to express links between attestations.

The SDK exposes the schema ID as `Constants.RELATIONSHIP_SCHEMA_ID`.

## Named graph relationship

```solidity
(string namedGraph, bytes32 subject, string predicate, bytes32 object)
```

This is a variant of the relationship schema that adds a grouping label.

The SDK exposes the schema ID as `Constants.NAMED_GRAPH_RELATIONSHIP_SCHEMA_ID`.

## Offchain

```solidity
(bytes32 schemaId, string uri)
```

This schema is the canonical pointer format for offchain payloads.

The SDK exposes the schema ID as `Constants.OFFCHAIN_DATA_SCHEMA_ID`.

## Why these matter

These schemas are important because they are not just ideas described in the docs:

- they are created by deployment tooling;
- their IDs are baked into the SDK;
- explorer and SDK behavior depend on them for linked-attestation and offchain flows.

For protocol research, these canonical schemas are also where Verax’s linked-data orientation becomes operational rather
than conceptual.
