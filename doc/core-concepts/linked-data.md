# Linked Data

Verax is useful not only because it stores attestations onchain, but because those attestations can share semantics and
reference each other.

## Why semantics matter

Two issuers can publish payloads that look similar but mean different things. For example:

```text
Issuer A: name, homepage
Issuer B: firstName, url
```

Without a shared semantic layer, consumers must guess whether those fields mean the same thing.

Verax addresses this in two complementary ways:

- schema-level `context`;
- canonical relationship attestations.

## Contexts

Every schema has a `context` string. Most teams use it as a pointer to a vocabulary, ontology, or schema spec page.

Good contexts make it easier for consumers to understand:

- what a field means;
- whether two schemas are semantically similar;
- how to map product-specific names to a broader vocabulary.

The protocol stores the string but does not enforce how consumers should resolve it.

## Relationship attestations

Verax deployments bootstrap a canonical `Relationship` schema:

```text
(bytes32 subject, string predicate, bytes32 object)
```

This lets you create attestations about other attestations.

Example relationships:

- `Attestation A` `"isMemberOf"` `Attestation B`
- `Attestation A` `"endorses"` `Attestation B`
- `Attestation A` `"references"` `Attestation B`

There is also a canonical named-graph variant:

```text
(string namedGraph, bytes32 subject, string predicate, bytes32 object)
```

This is useful when you want to scope or group a set of relationships.

## What linked data looks like in practice

In Verax today, linked-data workflows are usually built from:

- shared schema design;
- explicit relationship attestations;
- explorer and subgraph indexing;
- consumer-specific trust rules over issuers, portals, and predicates.

This is enough to build:

- credential graphs;
- endorsement networks;
- provenance chains;
- issuer-specific or cross-issuer research datasets.

## Research ideas vs production support

Older Verax writing explored higher-level schema notation for relationships and inheritance. Those ideas are still
interesting from a research perspective, but the current production path is simpler:

- use ABI-compatible schemas;
- use canonical relationship attestations;
- use `context` and documentation to express semantics.

## Useful SDK support

The SDK exposes:

- `veraxSdk.attestation.getRelatedAttestations(attestationId)`

to query relationship attestations already indexed by the subgraph.

## Related reads

- [Schemas](schemas.md)
- [Canonical Schemas](canonical-schemas.md)
- [Link Attestations](../developer-guides/for-attestation-issuers/link-attestations.md)
