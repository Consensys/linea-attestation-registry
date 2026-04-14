# EAS compatibility

Verax is designed to be compatible with the [Ethereum Attestation Service](https://attest.org) (EAS), allowing for
seamless integration and interoperability between the two systems. This compatibility is achieved through several
components and processes:

1. Emitting Attestations on Verax and EAS

For projects that wish to emit attestations on both Verax and EAS, the
[EASPortal contract](https://github.com/Consensys/linea-attestation-registry/blob/dev/examples/src/portals/EASPortal.sol)
is used. This contract acts as a bridge, allowing attestations to be issued on both platforms simultaneously.

2. Reading Attestations from Verax and EAS

The
[AttestationReader contract](https://github.com/Consensys/linea-attestation-registry/blob/caf5cdd254c086fdeb4820e230f3053db2a9dbcd/contracts/src/AttestationReader.sol#L70)
is used to read attestations from both Verax and EAS. This contract provides a unified interface to access attestations,
regardless of the platform they were issued on.

3. Migrating Attestations from EAS to Verax

For projects that have existing attestations on EAS and wish to duplicate them on Verax, a mass import process is
available. This involves using a script to push attestations to a Verax portal. The process is facilitated by the
`bulkAttest` function, which allows for bulk creation of attestations.&#x20;
