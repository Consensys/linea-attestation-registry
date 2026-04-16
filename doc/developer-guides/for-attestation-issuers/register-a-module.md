# Register a Module

Registering a module makes it discoverable and reusable through the shared Verax deployment.

## Onchain interface

Modules are registered in `ModuleRegistry`:

```solidity
function register(string calldata name, string calldata description, address moduleAddress) public;
```

Protocol checks:

- `name` must be non-empty;
- `moduleAddress` must be a deployed contract;
- the contract must support the `AbstractModuleV2` interface;
- the same address cannot be registered twice.

On mainnets, registration is allowlist-gated. On testnets, it is permissionless.

## SDK

```ts
await veraxSdk.module.register("ExampleModule", "Example validation module", "0xModuleAddress", {
  waitForConfirmation: true,
});
```

## Explorer or manual contract call

<figure><img src="../../.gitbook/assets/register_module.png" alt="" width="217"><figcaption><p>Example explorer form for calling <code>register</code> on <code>ModuleRegistry</code>.</p></figcaption></figure>

1. Find the `ModuleRegistry` address in [Networks and Addresses](../networks-and-addresses.md).
2. Open the contract page in your network explorer.
3. Go to the write interface.
4. Call `register(name, description, moduleAddress)`.

## Reusing an existing module

You do not need to deploy your own module if an existing deployment already fits your use case. Search the explorer or
subgraph for existing modules first.

See [Modules Standard Library](../../discover/modules-standard-library/README.md).
