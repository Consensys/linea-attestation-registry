# Verax Contract Examples

This package contains example implementations of Verax contracts that showcase how to use the Verax Attestation Registry. These examples are intended to be used as a reference for developers building on top of Verax.

## Structure

- `src/modules/`: Example Module implementations
  - `ERC712ModuleV2.sol`: A module for verifying EIP-712 signatures
  - `MerkleProofModuleV2.sol`: A module for verifying merkle proofs
- `src/portals/`: Example Portal implementations 
  - `EASPortal.sol`: A portal providing interoperability with the Ethereum Attestation Service
  - `NFTPortal.sol`: A portal adding ERC-721 compatibility to attestations
  - `PausablePortal.sol`: A portal with emergency pause functionality

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Setup

```bash
# Install dependencies
pnpm install

# Install Foundry dependencies
forge install
```

### Build

```bash
# Build the contracts
forge build
```

### Test

```bash
# Run tests
forge test
``` 