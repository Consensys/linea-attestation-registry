# Using the Subgraph

Verax indexes contracts with a subgraph on every supported network. This is the easiest way to run rich queries over
attestations, schemas, portals, modules, issuers, and counters.

## Official deployments

The SDK defaults point to The Graph Studio deployments shipped in this repository. Current version labels in source are:

| Deployment                  | Version label |
| --------------------------- | ------------- |
| `verax-v2-linea`            | `v0.0.1`      |
| `verax-v2-linea-sepolia`    | `v0.0.3`      |
| `verax-v2-arbitrum`         | `v0.0.2`      |
| `verax-v2-arbitrum-sepolia` | `v0.0.3`      |
| `verax-v2-base`             | `v0.0.1`      |
| `verax-v2-base-sepolia`     | `v0.0.3`      |
| `verax-v2-bsc`              | `v0.0.2`      |
| `verax-v2-bsc-testnet`      | `v0.0.2`      |

See [Networks and Addresses](networks-and-addresses.md) for the network matrix.

## Main entities

The subgraph schema includes:

- `Attestation`
- `Schema`
- `Portal`
- `Module`
- `Issuer`
- `Counter`
- `RegistryVersion`
- `RegistryUpdate`
- `AuditInformation`
- `Audit`

Important modeling details:

- an `Attestation` has a nested `schema: Schema!`, not a flat `schemaId` field;
- there is no `schemaString` field on `Attestation`;
- if you want the schema definition, query `schema { schema }`.

{% hint style="warning" %} Several older query examples found in historical Verax docs are invalid against the current
subgraph schema. In particular, `schemaId` and `schemaString` are not flat fields on `Attestation`. {% endhint %}

## Example queries

### Recent attestations with nested schema and portal data

```graphql
query RecentAttestations {
  attestations(first: 10, orderBy: attestedDate, orderDirection: desc) {
    id
    revoked
    attestedDate
    subject
    decodedData
    schema {
      id
      name
      schema
      context
    }
    portal {
      id
      name
      ownerName
      isRevocable
    }
  }
}
```

### Attestations for one subject

```graphql
query AttestationsBySubject {
  attestations(where: { subject: "0xd14bf29e486dfc3836757b9b8ccfc95a5160a56d" }) {
    id
    revoked
    attestedDate
    decodedData
    schema {
      id
      name
      schema
    }
  }
}
```

### Non-revoked attestations for one schema

```graphql
query AttestationsBySchema {
  attestations(
    where: { revoked: false, schema_: { id: "0x7b2d17830782df831c39edcbd728a47f0a470d57fdf452b5f4226f467f48295e" } }
  ) {
    id
    subject
    decodedData
    portal {
      id
      name
    }
  }
}
```

### Browse schemas

```graphql
query AllSchemas {
  schemas(first: 20, orderBy: name, orderDirection: asc) {
    id
    name
    description
    context
    schema
    attestationCounter
  }
}
```

### Counters

```graphql
query GlobalCounters {
  counters {
    attestations
    modules
    portals
    schemas
  }
}
```

## When to use the subgraph vs the SDK

Use the subgraph directly when you need:

- raw GraphQL control;
- custom dashboard queries;
- indexing into your own data pipeline;
- fields that you want without SDK post-processing.

Use the SDK when you want:

- decoded attestation payloads;
- multi-chain helpers;
- offchain IPFS payload resolution;
- a single interface for reads and writes.

## Running your own subgraph

The repository includes the full subgraph project under `subgraph/`, including build and deploy scripts for every
supported network.

If you run a custom subgraph, point the SDK at it with:

- `subgraphUrl` for single-chain reads;
- `subgraphUrlOverrides` for multi-chain reads.

## Reference files

- `subgraph/schema.graphql`
- `subgraph/package.json`
- `sdk/src/VeraxSdk.ts`
