# ECDSAModule

Source: `contracts/src/stdlib/ECDSAModuleV2.sol`

## What it does

`ECDSAModuleV2` requires an attestation payload to be signed by an authorized signer for the portal.

The module:

1. computes `keccak256(abi.encode(attestationPayload))`;
2. applies the Ethereum signed message prefix;
3. recovers the signer from `validationPayload`;
4. checks that signer against `authorizedSigners[portal][signer]`.

## Portal-owner configuration

```solidity
function setAuthorizedSigners(address portal, address[] calldata signers, bool[] calldata authorizationStatus) public;
```

Only the portal owner can update the signer list for that portal.

## Good fit when

- you want backend-authorized attestations;
- you want to restrict a portal to pre-approved signers;
- you do not need smart-wallet signature validation.

## Not enough when

- you need ERC-1271 smart-wallet support;
- you need replay protection;
- you want more complex signature domain separation.

## Important caveat

This module does **not** protect against signature replay by itself. If a signature should be single-use, add nonce or
replay-protection logic elsewhere.
