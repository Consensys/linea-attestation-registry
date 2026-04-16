# Verax Attestation Registry - Contracts

This workspace owns the core Verax smart contracts, deployment templates, upgrade scripts, and the published
`@verax-attestation-registry/verax-contracts` package.

## Tooling and Local Setup

Prerequisites:

- Node.js and pnpm from the root `package.json`
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

From the monorepo root:

```bash
pnpm install
```

Inside `contracts/`, copy one of the network templates under `env/` to `.env` before running deploy, upgrade, or
verification scripts.

Example:

```bash
cp env/.env.linea-sepolia .env
```

## Environment Variables Reference

Variables below are consumed by Hardhat and the TypeScript scripts under `script/`.

### Network and keys

| Variable                | Networks                | Description                                                              |
| ----------------------- | ----------------------- | ------------------------------------------------------------------------ |
| `INFURA_KEY`            | All configured networks | Used to build the default JSON-RPC URL when no dedicated override exists |
| `PRIVATE_KEY_TESTNET`   | Testnets                | Hex private key for deploy and upgrade flows on test networks            |
| `PRIVATE_KEY_MAINNET`   | Mainnets                | Hex private key for deploy and upgrade flows on main networks            |
| `LINEA_MAINNET_RPC_URL` | `linea`                 | Optional full HTTP RPC URL override for Linea mainnet                    |
| `LINEA_SEPOLIA_RPC_URL` | `linea-sepolia`         | Optional full HTTP RPC URL override for Linea Sepolia                    |

### Explorer API keys

Used when verifying contracts through Hardhat.

| Variable            | Networks                       |
| ------------------- | ------------------------------ |
| `ARBISCAN_API_KEY`  | `arbitrum`, `arbitrum-sepolia` |
| `BASESCAN_API_KEY`  | `base`, `base-sepolia`         |
| `BSCSCAN_API_KEY`   | `bsc`, `bsc-testnet`           |
| `LINEASCAN_API_KEY` | `linea`, `linea-sepolia`       |
| `ETHERSCAN_API_KEY` | `sepolia`                      |

### Deployed proxy addresses and EAS

These values are stored in the `env/.env.<network>` templates and reused by upgrade, reimport, and optional deploy
steps.

| Variable                       | Description                                                 |
| ------------------------------ | ----------------------------------------------------------- |
| `ROUTER_ADDRESS`               | Router proxy address                                        |
| `ATTESTATION_REGISTRY_ADDRESS` | AttestationRegistry proxy address                           |
| `MODULE_REGISTRY_ADDRESS`      | ModuleRegistry proxy address                                |
| `PORTAL_REGISTRY_ADDRESS`      | PortalRegistry proxy address                                |
| `SCHEMA_REGISTRY_ADDRESS`      | SchemaRegistry proxy address                                |
| `ATTESTATION_READER_ADDRESS`   | AttestationReader proxy address when deployed               |
| `EAS_REGISTRY_ADDRESS`         | EAS registry address for `deploy:eas` / `upgrade:eas` flows |

### Script behavior

| Variable                           | Default        | Description                                                                |
| ---------------------------------- | -------------- | -------------------------------------------------------------------------- |
| `VERIFY_CONTRACTS`                 | verify enabled | Deploy and upgrade scripts verify unless this is explicitly set to `false` |
| `UPGRADEABILITY_RPC_RETRIES`       | `5`            | Total RPC attempts per contract during `check:upgradeability`              |
| `UPGRADEABILITY_RPC_RETRY_BASE_MS` | `1500`         | Base delay for exponential backoff during `check:upgradeability`           |

## Common Commands

Run these commands from `contracts/`.

| Command                                   | Purpose                                                             |
| ----------------------------------------- | ------------------------------------------------------------------- |
| `pnpm run build`                          | Build the contracts with Foundry                                    |
| `pnpm run test`                           | Run the Foundry test suite                                          |
| `pnpm run test:coverage`                  | Generate a local coverage report                                    |
| `pnpm run check:size`                     | Check contract size against deployment limits                       |
| `pnpm run check:implementations`          | Static upgrade-safety check for implementations                     |
| `pnpm run check:upgradeability <network>` | Dynamic proxy upgradeability check against a deployed network       |
| `pnpm run deploy <network>`               | Deploy Router + core registries and wire the Router                 |
| `pnpm run deploy:eas <network>`           | Deploy the optional AttestationReader / EAS compatibility contract  |
| `pnpm run deploy:post <network>`          | Create canonical schemas after the core deployment                  |
| `pnpm run deploy:stdlib <network>`        | Deploy and register the standard library modules                    |
| `pnpm run deploy:issuers <network>`       | Create the issuer schema, issuer modules, and the Issuers Portal    |
| `pnpm run reimport <network>`             | Regenerate deployment JSON files from the proxy addresses in `.env` |
| `pnpm run upgrade <network>`              | Upgrade the core registry proxies                                   |
| `pnpm run upgrade:eas <network>`          | Upgrade the optional EAS compatibility contract                     |

## Deploying a New Verax Instance

### 1. Add network support when the chain is new to the repo

If the target chain is not already configured, update:

- `hardhat.config.ts` with the network and explorer configuration
- `script/utils.ts` with `isTestnet` and the attestation ID chain prefix
- `env/.env.<network>` with the new template

### 2. Deploy the core stack

Run:

```bash
pnpm run deploy <network>
```

This script deploys:

- `Router`
- `AttestationRegistry`
- `ModuleRegistry`
- `PortalRegistry`
- `SchemaRegistry`

It then updates `Router` with the deployed registry addresses.

`deployEverything.ts` does **not** deploy:

- `AttestationReader`
- standard library modules
- canonical schemas
- issuer-specific helper modules and portal

If explorer verification is not available, use `pnpm run deploy:no-verify <network>`.

### 3. Optionally deploy EAS compatibility

If the network has an EAS instance and you want the compatibility reader:

1. set `EAS_REGISTRY_ADDRESS` in `.env`
2. run `pnpm run deploy:eas <network>`
3. copy the resulting `ATTESTATION_READER_ADDRESS` back into `.env` and the matching env template

### 4. Bootstrap post-deployment assets

After the core proxies exist, use the optional scripts as needed:

- `pnpm run deploy:post <network>` creates the canonical `Relationship`, `namedGraphRelationship`, and `Offchain`
  schemas
- `pnpm run deploy:stdlib <network>` deploys and registers `ECDSAModule`, `ERC1271Module`, `FeeModule`, `IndexerModule`,
  `IssuersModule`, `SchemaModule`, and `SenderModule`
- `pnpm run deploy:issuers <network>` creates the `Issuer` schema, deploys issuer-specific modules, and deploys the
  `Issuers Portal`

### 5. Finalize tracked deployment data

Once proxy addresses are known:

1. store them in `.env` and `env/.env.<network>`
2. run `pnpm run reimport <network>`

`reimport` regenerates the deployment JSON files in `contracts/deployments/` from the proxy addresses in `.env`. Run it
from the branch or commit that corresponds to the deployed contracts version.

## Upgrading an Existing Deployment

Recommended flow:

1. `pnpm run check:implementations`
2. `pnpm run check:upgradeability <network>`
3. `pnpm run upgrade <network>`
4. optionally `pnpm run upgrade:eas <network>`
5. `pnpm run reimport <network>`

If you need to skip explorer verification during the upgrade, use the `:no-verify` variants.

## Publishing the Contracts Package

The published package is
[`@verax-attestation-registry/verax-contracts`](https://www.npmjs.com/package/@verax-attestation-registry/verax-contracts).

From `contracts/`:

```bash
pnpm run publish:dry-run
pnpm run publish:public
```

`prepublishOnly` already runs `clean`, `lint`, `build`, and `test`.

## Notes for Contributors

- The portal allowlist is managed through `PortalRegistry.setIssuer(address)`, not `setIssuers`.
- Removing or rotating an issuer may require `SchemaRegistry.updateSchemaIssuer(...)` or
  `SchemaRegistry.bulkUpdateSchemasIssuers(...)` to keep schema ownership consistent.
- The env templates under `env/` are part of the public operator surface. If public addresses change, update those
  templates and the root `README.md` together.
