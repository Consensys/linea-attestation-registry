# Modules

Modules are reusable validation contracts that portals can execute before an attestation is written onchain.

They are the main way to keep issuance logic modular instead of hard-coding every rule into every portal.

## Contract interface

Modules inherit `AbstractModuleV2` and implement:

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

Key inputs:

- `attestationPayload`: the payload being issued or replaced;
- `validationPayload`: module-specific proof or extra data;
- `initialCaller`: original transaction sender;
- `value`: `msg.value` forwarded by the portal;
- `attester`: account the portal records as attester;
- `portal`: issuing portal address;
- `operationType`: `Attest`, `BulkAttest`, `Replace`, or `BulkReplace`.

The module should revert when validation fails.

## Registration model

Modules must be registered in `ModuleRegistry` before portals can rely on them as part of the shared Verax deployment.

Registration stores:

- the module contract address;
- a human-readable name;
- a description string.

Because `AbstractModuleV2` already inherits `ERC165` and exposes `supportsInterface`, most custom modules do not need
extra ERC165 boilerplate beyond inheriting the abstract base.

## Important caveat about `msg.value`

Every module in a portal chain receives the same forwarded value during `attest` and `replace`.

If more than one module tries to account for the same `msg.value`, your workflow can become inconsistent. In practice:

- only one module in a module chain should interpret `msg.value`;
- bulk module execution currently uses `0` as value in `ModuleRegistry.bulkRunModulesV2(...)`.

That second point matters if you rely on payable logic for bulk attest or bulk replace.

{% hint style="warning" %} If you use fee-like or payable validation logic, treat `msg.value` as a shared resource. More
than one module trying to account for it can make the workflow inconsistent. {% endhint %}

## Standard-library modules

The repository includes reusable modules such as:

- `ECDSAModuleV2`
- `ERC1271ModuleV2`
- `FeeModuleV2`
- `SchemaModuleV2`
- `SenderModuleV2`
- `IssuersModuleV2`
- `IndexerModuleV2`

See [Modules Standard Library](../discover/modules-standard-library/README.md).

## When to write a custom module

Use a custom module when you need logic like:

- signature verification with custom replay protection;
- external state checks;
- merkle proof verification;
- issuer-specific authorization rules;
- integration with another contract system.

## Related concepts

- [Portals](portals.md)
- [Create a Module](../developer-guides/for-attestation-issuers/create-a-module.md)
- [Register a Module](../developer-guides/for-attestation-issuers/register-a-module.md)
