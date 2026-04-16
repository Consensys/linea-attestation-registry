# ERC1271Module

Source: `contracts/src/stdlib/ERC1271ModuleV2.sol`

## What it does

`ERC1271ModuleV2` extends the ECDSA-style signer authorization pattern to smart contract wallets that implement
ERC-1271.

The module:

1. recovers the signer from the signed attestation payload;
2. checks that signer against the portal's authorized signer list;
3. if the signer is a contract, calls `isValidSignature(...)`.

## Portal-owner configuration

```solidity
function setAuthorizedSigners(address portal, address[] calldata signers, bool[] calldata authorizationStatus) public;
```

## Good fit when

- you want Gnosis Safe or other contract-wallet signers;
- your issuer workflow uses multisigs or account abstraction wallets.

## Tradeoffs

- more complex than `ECDSAModuleV2`;
- extra contract call for contract-wallet validation;
- still no built-in replay protection.

## Practical advice

Use `ECDSAModuleV2` if you only need EOAs. Use `ERC1271ModuleV2` when smart-wallet compatibility is part of the
requirement.
