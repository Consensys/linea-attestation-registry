# Revoke an Attestation

Revocation is done through the portal that originally issued the attestation.

## Portal interface

`AbstractPortalV2` exposes:

```solidity
function revoke(bytes32 attestationId) public onlyPortalOwner;

function bulkRevoke(bytes32[] memory attestationIds) public onlyPortalOwner;
```

By default, only the portal owner can revoke.

## Registry checks

`AttestationRegistry.revoke(...)` checks:

- the attestation exists;
- it is not already revoked;
- the calling portal is the original attesting portal;
- the portal is marked revocable in `PortalRegistry`.

## SDK

```ts
await veraxSdk.portal.revoke("0xPortalAddress", "0xAttestationId", {
  waitForConfirmation: true,
});

await veraxSdk.portal.bulkRevoke("0xPortalAddress", ["0xAttestationId1", "0xAttestationId2"], {
  waitForConfirmation: true,
});
```

## Custom portal logic

You can add extra revocation logic in:

- `_onRevoke(attestationId)`
- `_onBulkRevoke(attestationIds)`

But the default owner-only protection is already present in `AbstractPortalV2`.
