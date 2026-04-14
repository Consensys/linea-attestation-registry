---
description: >-
  The ERC1271Module allows you to verify signatures from smart contract wallets that implement the ERC-1271 standard.
  This module extends signature verification beyond EOAs (Externally Owned Accounts) to support smart contract-based
  wallets.
---

# ERC1271Module

## [Link to the code](https://github.com/Consensys/linea-attestation-registry/blob/dev/contracts/src/stdlib/ERC1271ModuleV2.sol)

## When to use this module?

Use this module when you want to:

- Support signature verification from smart contract wallets (e.g., Gnosis Safe, Argent, etc.)
- Allow multisig wallets to authorize attestations
- Enable account abstraction wallets to issue attestations
- Support any wallet that implements the [ERC-1271 standard](https://eips.ethereum.org/EIPS/eip-1271)

This module is essential for portals that want to be compatible with the growing ecosystem of smart contract wallets and
account abstraction.

## When not to use this module?

Don't use this module if:

- You only need to support EOA (regular wallet) signatures - use the ECDSAModule instead (it's simpler and uses less
  gas)
- You don't care about signature verification at all
- You need custom signature logic beyond standard ECDSA and ERC-1271

## How is it different from ECDSAModule?

| Feature                              | ECDSAModule                   | ERC1271Module                     |
| ------------------------------------ | ----------------------------- | --------------------------------- |
| **EOA signatures**                   | ✅ Supported                  | ✅ Supported                      |
| **Smart contract wallet signatures** | ❌ Not supported              | ✅ Supported                      |
| **Gas cost**                         | Lower                         | Higher (additional contract call) |
| **Use case**                         | Simple signature verification | Smart wallet compatibility        |

The ERC1271Module first recovers the signer using ECDSA (like ECDSAModule), then additionally checks if the signer is a
smart contract. If it is, the module calls the contract's `isValidSignature` function to verify the signature according
to ERC-1271.

## How to use this module?

### 1. Set authorized signers for your portal

Only the portal owner can authorize signers. Call the `setAuthorizedSigners` function:

```solidity
function setAuthorizedSigners(
  address portal,
  address[] calldata signers,
  bool[] calldata authorizationStatus
) public onlyPortalOwner(portal);
```

**Parameters:**

- `portal`: The address of your portal
- `signers`: An array of signer addresses (can be EOAs or smart contract wallets)
- `authorizationStatus`: An array of booleans (`true` to authorize, `false` to revoke)

**Example:**

```solidity
address[] memory signers = new address[](2);
signers[0] = 0x1234...; // EOA signer
signers[1] = 0x5678...; // Gnosis Safe address

bool[] memory status = new bool[](2);
status[0] = true; // Authorize
status[1] = true; // Authorize

erc1271Module.setAuthorizedSigners(portalAddress, signers, status);
```

### 2. Include the module when registering your portal

Add the ERC1271Module address to your portal's modules array.

### 3. Create attestations with signatures

When creating an attestation, pass the signature as the `validationPayload`:

- The signature should be on the hash of the `attestationPayload`
- For EOAs: Standard ECDSA signature (65 bytes)
- For smart contract wallets: The signature format depends on the wallet implementation (e.g., Gnosis Safe uses a
  specific format)

The module will:

1. Recover the signer from the signature
2. Check if the signer is authorized for the portal
3. If the signer is a contract, call `isValidSignature` to verify according to ERC-1271

## How to check authorized signers?

The ERC1271Module exposes a public mapping:

```solidity
mapping(address portal => mapping(address signer => bool authorizedSigners))
  public authorizedSigners;
```

You can query this mapping to check if a specific signer is authorized for a portal.

## Important notes

{% hint style="warning" %} **This module doesn't check that a signature can be used only once!** If you need replay
protection, implement it in your portal or use an additional nonce-based module. {% endhint %}

{% hint style="info" %} **Smart contract wallet support:** The signer address must implement the
`isValidSignature(bytes32 hash, bytes signature)` function as defined in ERC-1271. Most modern smart contract wallets
(Gnosis Safe, Argent, etc.) already implement this standard. {% endhint %}

## Example: Supporting Gnosis Safe

```solidity
// 1. Deploy your portal with ERC1271Module
address[] memory modules = new address[](1);
modules[0] = erc1271ModuleAddress;

// 2. Authorize a Gnosis Safe as a signer
address gnosisSafeAddress = 0x...;
erc1271Module.setAuthorizedSigners(
  portalAddress,
  [gnosisSafeAddress],
  [true]
);

// 3. The Gnosis Safe owners can now sign attestation payloads
// The Safe's isValidSignature will verify the multisig threshold
```
