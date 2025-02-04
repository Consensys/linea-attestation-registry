# Verax Attestation Registry - SDK

The Verax SDK facilitates the interactions with the contracts and the subgraph, both from a frontend and a backend.

## Installation

VeraxSDK is an [npm package](https://www.npmjs.com/package/@verax-attestation-registry/verax-sdk/).

```bash
# npm
npm i @verax-attestation-registry/verax-sdk

# yarn
yarn add @verax-attestation-registry/verax-sdk

# pnpm
pnpm add @verax-attestation-registry/verax-sdk
```

## Getting Started

Check the
[SDK documentation](https://docs.ver.ax/verax-documentation/developer-guides/using-the-sdk#user-content-getting-started)

## CLI examples

cf. [CLI examples](./doc/cli-examples.md)

## Deployment of a new Verax instance

When a new instance of Verax is deployed onchain, the SDK needs to be updated with the new addresses.

1. Add a new backend `Conf` object in [src/VeraxSdk.ts](src/VeraxSdk.ts):

   ```typescript
   static DEFAULT_XXX_MAINNET: Conf = {
     chain: xxx,
     mode: SDKMode.BACKEND,
     subgraphUrl: "<SUBGRAPH_URL>",
     portalRegistryAddress: "0x...",
     moduleRegistryAddress: "0x...",
     schemaRegistryAddress: "0x...",
     attestationRegistryAddress: "0x...",
   };
   ```

2. Add a new frontend `Conf` object in [src/VeraxSdk.ts](src/VeraxSdk.ts):

   ```typescript
   static DEFAULT_XXX_MAINNET_FRONTEND: Conf = {
       ...VeraxSdk.DEFAULT_XXX_MAINNET,
       mode: SDKMode.FRONTEND,
   };
   ```

3. Increment the version of the package in [package.json](package.json)
4. Publish the package to [npm](https://www.npmjs.com/package/@verax-attestation-registry/verax-sdk)

   ```bash
   pnpm run publish:public
   ```
