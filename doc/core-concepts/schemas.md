# Schemas

A schema defines how an attestation payload is encoded. In Verax, schemas are stored as strings and identified by the
keccak256 hash of that schema string.

## Supported schema syntax

Verax schemas follow Solidity ABI parameter syntax closely enough to be parsed by the SDK and by standard ABI tooling.

Simple example:

```text
(string username, uint16 points, bool active)
```

Nested tuples are also supported:

```text
(string username, (string city, string country) location, string[] tags)
```

In practice, the safest rule is:

- write schemas exactly like ABI parameter tuples;
- keep the outer parentheses;
- prefer types supported by standard Solidity ABI encoders.

{% hint style="info" %} If a schema string can be parsed and encoded like normal ABI parameters, it is much more likely
to work cleanly across the SDK, explorers, and external tooling. {% endhint %}

## Metadata stored onchain

Each schema stores:

| Field         | Type     | Meaning                             |
| ------------- | -------- | ----------------------------------- |
| `name`        | `string` | Human-readable schema name          |
| `description` | `string` | Link or description of intended use |
| `context`     | `string` | Semantic context hint, often a URL  |
| `schema`      | `string` | Raw schema definition               |

## Counterfactual IDs

Schema IDs are deterministic:

```solidity
function getIdFromSchemaString(string calldata schema) public pure returns (bytes32) {
  return keccak256(abi.encodePacked(schema));
}
```

That means you can compute a schema ID before registration and decide whether you need to create it at all.

## Contexts and semantics

The `context` field is a semantic hint, not a protocol-enforced resolver. Teams typically use it to point at:

- a shared ontology such as [schema.org](https://schema.org);
- internal documentation;
- a vocabulary or spec page;
- an IPFS or web resource describing field semantics.

Consumers should treat `context` as helpful metadata, not as a guaranteed global standard.

## Canonical schemas

Verax deployments bootstrap three canonical schemas in post-deployment scripts:

- `Relationship`
- `namedGraphRelationship`
- `Offchain`

See [Canonical Schemas](canonical-schemas.md) for the exact definitions and IDs.

## Experimental ideas vs supported syntax

Some older Verax documentation and research notes mention advanced notation such as:

- schema inheritance with `@extends`;
- relationship declarations using `{ ... }` or `[{ ... }]`.

These ideas are useful for research and ontology design, but they are **not** part of the currently supported SDK
parsing path. The SDK uses ABI parsing under the hood, so documentation should not present those notations as
production-ready schema syntax today.

If you need inheritance or richer semantic modeling now, model it explicitly with:

- reusable canonical schemas;
- relationship attestations;
- offchain documentation and context URLs.

{% hint style="warning" %} Do not document `@extends` or `{ ... }` relationship notation as production-ready schema
syntax today. Those ideas are useful for research, but the current SDK path is ABI-oriented. {% endhint %}

## Recommended authoring rules

- Keep schemas small and composable.
- Reuse existing schemas when possible.
- Choose stable field names.
- Put semantic detail in `description` and `context`, not only in project-specific blog posts.
- Treat schema design as a public interface because other teams may index and consume it.

## Next reads

- [Linked Data](linked-data.md)
- [Canonical Schemas](canonical-schemas.md)
- [Create and register a Schema](../developer-guides/for-attestation-issuers/create-a-schema.md)
