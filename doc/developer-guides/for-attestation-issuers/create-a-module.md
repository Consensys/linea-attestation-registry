# Create a Module

[Modules](../../core-concepts/modules.md) are smart contracts that are registered in the "Module Registry" and that
perform specific validation logic on attestations before they are issued into the registry.

## Using a custom Module

A Module must implement the `AbstractModuleV2` contract to be considered as valid by Verax. Hopefully, we provide all
the core contracts of the Verax platform as an npm package to help developers create their own custom implementations.

- Install the dependency: `npm i @verax-attestation-registry/verax-contracts`
- Import the `AbstractModuleV2` contract:\

  ```solidity
  import { AbstractModuleV2 } from "@verax-attestation-registry/verax-contracts/contracts/abstracts/AbstractModuleV2.sol";
  ```

- Define your custom Module:\

  ```solidity
  contract ExampleModule is AbstractModuleV2 { ... }
  ```

And now ... the floor is yours! You can add your custom functions, of course, but mostly you need to implement the `run`
function that is called in the validation process, before registering the attestation payload.

{% hint style="warning" %} When multiple Modules are used in a workflow, ensure that at most one Module processes
`msg.value` to avoid accounting issues, as the total `msg.value` is forwarded to all Modules. {% endhint %}

## Example

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModuleV2 } from "@verax-attestation-registry/verax-contracts/contracts/abstracts/AbstractModuleV2.sol";
import { AttestationPayload } from "@verax-attestation-registry/verax-contracts/contracts/types/Structs.sol";
import { OperationType } from "@verax-attestation-registry/verax-contracts/contracts/types/Enums.sol";

contract ExampleModule is AbstractModuleV2 {
  error InsufficientFee();

  function run(
    AttestationPayload memory /*attestationPayload*/,
    bytes memory /*validationPayload*/,
    address /*initialCaller*/,
    uint256 value,
    address /*attester*/,
    address /*portal*/,
    OperationType /*operationType*/
  ) public pure override {
    if (value < 1000000000000000) revert InsufficientFee();
  }
}
```

This `ExampleModule` implements the `AbstractModuleV2` contract.

In this example, we are checking that the paid value for this Attestation is at least 0.001 ETH. If it is the case, the
process goes onto the next Module check, and if not, the process stops there and the transaction reverts.
