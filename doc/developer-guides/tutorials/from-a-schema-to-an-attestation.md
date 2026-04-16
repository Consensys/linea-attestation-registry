# From a Schema to an Attestation

This walkthrough mirrors the tutorial app that lives in `tutorial/` in this monorepo.

## Goal

Create:

1. a schema;
2. a default portal;
3. an attestation;
4. a UI readback of the issued attestation.

## 1. Install and run the tutorial app

From the monorepo root:

```bash
pnpm install
pnpm --filter @verax-attestation-registry/verax-tutorial dev
```

## 2. Instantiate the SDK

The tutorial app picks the frontend SDK config from the connected chain:

```ts
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

const sdkConf =
  chain.id === 84532
    ? VeraxSdk.DEFAULT_BASE_SEPOLIA_FRONTEND
    : chain.id === 59141
      ? VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND
      : chain.id === 421614
        ? VeraxSdk.DEFAULT_ARBITRUM_SEPOLIA_FRONTEND
        : VeraxSdk.DEFAULT_BSC_TESTNET_FRONTEND;

const veraxSdk = new VeraxSdk(sdkConf, address);
```

## 3. Compute or create the schema

Use the schema string:

```ts
const schemaString = "(bool hasCompletedTutorial)";
const schemaId = await veraxSdk.schema.getIdFromSchemaString(schemaString);
const exists = await veraxSdk.schema.isRegistered(schemaId);
```

If it does not exist:

```ts
await veraxSdk.schema.create(
  "Tutorial Schema",
  "This schema is used for the tutorial",
  "https://schema.org/Thing",
  schemaString,
  { waitForConfirmation: true },
);
```

## 4. Deploy a default portal

```ts
const receipt = await veraxSdk.portal.deployDefaultPortal(
  [],
  "Tutorial Portal",
  "This portal is used for the tutorial",
  true,
  "Verax Tutorial",
  { waitForConfirmation: true },
);
```

The emitted `PortalRegistered` event gives you the new portal address.

## 5. Issue the attestation

```ts
const receipt = await veraxSdk.portal.attest(
  portalId,
  {
    schemaId,
    expirationDate: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    subject: address,
    attestationData: [{ hasCompletedTutorial: true }],
  },
  [],
  { waitForConfirmation: true },
);
```

The emitted `AttestationRegistered` event gives you the new attestation ID.

## 6. Read it back

```ts
const attestation = await veraxSdk.attestation.findOneById(attestationId);
```

For richer explorer-like reads, you can also use `findBy(...)` or `findByMultiChain(...)`.

## Important correction

If you build your own version of this tutorial, prefer `schema.isRegistered(schemaId)` to test existence. Calling
`getSchema(schemaId)` on a missing schema reverts onchain.

## Next steps

- add a module to the portal;
- replace or revoke the attestation;
- switch to the canonical `Offchain` schema if the payload should live on IPFS;
- query the result through the subgraph.
