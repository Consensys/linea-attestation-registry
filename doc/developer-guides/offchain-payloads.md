# Offchain Payloads

Verax supports a canonical pattern for storing the heavy or mutable payload offchain while keeping a stable onchain
pointer in the registry.

## Canonical pattern

The canonical bootstrap flow creates an `Offchain` schema with the following shape:

```solidity
(bytes32 schemaId, string uri)
```

The SDK exposes this through `Constants.OFFCHAIN_DATA_SCHEMA_ID`.

{% hint style="info" %} This is the preferred first-party offchain pattern for Verax documentation. Ceramic and other
systems can still be used, but they should be presented as optional integrations rather than the default story.
{% endhint %}

## What happens onchain

Instead of storing the full original payload in `attestationData`, the attestation stores:

- the original schema ID being referenced;
- a URI pointing to the offchain content, typically `ipfs://...`.

This keeps the registry entry small while preserving:

- the attester;
- the portal;
- revocation and replacement semantics;
- a canonical pointer to the payload.

## SDK support

The SDK already supports this flow through `portal.attestOffChain(...)`.

At a high level:

1. configure `offchainConfig` with IPFS credentials in the SDK `Conf`;
2. provide the original schema ID and payload under `offchainData`;
3. let the SDK upload the payload and issue the onchain pointer attestation.

Example:

```typescript
import { VeraxSdk, SDKMode } from "@verax-attestation-registry/verax-sdk";

const sdk = new VeraxSdk({
  ...VeraxSdk.DEFAULT_LINEA_SEPOLIA_FRONTEND,
  mode: SDKMode.FRONTEND,
  offchainConfig: {
    projectId: process.env.IPFS_PROJECT_ID!,
    projectSecret: process.env.IPFS_PROJECT_SECRET!,
  },
});

await sdk.portal.attestOffChain(
  portalAddress,
  {
    schemaId: originalSchemaId,
    expirationDate: 0,
    subject: userAddress,
    attestationData: [],
    offchainData: {
      schemaId: originalSchemaId,
      payload: {
        profile: "dynamic payload",
      },
    },
  },
  [],
);
```

## Reading offchain payloads

When the SDK reads an attestation that uses the canonical offchain schema, it:

1. detects `Constants.OFFCHAIN_DATA_SCHEMA_ID`;
2. extracts the referenced `schemaId` and `uri`;
3. fetches IPFS content when the URI is `ipfs://...`;
4. decodes the payload against the referenced schema when the payload is ABI-encoded hex.

If you rely on custom hex-encoded offchain payloads, validate the exact decode behavior against the SDK version you are
shipping.

{% hint style="warning" %} Offchain payloads add a new trust and availability boundary. The attestation stays onchain,
but consumers now also depend on URI resolution and external content integrity. {% endhint %}

## When to use this pattern

Use offchain payloads when:

- the payload is too large or too dynamic to keep fully onchain;
- you want a stable attestation pointer but mutable or richer data storage;
- you want a Verax-native alternative to bespoke Ceramic-only documentation.

## When to keep everything onchain

Keep payloads onchain when:

- the data is small and stable;
- onchain verifiability of the full payload matters;
- downstream consumers should not depend on any offchain fetch path.
