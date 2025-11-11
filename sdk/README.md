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

## Using Custom Subgraph URLs

By default, the SDK uses free-tier subgraph URLs from The Graph Studio, which have rate limits. For production
applications, you can override these URLs with your own endpoints that use The Graph API keys for higher rate limits.

### Basic Usage

```typescript
import { VeraxSdk, ChainName } from "@verax-attestation-registry/verax-sdk";

const sdk = new VeraxSdk({
  ...VeraxSdk.DEFAULT_LINEA_MAINNET,
  subgraphUrlOverrides: {
    [ChainName.LINEA_MAINNET]: "https://gateway.thegraph.com/api/YOUR_API_KEY/subgraphs/id/...",
    [ChainName.ARBITRUM_MAINNET]: "https://gateway.thegraph.com/api/YOUR_API_KEY/subgraphs/id/...",
  },
});
```

### How It Works

The SDK uses **cascading fallback logic** to resolve subgraph URLs for any chain:

1. **First**: Check `subgraphUrlOverrides[chainName]` (your custom URL)
2. **Then**: Check `subgraphUrl` (if querying the configured chain)
3. **Finally**: Use default free-tier URL

This unified approach works for **both single-chain and multi-chain queries**, providing consistent behavior throughout
the SDK.

### Benefits

- **Higher rate limits** - Use paid API keys to avoid throttling
- **Production-ready** - Suitable for high-traffic applications
- **Flexible** - Override only the chains you need
- **Consistent** - Same logic for all query types

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
