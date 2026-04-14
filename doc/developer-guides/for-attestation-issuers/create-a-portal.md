# Create a Portal

Portals are the issuer entrypoint into Verax. You can either use the built-in default portal or deploy your own custom
portal contract.

## Option 1: deploy a default portal

This is the fastest path when you only need:

- a list of modules;
- a name and description;
- revocation enabled or disabled;
- no custom contract logic.

`PortalRegistry` exposes:

```solidity
function deployDefaultPortal(
  address[] calldata modules,
  string calldata name,
  string calldata description,
  bool isRevocable,
  string calldata ownerName
) external;
```

This both deploys and registers a `DefaultPortalV2`.

| Parameter     | Type        | Meaning                                          |
| ------------- | ----------- | ------------------------------------------------ |
| `modules`     | `address[]` | Modules to execute before registry writes        |
| `name`        | `string`    | Portal name                                      |
| `description` | `string`    | Portal description                               |
| `isRevocable` | `bool`      | Whether issued attestations can later be revoked |
| `ownerName`   | `string`    | Human-readable issuer name                       |

{% hint style="info" %} `deployDefaultPortal(...)` already registers the new portal. You only need a separate
registration step for custom portal contracts. {% endhint %}

### SDK

```ts
await veraxSdk.portal.deployDefaultPortal(
  [],
  "Example Portal",
  "Default portal used in documentation examples",
  true,
  "Example Issuer",
  { waitForConfirmation: true },
);
```

## Option 2: deploy a custom portal

Inherit `AbstractPortalV2`:

```solidity
import { AbstractPortalV2 } from "@verax-attestation-registry/verax-contracts/contracts/abstracts/AbstractPortalV2.sol";

contract ExamplePortal is AbstractPortalV2 {
  constructor(address[] memory modules, address router) AbstractPortalV2(modules, router) {}
}
```

The constructor takes:

- the module addresses;
- the deployment's `Router` address.

Use the `Router`, not raw registry addresses, so your portal resolves the right registries for that deployment.

{% hint style="warning" %} Use the deployment's `Router` address, not hard-coded registry addresses, when building a
custom portal. That keeps the portal correctly wired to the target Verax instance. {% endhint %}

## Hooks

Custom portals can override:

- `_onAttest(...)`
- `_onBulkAttest(...)`
- `_onReplace(...)`
- `_onBulkReplace(...)`
- `_onRevoke(...)`
- `_onBulkRevoke(...)`

Example:

```solidity
function _onAttest(AttestationPayload memory, bytes[] memory, uint256 value) internal pure override {
  if (value < 0.001 ether) revert InsufficientFee();
}
```

## Ownership and lifecycle defaults

By default in `AbstractPortalV2`:

- `replace`, `bulkReplace`, `revoke`, and `bulkRevoke` are restricted to the portal owner;
- the portal owner is resolved from `PortalRegistry`;
- `withdraw(...)` is also owner-only.

## Next step

- If you used `deployDefaultPortal(...)`, registration is already done.
- If you deployed a custom portal, continue with [Register a Portal](register-a-portal.md).
