# EAS Interoperability

Verax is not EAS, but the repository includes interoperability building blocks.

## `AttestationReader`

`AttestationReader` is a helper contract that reads from:

1. EAS first;
2. Verax second if the UID does not exist in EAS.

It returns data in the EAS attestation struct format. This is useful when you want an EAS-like read surface across both
systems.

Important caveat:

- if a Verax attestation subject is not address-like, the converted EAS `recipient` becomes the zero address.

## `EASPortal` example

The repository also ships an example portal at `examples/src/portals/EASPortal.sol`.

This example shows how to:

- accept EAS-style payloads;
- convert them into Verax attestation payloads;
- optionally create a relationship attestation for `refUID`.

This example portal is not part of the core Verax deployment. Treat it as reference code, not as a protocol primitive.

## When to use these tools

Use them when:

- you already have EAS-shaped payloads and want a migration bridge;
- you need an EAS-compatible read layer for consumers;
- you want to compare or coexist with EAS rather than fully replacing it.

See also [Verax vs EAS and Other Attestation Models](../../core-concepts/verax-vs-eas-and-other-attestation-models.md).
