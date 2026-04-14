# Revoke an Attestation

Revoking an Attestation is straightforward. To revoke an Attestation that was previously created in the registry, you
need to call the `revoke` function on the Portal that first issued the attestation. The `revoke` method is:

```solidity
/**
 * @notice Revokes an attestation for the given identifier
 * @param attestationId the ID of the attestation to revoke
 * @dev By default, revocation is only possible by the portal owner
 * We strongly encourage implementing such a rule in your Portal if you intend on overriding this method
 */
function revoke(bytes32 attestationId) public {
  _onRevoke(attestationId);
  attestationRegistry.revoke(attestationId);
}
```

The Attestation registry will check that the Portal actually allows revocations, as defined when the portal was first
registered. If a Portal was registered with the `revocable` property set to `false` then it will reject any attempt to
revoke an existing Attestation.

## Lifecycle Hook

You can also place custom logic in the `_onRevoke` lifecycle hook to run any additional verification before the
revocation takes place, or perform any other action that you wish.

{% hint style="info" %} By default, via the `_onRevoke` hook, only the owner of the Portal can revoke an Attestation
{% endhint %}

## Verification Checks

Note that you can't revoke an Attestation made by another Portal, even if that Portal allows revocation. The full list
of verification checks that the attestation registry makes before revocation an attestation are as follows:

- Checks that the attestation being revoked exists (is registered).
- Checks that it is not already revoked.
- Checks that the Portal revoking the attestation initially created it.
- Checks that the portal through which the attestation was issued actually allows revocations.

Once all these verification checks have passed, the Attestation can be flagged as revoked in the registry.

## Bulk revocation

A Portal also exposes a `bulkRevoke` function, to revoke multiple Attestations at once, to save on gas fees. The
`bulkRevoke` function is:

```solidity
/**
 * @notice Bulk revokes a list of attestations for the given identifiers
 * @param attestationIds the IDs of the attestations to revoke
 */
function bulkRevoke(bytes32[] memory attestationIds) public {
  _onBulkRevoke(attestationIds);
  attestationRegistry.bulkRevoke(attestationIds);
}
```

{% hint style="info" %} The `_onBulkRevoke` hook lets you add some custom logic to this workflow {% endhint %}
