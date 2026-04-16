# IndexerModule

Source: `contracts/src/stdlib/IndexerModuleV2.sol`

## What it does

`IndexerModuleV2` stores onchain secondary indexes for attestation IDs by:

- subject;
- subject + schema;
- attester;
- schema;
- portal;
- portal + subject.

This is useful when another contract wants queryable attestation IDs without relying on an offchain indexer.

## Query methods

The module exposes view helpers such as:

- `getAttestationIdsBySubject(...)`
- `getAttestationIdsBySubjectBySchema(...)`
- `getAttestationIdsByAttester(...)`
- `getAttestationIdsBySchema(...)`
- `getAttestationIdsByPortal(...)`
- `getAttestationIdsByPortalBySubject(...)`

## Important caveats

{% hint style="warning" %} This module has significant limitations in its current form:

- it does not un-index revoked attestations;
- it is not reliable for bulk issuance scenarios that depend on predicted IDs;
- it predicts IDs without incorporating the chain prefix into its local construction logic;
- it should be treated as advanced or experimental tooling rather than the default discovery path. {% endhint %}

For most applications, the subgraph remains the recommended indexing layer.
