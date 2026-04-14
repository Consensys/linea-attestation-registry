# Replace an Attestation

Replacing an attestation revokes the existing attestation, creates a new one, and records the new ID in `replacedBy`.

## Portal interface

`AbstractPortalV2` exposes:

```solidity
function replace(
  bytes32 attestationId,
  AttestationPayload memory attestationPayload,
  bytes[] memory validationPayloads
) public payable onlyPortalOwner;

function bulkReplace(
  bytes32[] memory attestationIds,
  AttestationPayload[] memory attestationPayloads,
  bytes[][] memory validationPayloads
) public onlyPortalOwner;
```

By default, only the portal owner can replace.

## What happens under the hood

At registry level, replacement does three things:

1. revoke the old attestation;
2. attest the new payload;
3. set `oldAttestation.replacedBy = newAttestationId`.

## SDK

```ts
await veraxSdk.portal.replace(
  "0xPortalAddress",
  "0xOldAttestationId",
  {
    schemaId: "0xSchemaId",
    expirationDate: 0,
    subject: "0xRecipientAddress",
    attestationData: [{ isExample: true, score: 99 }],
  },
  [],
  { waitForConfirmation: true },
);

await veraxSdk.portal.bulkReplace(
  "0xPortalAddress",
  ["0xOldAttestationId1", "0xOldAttestationId2"],
  [
    {
      schemaId: "0xSchemaId",
      expirationDate: 0,
      subject: "0xRecipient1",
      attestationData: [{ isExample: true, score: 1 }],
    },
    {
      schemaId: "0xSchemaId",
      expirationDate: 0,
      subject: "0xRecipient2",
      attestationData: [{ isExample: true, score: 2 }],
    },
  ],
  [[], []],
  { waitForConfirmation: true },
);
```

## Custom portal logic

You can extend the flow with:

- `_onReplace(...)`
- `_onBulkReplace(...)`

The same module-chain caveats as normal attestation issuance still apply.
