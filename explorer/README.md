# Verax Attestation Registry - Explorer

This package manages the explorer of Verax Attestation Registry, hosted at [explorer.ver.ax](https://explorer.ver.ax).

## Getting Started

### Launch in development mode

```bash
pnpm run dev
```

## Deployment of a new Verax instance

When a new Verax instance is deployed, the explorer must be updated with the environment.

1. Add the newly deployed Verax instance's configuration to the list of chains in
   [src/config/index.ts](src/config/index.tsx)
2. Add the network logo in [src/assets/networks](src/assets/networks)
3. Once the corresponding PR is approved and merged, re-deploy the explorer via the manual
   "[Deploy production explorer](https://github.com/Consensys/linea-attestation-registry/actions/workflows/explorer-deploy-prod.yml)"
   GitHub Action
