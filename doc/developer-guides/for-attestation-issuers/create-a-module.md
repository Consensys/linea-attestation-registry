# Create a Module

Create a custom module when the standard library does not cover your validation logic.

If a standard-library module already fits your need, you can skip this page and just register or reuse that module.

## Contract base

Custom modules inherit `AbstractModuleV2`:

```solidity
import { AbstractModuleV2 } from "@verax-attestation-registry/verax-contracts/contracts/abstracts/AbstractModuleV2.sol";
```

Then implement:

```solidity
function run(
  AttestationPayload calldata attestationPayload,
  bytes calldata validationPayload,
  address initialCaller,
  uint256 value,
  address attester,
  address portal,
  OperationType operationType
) public virtual;
```

`run(...)` should revert when validation fails.

## Minimal example

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "@verax-attestation-registry/verax-contracts/contracts/abstracts/AbstractModuleV2.sol";
import { AttestationPayload } from "@verax-attestation-registry/verax-contracts/contracts/types/Structs.sol";
import { OperationType } from "@verax-attestation-registry/verax-contracts/contracts/types/Enums.sol";

contract ExampleModule is AbstractModuleV2 {
  error InsufficientFee();

  function run(
    AttestationPayload calldata,
    bytes calldata,
    address,
    uint256 value,
    address,
    address,
    OperationType
  ) public pure override {
    if (value < 0.001 ether) revert InsufficientFee();
  }
}
```

## Important implementation notes

- Inheriting `AbstractModuleV2` already gives you ERC-165 support for registration checks.
- `validationPayload` is where you pass signatures, proofs, or any module-specific data.
- `operationType` lets you distinguish attest vs bulk attest vs replace.
- If you rely on `msg.value`, remember that only one module in a chain should interpret it.
- Bulk module execution currently passes `0` as value in `ModuleRegistry.bulkRunModulesV2(...)`.

{% hint style="warning" %} If your module depends on fees or any other payable behavior, remember that bulk module
execution currently passes `0` as value. {% endhint %}

## Next step

Once deployed, register the module in `ModuleRegistry`.

See [Register a Module](register-a-module.md).
