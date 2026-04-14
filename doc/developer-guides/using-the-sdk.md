# Using the SDK

The Verax SDK is the easiest way to read and write Verax data from a frontend, backend, script, or indexer helper.

Package:

```bash
npm i @verax-attestation-registry/verax-sdk
```

## Instantiate the SDK

```ts
import { SDKMode, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
```

### Backend defaults

The canonical built-in network configs are:

- `VeraxSdk.DEFAULT_LINEA_MAINNET`
- `VeraxSdk.DEFAULT_LINEA_SEPOLIA`
- `VeraxSdk.DEFAULT_ARBITRUM`
- `VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA`
- `VeraxSdk.DEFAULT_BASE`
- `VeraxSdk.DEFAULT_BASE_SEPOLIA`
- `VeraxSdk.DEFAULT_BSC`
- `VeraxSdk.DEFAULT_BSC_TESTNET`

Example:

```ts
const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA);
```

### Frontend defaults

Frontend variants exist for each network and set `mode: SDKMode.FRONTEND`:

```ts
const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND, userAddress);
```

### Custom configuration

```ts
import { ChainName, SDKMode, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import { optimism } from "viem/chains";

const customConf = {
  chain: optimism,
  mode: SDKMode.BACKEND,
  rpcUrl: "<your-rpc-url>",
  subgraphUrl: "<your-subgraph-url>",
  portalRegistryAddress: "0xMyPortalRegistry",
  moduleRegistryAddress: "0xMyModuleRegistry",
  schemaRegistryAddress: "0xMySchemaRegistry",
  attestationRegistryAddress: "0xMyAttestationRegistry",
  subgraphUrlOverrides: {
    [ChainName.LINEA_SEPOLIA]: "<your-linea-sepolia-subgraph-url>",
  },
};

const veraxSdk = new VeraxSdk(customConf);
```

Use `subgraphUrlOverrides` when you need custom URLs for multi-chain reads.

## Data mappers

| Mapper                 | Purpose                                                             |
| ---------------------- | ------------------------------------------------------------------- |
| `veraxSdk.schema`      | Read and write schemas                                              |
| `veraxSdk.module`      | Read and register modules                                           |
| `veraxSdk.portal`      | Read portals and write lifecycle operations                         |
| `veraxSdk.attestation` | Read attestations, multi-chain queries, related-attestation helpers |
| `veraxSdk.utils`       | Encode, decode, and light utility helpers                           |

```ts
const schema = veraxSdk.schema;
const module = veraxSdk.module;
const portal = veraxSdk.portal;
const attestation = veraxSdk.attestation;
const utils = veraxSdk.utils;
```

## Read operations

### Read one object

```ts
const portalById = await veraxSdk.portal.findOneById("0x...");
const schemaById = await veraxSdk.schema.findOneById("0x...");
const moduleById = await veraxSdk.module.findOneById("0x...");
const attestationById = await veraxSdk.attestation.findOneById("0x...");
```

### Read many objects

The base `findBy` signature is:

```ts
findBy(first?, skip?, where?, orderBy?, orderDirection?)
```

Example:

```ts
const attestations = await veraxSdk.attestation.findBy(
  20,
  0,
  { revoked: false, portal: "0xPortalAddress" },
  "attestedDate",
  "desc",
);
```

This returns an array, not a paginated wrapper object.

### Multi-chain reads

```ts
import { ChainName } from "@verax-attestation-registry/verax-sdk";

const schemas = await veraxSdk.schema.findByMultiChain([ChainName.LINEA_SEPOLIA, ChainName.ARBITRUM_SEPOLIA], 20, 0, {
  name_contains_nocase: "passport",
});

const portals = await veraxSdk.portal.findByMultiChain([ChainName.LINEA_MAINNET, ChainName.BASE_MAINNET], 50, 0, {
  ownerName_contains_nocase: "verax",
});

const attestations = await veraxSdk.attestation.findByMultiChain(
  [ChainName.LINEA_MAINNET, ChainName.ARBITRUM_MAINNET],
  20,
  0,
  { revoked: false },
  "attestedDate",
  "desc",
);
```

### Related-attestation queries

```ts
const related = await veraxSdk.attestation.getRelatedAttestations(attestationId);
```

This queries canonical relationship attestations indexed by the subgraph.

### Counts

```ts
const totalSchemas = await veraxSdk.schema.getSchemasNumber();
const totalAttestations = await veraxSdk.attestation.getAttestationIdCounter();

const multiChainCount = await veraxSdk.attestation.getAttestationCountMultiChain([
  ChainName.LINEA_SEPOLIA,
  ChainName.BASE_SEPOLIA,
]);
```

If exact aggregated counts are critical to your application, validate them against the current SDK version and your
deployment setup before depending on them operationally.

{% hint style="warning" %} Treat helper counts as convenience APIs, not as unquestioned accounting truth, until you have
validated them against the SDK version and deployment topology you are using. {% endhint %}

## Write operations

### Create a schema

```ts
const receipt = await veraxSdk.schema.create(
  "Example Schema",
  "Schema used in documentation examples",
  "https://schema.org/Thing",
  "(bool active, uint16 score)",
  { waitForConfirmation: true },
);
```

### Register a module

```ts
await veraxSdk.module.register("ExampleModule", "Checks issuer-specific validation rules", "0xModuleAddress", {
  waitForConfirmation: true,
});
```

### Deploy a default portal

```ts
const receipt = await veraxSdk.portal.deployDefaultPortal(
  ["0xOptionalModuleAddress"],
  "Example Portal",
  "Portal used in documentation examples",
  true,
  "Example Issuer",
  { waitForConfirmation: true },
);
```

### Register a custom portal

```ts
await veraxSdk.portal.register(
  "0xPortalAddress",
  "Example Portal",
  "Custom portal registered in Verax",
  true,
  "Example Issuer",
  { waitForConfirmation: true },
);
```

### Attest

```ts
await veraxSdk.portal.attest(
  "0xPortalAddress",
  {
    schemaId: "0xSchemaId",
    expirationDate: 0,
    subject: "0xRecipientAddress",
    attestationData: [{ active: true, score: 42 }],
  },
  [],
  { waitForConfirmation: true },
);
```

### Bulk attest

```ts
await veraxSdk.portal.bulkAttest(
  "0xPortalAddress",
  [
    {
      schemaId: "0xSchemaId",
      expirationDate: 0,
      subject: "0xRecipient1",
      attestationData: [{ active: true, score: 1 }],
    },
    {
      schemaId: "0xSchemaId",
      expirationDate: 0,
      subject: "0xRecipient2",
      attestationData: [{ active: true, score: 2 }],
    },
  ],
  [[], []],
  { waitForConfirmation: true },
);
```

### Revoke and replace

```ts
await veraxSdk.portal.revoke("0xPortalAddress", "0xAttestationId", {
  waitForConfirmation: true,
});

await veraxSdk.portal.replace(
  "0xPortalAddress",
  "0xAttestationId",
  {
    schemaId: "0xSchemaId",
    expirationDate: 0,
    subject: "0xRecipientAddress",
    attestationData: [{ active: true, score: 99 }],
  },
  [],
  { waitForConfirmation: true },
);
```

### Offchain payloads over IPFS

The SDK supports Verax-native offchain attestations using the canonical `Offchain` schema:

```ts
const veraxSdk = new VeraxSdk({
  ...VeraxSdk.DEFAULT_LINEA_SEPOLIA,
  offchainConfig: {
    projectId: process.env.INFURA_IPFS_PROJECT_ID!,
    projectSecret: process.env.INFURA_IPFS_PROJECT_SECRET!,
  },
});

await veraxSdk.portal.attestOffChain(
  "0xPortalAddress",
  {
    schemaId: "0xOriginalSchemaId",
    expirationDate: 0,
    subject: "0xRecipientAddress",
    attestationData: [],
    offchainData: {
      schemaId: "0xOriginalSchemaId",
      payload: {
        github: "alice",
        score: 42,
      },
    },
  },
  [],
  { waitForConfirmation: true },
);
```

See [Offchain Payloads](offchain-payloads.md).

## Utilities

Use `veraxSdk.utils` when you want direct ABI encoding and decoding helpers:

```ts
const encoded = veraxSdk.utils.encode("(string handle, uint16 score)", ["alice", 42]);
const decoded = veraxSdk.utils.decode("(string handle, uint16 score)", encoded);
```

These helpers are especially useful when:

- debugging encoded payloads;
- integrating with custom contracts;
- building your own low-level tooling.

## Transaction return shape

Write methods use the common transaction helper:

- by default they return `{ transactionHash }`;
- with `{ waitForConfirmation: true }` they return the full transaction receipt.

{% hint style="info" %} For frontend flows and tutorials, `{ waitForConfirmation: true }` usually makes the rest of your
code simpler because you can read logs and derived IDs immediately from the receipt. {% endhint %}

## Practical advice

- Use built-in defaults unless you run your own deployment.
- Use `findByMultiChain(...)` for cross-chain product views.
- Use `utils.encode/decode` when you need deterministic low-level control.
- Use `attestOffChain(...)` for Verax-native IPFS-backed payloads instead of inventing a parallel custom pattern first.

## Related guides

- [Networks and Addresses](networks-and-addresses.md)
- [Offchain Payloads](offchain-payloads.md)
- [Using the Subgraph](using-the-subgraph.md)
