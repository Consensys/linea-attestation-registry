# Verax Attestation Registry - Contracts

Verax is mainly composed of a set of smart contracts that allows anyone to read and write Attestations.

## Pre-requisites

- [Node.js](https://nodejs.org/en/) (>= 18)
- [pnpm](https://pnpm.io/installation) (>=9.10.0)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

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
2. Fill it with your Infura key, your private key and your chain explorer API key
3. Update the `hardhat.config.ts` file with:
   1. A new entry to the `networks` object
   2. A new entry to the `etherscan.apiKey` object
   3. A new entry to the `etherscan.customChains` array
4. Add a new entry to the `script/utils.ts` file to define:
   1. If the network is a testnet or a mainnet (cf. `isTestnet`)
   2. The network's dedicated chain prefix (cf. `chainPrefix`)

### 2. Registries deployments

1. Run the `pnpm run deploy NETWORK_NAME` command (replacing `NETWORK_NAME` with the name of the targeted network)
2. Note down the summarized addresses (proxies), and the total logs can be of interest too
3. Add the addresses of the Verax registries to the `.env.NETWORK` and your `.env` files

### 3. EAS compatibility

If the targeted network benefits from an EAS instance, you can deploy the contract enabling the EAS-Verax compatibility.

1. Add the address of the EAS registry to the `EAS_REGISTRY_ADDRESS` value in your `.env` file
2. Run the `pnpm run deploy:eas NETWORK_NAME` command (replacing `NETWORK_NAME` with the name of the targeted network)
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

### 3. Check the contracts size

Run `pnpm run check:size` to check if all the contracts have a size below the threshold for deployment (24KiB).

### 4. Do upgrade

1. Check your `.env` file contains the address of all the proxies for the targeted network
2. Upgrade only the implementations that have changed since the last upgrade via the `pnpm run upgrade NETWORK_NAME`
   command
3. _Optional_: Upgrade all the implementations by forcing their re-deployment via the
   `pnpm run upgrade:force NETWORK_NAME` command

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
