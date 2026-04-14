# Verax vs EAS, NFTs, SBTs and VCs

Verax is best understood as a shared, modular attestation registry rather than just another credential format.

## Verax vs EAS

Verax and EAS are compatible in parts of the stack, but they are not the same model.

Existing interoperability today:

- `EASPortal` can emit Verax attestations from an EAS-shaped request model.
- `AttestationReader` can read from EAS first and fall back to Verax, returning an EAS-shaped struct.

Main structural differences:

- `Portals`: Verax routes issuance through issuer-controlled portal contracts. EAS is centered on the EAS contract and
  resolver patterns.
- `Modules`: Verax has first-class reusable validation modules that portals chain together.
- `Subject model`: Verax stores `subject` as `bytes`, not just an address-like recipient.
- `ID model`: Verax attestation IDs are chain-prefixed so the same counter value can remain unique across networks.
- `Linked data orientation`: Verax explicitly leans into contexts, shared vocabularies, and canonical relationship
  schemas.
- `Discoverability`: Verax is designed as a shared public registry per network, with explorer, subgraph, and multichain
  SDK support built around that assumption.

## Verax vs NFT and SBT patterns

Compared with NFT or SBT-based attestation designs, Verax emphasizes:

- richer shared registry semantics over collection-specific token logic;
- explicit schema reuse instead of ad hoc token metadata;
- portal and module policy composition;
- easier offchain indexing and cross-issuer discovery.

NFT and SBT models can still be useful when token ownership semantics are the product surface. Verax can coexist with
them, and example portals such as the NFT-compatible example show one bridge pattern.

## Verax vs VCs

Verifiable Credentials and Verax solve different layers of the problem.

- VCs are usually transport and presentation oriented, often with selective disclosure and offchain verification flows.
- Verax is an onchain registry and discovery layer.

Many systems can use both:

- VC for user-facing credential exchange;
- Verax for public anchoring, reputation composition, or ecosystem discoverability.

## When Verax is a strong fit

Verax is a strong fit when you want:

- public discoverability;
- shared schemas across issuers;
- onchain lifecycle state;
- reusable validation modules;
- cross-app composition of attestations.

## When another model may be a better fit

Another model may be better when you need:

- strict token-native ownership semantics only;
- private-by-default credential exchange;
- selective disclosure without public anchoring;
- no shared-registry assumptions.
