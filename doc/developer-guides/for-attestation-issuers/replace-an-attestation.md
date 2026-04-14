# Replace an Attestation

Replacing an Attestation is straightforward. To replace an Attestation that was previously created in the registry, you
need to call the `replace` function on the Portal that first issued the attestation. The `replace` method is:

```solidity
/**
 * @notice Replaces the attestation for the given identifier and replaces it with a new attestation
 * @param attestationId the ID of the attestation to replace
 * @param attestationPayload the attestation payload to create the new attestation and register it
 * @param validationPayloads the payloads to validate via the modules to issue the attestation
 * @dev Runs all modules for the portal and registers the attestation using AttestationRegistry
 */
function replace(
  bytes32 attestationId,
  AttestationPayload memory attestationPayload,
  bytes[] memory validationPayloads
) public payable onlyPortalOwner {
  moduleRegistry.runModulesV2(
    modules,
    attestationPayload,
    validationPayloads,
    msg.value,
    msg.sender,
    getAttester(),
    OperationType.Replace
  );
  _onReplace(attestationId, attestationPayload, getAttester(), msg.value);
  attestationRegistry.replace(attestationId, attestationPayload, getAttester());
}
```

The Attestation registry will generate a new Attestation, with the same checks as in the usual Attestation issuance
process, with the same checks. It will also go through the usual Attestation revocation process, with the same checks.

## Lifecycle Hooks

You can also place custom logic in the `_onReplace` lifecycle hook to run any additional verification before the
replacement takes place, or perform any other action that you wish.

## Verification Checks

Note that you can't replace an attestation made by another portal, even if that portal allows revocation. The full list
of verification checks that the Attestation registry makes before replacing an Attestation are the ones from the attest
and revoke workflows.

Once all these verification checks have passed, the Attestation can be replaced in the registry.

## Bulk replacement

A Portal also exposes a `bulkRepalce` function, to revoke multiple Attestations at once, to save on gas fees. The
`bulkReplace` function is:

```solidity
/**
 * @notice Replaces attestations for given identifiers and replaces them with new attestations
 * @param attestationIds the list of IDs of the attestations to replace
 * @param attestationPayloads the list of attestation payloads to create the new attestations and register them
 * @param attester the account address issuing the attestation
 */
function bulkReplace(
  bytes32[] calldata attestationIds,
  AttestationPayload[] calldata attestationPayloads,
  address attester
) public {
  if (attestationIds.length != attestationPayloads.length) revert ArrayLengthMismatch();
  for (uint256 i = 0; i < attestationIds.length; i = uncheckedInc256(i)) {
    replace(attestationIds[i], attestationPayloads[i], attester);
  }
}
```

{% hint style="info" %} The `_onBulkReplace` hook lets you add some custom logic to this workflow {% endhint %}
