# Bulk Create Attestations

For certain use cases, issuers may want to create attestations in bulk in order to save on transaction fees.  Verax has support for both bulk attestation creation and bulk revocation as well.

The `AbstractPortal` contract that every portal inherits from defines the following function:

```solidity
function bulkAttest(
  AttestationPayload[] memory attestationsPayloads,
  bytes[][] memory validationPayloads
) public payable;
```

This function is very similar to the normal `attest` function but with a couple of differences. First, it takes an array of `AttestationPayload` structs as the first parameter, each one corresponding to a single attestation.  Second, it takes a two dimensional array of `validationPayloads` in the second parameter.  The first dimension of the array is a validation payload for each respective attestation payload, the second dimension is the validation payload for each module in the module chain, in order to verify the respective attestation.

## Bulk Revocation of Attestations

Revoking attestations in bulk is basically the same as revoking a single attestion. This is the funtion that does it:

```solidity
function bulkRevoke(bytes32[] memory attestationIds, bytes32[] memory replacedBy);
```

The two arrays obviously need to be the same size, with each element in the `replacedBy` parameter corresponding to the element in the same position in the `attestationIds` parameter.  After that, the exact same verification checks are performed by the attestation regsitry.
