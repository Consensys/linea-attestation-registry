# Verax Attestation Registry - Contracts

Verax is mainly composed of a set of smart contracts that allows anyone to read and write Attestations.

## Pre-requisites

- [Node.js](https://nodejs.org/en/) (>= 18)
- [pnpm](https://pnpm.io/installation) (>=9.10.0)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

## Environment variables reference

Copy `env/.env.<network>` to `.env` in this package (see [Deployment](#deployment-of-a-new-verax-instance)). Variables
below are read by Hardhat and the TypeScript scripts under `script/`.

### Network and keys (Hardhat)

| Variable                | Networks                | Description                                                                                                                                                     |
| ----------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `INFURA_KEY`            | All configured networks | When set, used to build the default JSON-RPC URL for that network (where Hardhat does not use a dedicated override).                                            |
| `PRIVATE_KEY_TESTNET`   | Testnets                | Hex private key for deployments and upgrades on test networks. Omit for read-only tasks (e.g. `check:upgradeability`) if your scripts do not send transactions. |
| `PRIVATE_KEY_MAINNET`   | Mainnets                | Hex private key for deployments and upgrades on main networks.                                                                                                  |
| `LINEA_MAINNET_RPC_URL` | `linea` only            | Optional. Full HTTP RPC URL for Linea mainnet. If set, used instead of Infura (`INFURA_KEY`) or the public Linea RPC.                                           |
| `LINEA_SEPOLIA_RPC_URL` | `linea-sepolia` only    | Optional. Full HTTP RPC URL for Linea Sepolia. Same precedence as above.                                                                                        |

### Block explorer API keys (contract verification)

Used when verifying contracts on the corresponding explorer (see `etherscan` in `hardhat.config.ts`).

| Variable            | Networks                       |
| ------------------- | ------------------------------ |
| `ARBISCAN_API_KEY`  | `arbitrum`, `arbitrum-sepolia` |
| `BASESCAN_API_KEY`  | `base`, `base-sepolia`         |
| `BSCSCAN_API_KEY`   | `bsc`, `bsc-testnet`           |
| `LINEASCAN_API_KEY` | `linea`, `linea-sepolia`       |
| `ETHERSCAN_API_KEY` | `sepolia`                      |

### Deployed proxy addresses and EAS

Set after deployment (see `env/.env.*` examples). Used by upgrade, reimport, `check:upgradeability`, and related
scripts.

| Variable                       | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| `ROUTER_ADDRESS`               | Transparent proxy address of the Router.                                 |
| `ATTESTATION_REGISTRY_ADDRESS` | AttestationRegistry proxy.                                               |
| `MODULE_REGISTRY_ADDRESS`      | ModuleRegistry proxy.                                                    |
| `PORTAL_REGISTRY_ADDRESS`      | PortalRegistry proxy.                                                    |
| `SCHEMA_REGISTRY_ADDRESS`      | SchemaRegistry proxy.                                                    |
| `ATTESTATION_READER_ADDRESS`   | AttestationReader proxy (optional; omit or leave empty if not deployed). |
| `EAS_REGISTRY_ADDRESS`         | EAS registry address on the chain (for EAS deploy/upgrade flows).        |

### Script behavior

| Variable                           | Default        | Description                                                                                                                                                                                                             |
| ---------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VERIFY_CONTRACTS`                 | verify enabled | Deploy and upgrade scripts verify on the explorer unless this is set to the string `false`.                                                                                                                             |
| `UPGRADEABILITY_RPC_RETRIES`       | `5`            | Used by `check:upgradeability` only. Maximum number of **total** RPC attempts per contract check (including the first). Non-finite or negative values fall back to `5`. `0` is treated as **one** attempt (no retries). |
| `UPGRADEABILITY_RPC_RETRY_BASE_MS` | `1500`         | Base delay in milliseconds for exponential backoff between transient RPC retries in `check:upgradeability`. Unset, empty, non-finite, or negative values use `1500`.                                                    |

## Development commands

### Build contracts

```bash
forge build
```

### Test contracts

```bash
forge test
```

### Generate a coverage report

```bash
forge coverage
```

## Deployment of a new Verax instance

### 1. Environment setup

1. Copy an `.env.NETWORK` file from the `env` folder to a `.env` file: `cp env/.env.linea .env`
2. Fill it with your Infura key, your private key and your chain explorer API key (see
   [Environment variables reference](#environment-variables-reference); optional variables are listed as comments in
   each `env/.env.*` template)
3. Update the `hardhat.config.ts` file with:
   1. A new entry to the `networks` object
   2. A new entry to the `etherscan.apiKey` object
   3. A new entry to the `etherscan.customChains` array
4. Add a new entry to the `script/utils.ts` file to define:
   1. If the network is a testnet or a mainnet (cf. `isTestnet`)
   2. The network's dedicated chain prefix (cf. `chainPrefix`)

### 2. Registries deployments

1. Run the `pnpm run deploy NETWORK_NAME` command (replacing `NETWORK_NAME` with the name of the targeted network)
   - If you want to skip contract verification (e.g., for networks without a functioning explorer), use
     `pnpm run deploy:no-verify NETWORK_NAME` instead
2. Note down the summarized addresses (proxies), and the total logs can be of interest too
3. Add the addresses of the Verax registries to the `.env.NETWORK` and your `.env` files

### 3. EAS compatibility

If the targeted network benefits from an EAS instance, you can deploy the contract enabling the EAS-Verax compatibility.

1. Add the address of the EAS registry to the `EAS_REGISTRY_ADDRESS` value in your `.env` file
2. Run the `pnpm run deploy:eas NETWORK_NAME` command (replacing `NETWORK_NAME` with the name of the targeted network)
   - If you want to skip contract verification, use `pnpm run deploy:eas:no-verify NETWORK_NAME` instead
3. Note down the Attestation Reader contract address
4. Add the Attestation Reader contract address to the `.env.NETWORK` and your `.env` files

### 4. Platform bootstrapping

#### 4.1. On a mainnet instance

1. Gather the first list of Issuer addresses
2. Set the issuers via the PortalRegistry’s `setIssuers` method

#### 4.2. On all instances

1. Deploy an instance of DefaultPortal via the PortalRegistry’s `deployDefaultPortal` method and note down its address
2. Verify this contract via `npx hardhat verify --network NETWORK_NAME ADDRESS` (replacing `NETWORK_NAME` with the name
   of the targeted network and `ADDRESS` with the address of the freshly deployed `DefaultPortal`)

## Verax contracts upgrade

### 1. Check all registry implementations follow the upgradeability rules

Run `pnpm run check:implementations` to check if the local versions of the registries follow the upgradeability rules.

:warning: Note: this is a static check, not run against the already deployed contracts.

### 2. Check all registry implementations are upgradeable

Run `pnpm run check:upgradeability NETWORK_NAME` (replacing `NETWORK_NAME` with the name of the targeted network) to
check if the already deployed registries are upgradable to the new local versions.

:warning: Note: this is a dynamic check, run against the already deployed contracts.

RPC endpoints can return transient errors during `eth_getStorageAt` (EIP-1967 reads). The script retries those
automatically; see `UPGRADEABILITY_RPC_RETRIES` and `UPGRADEABILITY_RPC_RETRY_BASE_MS` in
[Environment variables reference](#environment-variables-reference). For Linea RPC overrides, use
`LINEA_MAINNET_RPC_URL` or `LINEA_SEPOLIA_RPC_URL`.

### 3. Check the contracts size

Run `pnpm run check:size` to check if all the contracts have a size below the threshold for deployment (24KiB).

### 4. Do upgrade

1. Check your `.env` file contains the address of all the proxies for the targeted network
2. Upgrade only the implementations that have changed since the last upgrade via the `pnpm run upgrade NETWORK_NAME`
   command
   - If you want to skip contract verification, use `pnpm run upgrade:no-verify NETWORK_NAME` instead
3. _Optional_: If you need to upgrade EAS-related contracts, use the `pnpm run upgrade:eas NETWORK_NAME` command
   - If you want to skip contract verification, use `pnpm run upgrade:eas:no-verify NETWORK_NAME` instead

:warning: Note: Forcing the redeployment of all the implementations is more expensive!

### 5. Update the network files

:warning: Note: this script must only be run on a branch/commit corresponding to the version of the contracts deployed
on the targeted network!.

Run `pnpm run reimport NETWORK_NAME` (replacing `NETWORK_NAME` with the name of the targeted network) to re-generate the
network files describing the deployed contracts.

:warning: Note: This step is mandatory to avoid being desynchronized.

### 6. Deploy the contract library

The core contracts are available on [npm](https://www.npmjs.com/package/@verax-attestation-registry/verax-contracts) as
a library. To deploy the library, follow the steps below:

1. Upgrade the package version in [package.json](./package.json)
2. Test the deployment on npm
   ```bash
   pnpm run publish:dry-run
   ```
3. Deploy on npm
   ```bash
   pnpm run publish:public
   ```

## Utils

### Verify with arguments

Change the arguments you want to use for the verify action in `contracts/script/arguments.ts`, then run:

```
npx hardhat verify --network NETWORK_NAME CONTRACT_ADDRESS --constructor-args contracts/script/arguments.ts
```

## Important Notes

### Removal of Issuers and Schemas ownership

Issuers may have Schemas associated with them. When removing issuers, you will need to reassign schema ownership by
calling the following methods :

1. updateSchemaIssuer
2. bulkUpdateSchemasIssuers
