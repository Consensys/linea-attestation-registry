# Introduction

Verax is a shared attestation registry for EVM chains. It gives applications a common place to publish attestations,
discover attestations from other issuers, and compose that data across products, networks, and use cases.

This documentation is organized around two primary audiences:

- `Build with Verax`: developers who want to issue attestations, query them, reuse the SDK and subgraph, or deploy a
  Verax stack on a new chain.
- `Research Verax`: readers who want to understand the Verax model, its linked-data orientation, how it compares with
  EAS and other attestation systems, and what trade-offs it makes.

`Protocol & Community` remains available as a secondary section for governance, contribution, integrations, and
documentation maintenance.

## What Verax adds

At a high level, Verax combines:

- a shared onchain registry for attestations, schemas, portals, and modules;
- a portal model that lets issuers control how attestations are created;
- reusable modules for validation and policy enforcement;
- a subgraph and SDK for discovery and cross-chain consumption;
- compatibility helpers for EAS-oriented ecosystems.

An attestation in Verax is usually an issuer making a statement about a subject:

- an address completed a course;
- a contract is malicious;
- a user belongs to a DAO;
- an attestation is linked to another attestation;
- an offchain document is referenced by a canonical onchain pointer.

## Start Here

- If you want to integrate Verax into an app, begin with [Quickstart](getting-started.md).
- If you need network addresses and supported environments, go to
  [Networks and Addresses](developer-guides/networks-and-addresses.md).
- If you want the shortest path to issuing attestations, go to
  [Build Workflow](developer-guides/for-attestation-issuers/README.md).
- If you want the protocol model first, go to [High-Level Overview](core-concepts/high-level-overview.md).

## Notes

- On testnets, Verax instances are configured as permissionless through `PortalRegistry.getIsTestnet()`.
- On mainnets, schema and portal registration is still gated by the issuer allowlist managed in `PortalRegistry`.
- The monorepo is the source of truth for contracts, SDK, explorer, tutorial app, and subgraph.

## Contact

- Discord: [discord.gg/Sq4EmYdBEk](https://discord.gg/Sq4EmYdBEk)
- GitHub: [Consensys/linea-attestation-registry](https://github.com/Consensys/linea-attestation-registry)
