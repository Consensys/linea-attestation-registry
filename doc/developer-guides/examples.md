# Examples

Use the in-repo examples as reference implementations. They are closer to the current source of truth than older
external demo apps.

## In this repository

### Tutorial app

The `tutorial/` package shows the simplest end-to-end flow for:

- schema creation;
- default portal deployment;
- attestation issuance;
- attestation readback.

### Example portals

Under `examples/src/portals/`:

- `EASPortal.sol`
- `NFTPortal.sol`
- `PausablePortal.sol`

### Example modules

Under `examples/src/modules/`:

- `ERC712ModuleV2.sol`
- `MerkleProofModuleV2.sol`

## How to use examples safely

- Treat examples as reference code, not as drop-in production policy.
- Verify network addresses and registry assumptions against your deployment.
- Prefer the SDK and contract sources over older demo screenshots or explorer walkthroughs.
