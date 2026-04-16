# Verax - Subgraph

This workspace owns the subgraph manifests, mappings, tests, and The Graph Studio deploy commands for Verax.

## Local Setup

From the monorepo root:

```bash
pnpm install
```

There is no repo-local `.env.example` for this workspace. Deployments use the Graph CLI directly, so authenticate with:

```bash
graph auth <ACCESS_TOKEN>
```

when you need to deploy to The Graph Studio.

## Network Naming Conventions

The subgraph package does not use the exact same network strings as the contracts env templates. Contributors should
follow the script names below.

| Public network   | Contracts env name | Subgraph script suffix | Studio deployment name      |
| ---------------- | ------------------ | ---------------------- | --------------------------- |
| Linea Sepolia    | `linea-sepolia`    | `linea-sepolia`        | `verax-v2-linea-sepolia`    |
| Linea Mainnet    | `linea`            | `linea-mainnet`        | `verax-v2-linea`            |
| Arbitrum Sepolia | `arbitrum-sepolia` | `arbitrum-sepolia`     | `verax-v2-arbitrum-sepolia` |
| Arbitrum Mainnet | `arbitrum`         | `arbitrum-one`         | `verax-v2-arbitrum`         |
| Base Sepolia     | `base-sepolia`     | `base-sepolia`         | `verax-v2-base-sepolia`     |
| Base Mainnet     | `base`             | `base-mainnet`         | `verax-v2-base`             |
| BSC Testnet      | `bsc-testnet`      | `bsc-testnet`          | `verax-v2-bsc-testnet`      |
| BSC Mainnet      | `bsc`              | `bsc-mainnet`          | `verax-v2-bsc`              |

## Common Commands

Run these commands from `subgraph/`.

| Command                           | Purpose                                            |
| --------------------------------- | -------------------------------------------------- |
| `pnpm run codegen`                | Generate types from `subgraph.linea-sepolia.yaml`  |
| `pnpm run build:linea-sepolia`    | Build the Linea Sepolia manifest                   |
| `pnpm run build:linea-mainnet`    | Build the Linea mainnet manifest                   |
| `pnpm run build:arbitrum-sepolia` | Build the Arbitrum Sepolia manifest                |
| `pnpm run build:arbitrum-one`     | Build the Arbitrum mainnet manifest                |
| `pnpm run build:base-sepolia`     | Build the Base Sepolia manifest                    |
| `pnpm run build:base-mainnet`     | Build the Base mainnet manifest                    |
| `pnpm run build:bsc-testnet`      | Build the BSC testnet manifest                     |
| `pnpm run build:bsc-mainnet`      | Build the BSC mainnet manifest                     |
| `pnpm run test`                   | Run matchstick tests                               |
| `pnpm run test:coverage`          | Run matchstick coverage                            |
| `pnpm run deploy:linea-sepolia`   | Example network-specific Studio deployment command |

The version labels and Studio deployment names live in `package.json`, so update the scripts there when a deployment is
republished.

## Deploying an Existing Supported Network

Example:

```bash
pnpm run build:linea-sepolia
pnpm run deploy:linea-sepolia
```

Repeat the same pattern for the target network using the script names from `package.json`.

## Adding a New Network

When Verax is deployed on a new chain:

1. add the network addresses and start blocks to `networks.json`
2. create a new manifest file named `subgraph.<network>.yaml`
3. add matching build and deploy scripts to `package.json`, following the existing network-specific naming pattern
4. run the new build command locally
5. create the matching Studio deployment in [The Graph Studio](https://thegraph.com/studio/)
6. authenticate with `graph auth <ACCESS_TOKEN>`
7. deploy with the new network-specific script you just added to `package.json`

After a new or updated deployment is published, keep the public surfaces aligned:

- `subgraph/package.json`
- `sdk/src/VeraxSdk.ts`
- `sdk/src/utils/urlResolver.ts`
- the root `README.md`

## Notes for Contributors

- The README should document the exact script names that exist in `package.json`; avoid placeholder commands like
  `build:XXX:vY`.
- The build and deploy script names are part of the maintainer workflow, so renaming them should be treated as a public
  contributor-facing change.
