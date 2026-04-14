---
description: >-
  The ECDSA module allows you to check that there is a ECDSA signature in the validation payload in order to proceed
  with issuing the attestation.
---

# ECDSAModule

## [Link to the code](https://github.com/Consensys/linea-attestation-registry/blob/dev/contracts/src/stdlib/ECDSAModuleV2.sol)

## When to use this module?

Use this module when you want the issuance of an attestation to be conditional of the verification of a signature. An
example of why you may want to do this, is if you only want attestations to only come from your dapp frontend. In this
scenario, you might sign a message on your backend and submit it as part of the validation payload. When your portal
passes the signed message to this module in the validation payload, the module checks the signature and makes sure the
signer address matches the correct address.

## When not to use this module?

If you don't care who uses your portal to issue attestations. Maybe you only care that they use a specific schema, but
other than that, anyone can go ahead and make an attestation. Also, it may be the case that you need to support
ERC-1271, which uses a different module.

## How to use this module?

There are two different ways to use this module. You can either deploy a new instance of this module and use it with
your portal, or you can use an existing instance of module. In this second approach, multiple different portals can
actually use the same singleton instance of the module.

In either approach, you will need to add an authorized signer for the module to check the signature against. To do this,
you must call the `setAuthorizedSigners` function with the following parameters:

- address portal - the address of the portal contract that the attestations will come from
- address\[] memory signers - the list of signers, one of which must be required in order to attest
- bool\[] memory authorizationStatus - set to false to revoke a previously registered signer

## How to check the authorized sender(s)?

Pass the signature as the `validationPayload` and the module will check the signature against the hash of the
`attestationPayload`. Note that this requires that the signature should be on the `attestationPayload` in the first
place.&#x20;
