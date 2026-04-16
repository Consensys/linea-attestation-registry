# High-Level Overview

Verax is a modular onchain attestation registry. It gives applications a shared place to publish attestations instead of
burying them inside product-specific contracts, NFTs, or private databases.

The protocol is made of:

- a `Router` that stores the registry addresses for one deployment;
- a `SchemaRegistry` for attestation data models;
- a `ModuleRegistry` for reusable validation modules;
- a `PortalRegistry` for issuer-controlled entrypoints;
- an `AttestationRegistry` for the attestations themselves;
- an `AttestationReader` helper for EAS-style reads across Verax and EAS.

## The issuance model

Verax is designed around a simple flow:

1. A team defines or reuses a schema.
2. The team optionally composes validation modules.
3. The team deploys a portal, or uses `DefaultPortalV2`.
4. Users or backend systems call that portal.
5. The portal validates the request, then writes the attestation into `AttestationRegistry`.

This is the main architectural difference from simpler attestation systems: Verax separates storage, validation, and
issuer-specific business logic.

<figure><img src="../.gitbook/assets/high-level-flow-01.drawio.png" alt=""><figcaption><p>Users interact with applications, and applications publish attestations through their portal contract.</p></figcaption></figure>

## Core building blocks

### Schemas

A schema is the ABI-like description of an attestation payload, for example:

```text
(string handle, uint16 score, bool active)
```

Schemas are registered once and can then be reused by many issuers.

### Portals

A portal is the contract that actually issues attestations into Verax. It is the public entrypoint for an issuer's
workflow.

Portals can:

- call validation modules;
- enforce issuer-specific rules;
- issue, revoke, replace, bulk attest, and bulk replace;
- remain minimal by inheriting `AbstractPortalV2`.

### Modules

Modules are small reusable contracts that validate incoming attestation requests. Examples include:

- restricting allowed senders;
- restricting allowed schemas;
- checking signatures;
- checking that a subject is an issuer;
- enforcing a fee.

<figure><img src="../.gitbook/assets/high-level-flow.drawio.png" alt=""><figcaption><p>A portal can chain several modules before writing the attestation into the shared registry.</p></figcaption></figure>

### Attestations

An attestation is a statement made by an attester, through a portal, about a subject, with payload data that follows a
registered schema.

The `subject` is stored as raw `bytes`, which means it can represent:

- an EVM address;
- another attestation ID;
- a DID;
- an IPFS reference;
- any other byte-serializable identifier.

Schemas, modules, and portals become much more useful once they are registered and discoverable inside the same Verax
deployment.

<figure><img src="../.gitbook/assets/high-level-flow-02.drawio.png" alt=""><figcaption><p>Verax separates discoverability registries from the attestation store itself.</p></figcaption></figure>

## Why a shared registry matters

Because many issuers publish into the same registry shape, Verax makes it easier to:

- discover schemas, portals, modules, and attestations;
- build shared indexing with the subgraph;
- compare attestations across issuers and chains;
- build higher-level reputation, research, and analytics workflows;
- reuse canonical schemas such as `Relationship` and `Offchain`.

## What is not handled by the protocol

Verax guarantees registry mechanics, not meaning or trust. It does not guarantee:

- that an issuer is honest;
- that a schema is well designed;
- that a context URL resolves forever;
- that explorer curation equals protocol truth;
- that a consumer should trust any specific attestation.

Trust is built by portals, issuer reputation, schema design, external verification, and consumer policy.

## Mainnet and testnet behavior

On testnets, schema and portal registration is permissionless because `PortalRegistry.isAllowlisted(user)` returns
`true` when `isTestnet` is enabled.

On mainnets, schema creation and portal registration still depend on issuer allowlisting in `PortalRegistry`.

## Next reads

- [Attestations](attestations.md)
- [Schemas](schemas.md)
- [Modules](modules.md)
- [Portals](portals.md)
- [Trust Model and Limitations](trust-model-and-limitations.md)
