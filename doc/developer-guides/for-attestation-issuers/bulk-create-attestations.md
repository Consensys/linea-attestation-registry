# Bulk Create Attestations

Bulk issuance lets a portal create several attestations in one transaction.

## Portal interface

`AbstractPortalV2` exposes:

```solidity
function bulkAttest(AttestationPayload[] memory attestationPayloads, bytes[][] memory validationPayloads) public;
```

Unlike `attest(...)`, this function is not payable in `AbstractPortalV2`.

`validationPayloads` is two-dimensional:

- one outer entry per attestation;
- one inner entry per module used by the portal for that attestation.

{% hint style="info" %} `bulkAttest(...)` is useful for gas savings, but it is not just "`attest(...)` repeated". The
shape of `validationPayloads` and the lack of payable support matter for some integrations. {% endhint %}

## SDK

```ts
await veraxSdk.portal.bulkAttest(
  "0xPortalAddress",
  [
    {
      schemaId: "0xSchemaId",
      expirationDate: 0,
      subject: "0xRecipient1",
      attestationData: [{ active: true }],
    },
    {
      schemaId: "0xSchemaId",
      expirationDate: 0,
      subject: "0xRecipient2",
      attestationData: [{ active: true }],
    },
  ],
  [[], []],
  { waitForConfirmation: true },
);
```

## Important caveat

{% hint style="warning" %} Bulk issuance can be a bad fit for modules that depend on predicting the next attestation ID.
During bulk workflows, IDs are not incremented between module checks the same way a one-by-one flow might assume.
{% endhint %}

If your logic depends on attestation IDs, prefer single `attest(...)`.
