# Verax Attestation Registry - Contracts

Verax is mainly composed of a set of smart contracts that allows anyone to read and write attestations of any type and
any subject.

## Foundry Installation

**Using Foundryup**

Foundryup is the Foundry toolchain installer. Open your terminal and run the following command:

`curl -L https://foundry.paradigm.xyz | bash` This will install Foundryup, then simply follow the instructions
on-screen, which will make the foundryup command available in your CLI.

Running foundryup by itself will install the latest (nightly) precompiled binaries: forge, cast, anvil and chisel. See
foundryup --help for more options, like installing from a specific version or commit.

ℹ️ Note

If you're on Windows, you will need to install and use Git BASH or WSL, as your terminal, since Foundryup currently does
not support Powershell or Cmd.

For more details on installation, see the [installation guide](https://book.getfoundry.sh/getting-started/installation)
in the book.

If you're experiencing any issues while installing, check out the [FAQ](https://book.getfoundry.sh/faq).

## Forge - build and test

We can build the project with forge build:

```bash
forge build
```

And run the tests with forge test:

```bash
forge test
```

And get the coverage with forge coverage:

```bash
forge coverage
```

## Verax contracts deployment

1. Copy the `.env.example` file to a `.env` file
2. Fill it with your Infura key
3. Add your private key
4. To verify the contracts on the dedicated explorer, also add your Etherscan/Lineascan/Arbiscan API key
5. Deploy all contracts via the `pnpm run deploy NETWORK_NAME` command (replacing `NETWORK_NAME` with the name of the
   targeted network)
6. Note down the summarized addresses (proxies), and the total logs can be of interest too
7. Gather the first list of issuers addresses
8. Set the issuers via the PortalRegistry’s `setIssuers` method
9. Deploy an instance of DefaultPortal via the PortalRegistry’s `deployDefaultPortal` method and note down its address
10. Verify this contract via `npx hardhat verify --network NETWORK_NAME ADDRESS` (replacing `NETWORK_NAME` with the name
    of the targeted network and `ADDRESS` with the address of the freshly deployed `DefaultPortal`)
11. Update the network files via `pnpm run reimport NETWORK_NAME` (replacing `NETWORK_NAME` with the name of the
    targeted network)

## Verax contracts upgrade

### 1. Check all registries implementations follow the upgradeability rules

Run `pnpm run check:implementations` to check if the local versions of the registries follow the upgradeability rules.

:warning: Note: this is a static check, not run against the already deployed contracts.

### 2. Check all registries implementations are upgradeable

Run `pnpm run check:upgradeability NETWORK_NAME` (replacing `NETWORK_NAME` with the name of the targeted network) to
check if the already deployed registries are upgradable to the new local versions.

:warning: Note: this is a dynamic check, run against the already deployed contracts.

## 3. Do upgrade

1. Check that your `.env` file contains the address of all the proxies for the targeted network
2. Upgrade only the implementations that changed since the last upgrade via the `pnpm run upgrade NETWORK_NAME` command
3. _Optional_: Upgrade all the implementations by forcing their re-deployment via the
   `pnpm run upgrade:force NETWORK_NAME` command

:warning: Note: Forcing the redeployment of all the implementations is more expensive!

### 4. Update the network files

:warning: Note: this script must only be run on a branch/commit corresponding to the version of the contracts deployed
on the targeted network!.

Run `pnpm run reimport NETWORK_NAME` (replacing `NETWORK_NAME` with the name of the targeted network) to re-generate the
network files describing the deployed contracts.

:warning: Note: This step is mandatory to avoid being de-synchronized.

## Utils

### Verify with arguments

Change the arguments you want to use fpr the verify action in `contracts/script/arguments.ts`, then run:

```
npx hardhat verify --network NETWORK_NAME CONTRACT_ADDRESS --constructor-args contracts/script/arguments.ts
```

## Important Notes

### Removal of Issuers and Schemas ownership

Issuers may have Schemas associated with them. When removing issuers, you will need to reassign schema ownership by
calling the following methods :

1. updateSchemaIssuer
2. bulkUpdateSchemasIssuers
