---
description: >-
  The FeeModule allows portal owners to enforce fees for attestations based on schema IDs. This module checks that the
  required fee is paid but does not collect it (the fee remains in the portal contract).
---

# FeeModule

## [Link to the code](https://github.com/Consensys/linea-attestation-registry/blob/dev/contracts/src/stdlib/FeeModuleV2.sol)

## When to use this module?

Use this module when you want to:

- Charge a fee for issuing attestations through your portal
- Set different fees for different schemas
- Monetize your attestation service
- Create economic incentives or disincentives for certain types of attestations

The FeeModule is particularly useful for portals that provide value-added services and want to generate revenue or cover
operational costs.

## When not to use this module?

Don't use this module if:

- You want attestations to be completely free
- You need complex fee logic (e.g., dynamic pricing, discounts) - in that case, create a custom module
- You want the fees to be automatically transferred to a specific address (this module only checks the fee, it doesn't
  collect it)

## How to use this module?

### 1. Set fees for your portal and schemas

Only the portal owner can set fees. Call the `setFees` function with the following parameters:

```solidity
function setFees(address portal, bytes32[] calldata schemaIds, uint256[] calldata fees) public onlyPortalOwner(portal);
```

**Parameters:**

- `portal`: The address of your portal
- `schemaIds`: An array of schema IDs for which you want to set fees
- `fees`: An array of fees (in wei) corresponding to each schema ID

**Example:**

```solidity
bytes32[] memory schemas = new bytes32[](2);
schemas[0] = 0x1234...; // Schema ID 1
schemas[1] = 0x5678...; // Schema ID 2

uint256[] memory fees = new uint256[](2);
fees[0] = 0.001 ether; // Fee for schema 1
fees[1] = 0.005 ether; // Fee for schema 2

feeModule.setFees(portalAddress, schemas, fees);
```

### 2. Include the module when registering your portal

When deploying or registering your portal, include the FeeModule address in the modules array.

### 3. Withdraw collected fees

The fees are sent to the portal contract. Use the portal's `withdraw` function to retrieve them:

```solidity
portal.withdraw(payable(recipient), amount);
```

## How to check the fees?

The FeeModule exposes a public mapping to check fees:

```solidity
mapping(address portal => mapping(bytes32 schemaId => uint256 attestationFee)) public attestationFees;
```

You can query this mapping to see what fee is required for a specific portal and schema combination.

## Important notes

{% hint style="warning" %} **The FeeModule only validates that the fee is paid - it does not collect or transfer the
fee.** The fee (sent as `msg.value`) remains in the portal contract. Make sure your portal implements a `withdraw`
function to retrieve collected fees. {% endhint %}

{% hint style="info" %} When multiple Modules are used in a workflow, ensure that at most one Module processes
`msg.value` to avoid accounting issues, as the total `msg.value` is forwarded to all Modules. {% endhint %}
