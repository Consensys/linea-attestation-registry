# Bulk Create Attestations

For certain use cases, issuers may want to create Zttestations in bulk to save on transaction fees.&#x20;

The `AbstractPortal` contract that every Portal inherits from defines the following function:

```solidity
function bulkAttest(
  AttestationPayload[] memory attestationsPayloads,
  bytes[][] memory validationPayloads
) public payable;
```

This function is like the normal `attest` function but with a couple of differences. First, it takes an array of
`AttestationPayload` structs as the first parameter, each one corresponding to a single Attestation. Second, it takes a
two-dimensional array of `validationPayloads` in the second parameter. The first dimension of the array is a validation
payload for each respective Attestation payload, the second dimension is the validation payload for each module in the
module chain, to verify the respective Attestation.

{% hint style="danger" %} This method may have unexpected behavior if one of the checks is done on the Attestation ID,
as this ID won't be incremented before the end of the transaction. If you need to check the attestation ID, please use
the `attest` method. {% endhint %}
