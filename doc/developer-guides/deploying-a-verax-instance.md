# Deploy a Verax Instance

This page is for teams deploying Verax on a new network, not for teams simply issuing attestations on an existing
deployment.

## Stack Overview

A full Verax deployment spans five layers:

1. contracts and registries;
2. post-deployment bootstrapping;
3. optional standard library and EAS compatibility helpers;
4. subgraph indexing;
5. SDK and explorer support.

## 1. Deploy the contracts

The contracts package is the source of truth for deployment and upgrade flows.

1. Copy the matching template from `contracts/env/.env.<network>` to `contracts/.env`.
2. Fill in RPC credentials, private key, and explorer API key.
3. Run the deployment script from `contracts/`:

```bash
pnpm run deploy <network>
```

This deploys:

- `Router`
- `AttestationRegistry`
- `ModuleRegistry`
- `PortalRegistry`
- `SchemaRegistry`

`AttestationRegistry` receives its chain prefix from `contracts/script/utils.ts`.

## 2. Bootstrap canonical schemas

After the registries are deployed, run the post-deployment bootstrap:

```bash
pnpm run deploy:post <network>
```

This creates the canonical schemas used throughout the stack:

- `Relationship`
- `namedGraphRelationship`
- `Offchain`

These schema IDs are later reused by the SDK and explorer.

## 3. Optionally deploy the standard library

If you want the Verax-maintained modules available on the new chain, run:

```bash
pnpm run deploy:stdlib <network>
```

This deploys and registers:

- `ECDSAModuleV2`
- `ERC1271ModuleV2`
- `FeeModuleV2`
- `IndexerModuleV2`
- `IssuersModuleV2`
- `SchemaModuleV2`
- `SenderModuleV2`

## 4. Optionally deploy EAS compatibility helpers

If the target chain has an EAS deployment and you want a unified Verax/EAS read path, set `EAS_REGISTRY_ADDRESS` and
run:

```bash
pnpm run deploy:eas <network>
```

This deploys `AttestationReader`.

## 5. Deploy the subgraph

The subgraph package is the source of truth for indexing configuration.

1. Add the network to `subgraph/networks.json`.
2. Create a `subgraph.<network>.yaml` file.
3. Add `build:<network>` and `deploy:<network>` scripts.
4. Build and deploy the subgraph from `subgraph/`.

See [Using the Subgraph](using-the-subgraph.md) for the query model once it is live.

## 6. Add SDK support

The SDK must know about the new chain.

1. Add a backend config to `sdk/src/VeraxSdk.ts`.
2. Add the corresponding frontend config.
3. Publish a new SDK package version when ready.

The minimal config includes:

- `chain`
- `subgraphUrl`
- `portalRegistryAddress`
- `moduleRegistryAddress`
- `schemaRegistryAddress`
- `attestationRegistryAddress`

## 7. Add explorer support

The explorer must also be updated.

1. Add the chain configuration in `explorer/src/config/index.tsx`.
2. Add the subgraph URL override in `explorer/src/config/subgraphUrls.ts`.
3. Add a network logo if needed.

## 8. Operational notes

- On mainnet deployments, issuer allowlisting remains active through `PortalRegistry`.
- On testnet deployments, `PortalRegistry` is initialized as permissionless.
- If you upgrade contracts, re-run the network reimport flow in `contracts/` before publishing new addresses.
- Keep the contracts, subgraph, SDK, and explorer in sync; the documentation should only reference addresses and
  subgraph URLs that are live in all four layers.
