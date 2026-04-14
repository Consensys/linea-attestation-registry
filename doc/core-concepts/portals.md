# Portals

Portals are issuer-controlled contracts that write attestations into Verax.

Every onchain attestation in Verax is created through a registered portal.

## Why portals exist

Portals let issuers define how attestations are created without changing the shared registry itself.

A portal can:

- validate incoming requests with modules;
- override attester semantics with `getAttester()`;
- add lifecycle logic before attest, replace, or revoke;
- expose a product-specific interface to end users or backend systems.

## Two ways to get a portal

### `DefaultPortalV2`

If you only need a standard entrypoint with a list of modules, use `PortalRegistry.deployDefaultPortal(...)`.

This deploys a `DefaultPortalV2` clone-like instance and registers it in one step.

### Custom portal

If you need custom logic, inherit `AbstractPortalV2`:

```solidity
contract ExamplePortal is AbstractPortalV2 {
  constructor(address[] memory modules, address router) AbstractPortalV2(modules, router) {}
}
```

The constructor wires the portal to the deployment's `Router`, which then resolves:

- `AttestationRegistry`
- `ModuleRegistry`
- `PortalRegistry`

## Main portal methods

`AbstractPortalV2` exposes the common lifecycle:

- `attest(...)`
- `bulkAttest(...)`
- `replace(...)`
- `bulkReplace(...)`
- `revoke(...)`
- `bulkRevoke(...)`
- `withdraw(...)`

By default:

- `attest` and `replace` can forward `msg.value`;
- `replace`, `bulkReplace`, `revoke`, and `bulkRevoke` are restricted to the portal owner;
- the portal owner is resolved from `PortalRegistry.getPortalOwner(address(this))`.

## Hooks

Custom portals can override these hooks:

- `_onAttest(...)`
- `_onBulkAttest(...)`
- `_onReplace(...)`
- `_onBulkReplace(...)`
- `_onRevoke(...)`
- `_onBulkRevoke(...)`

Use them for lightweight lifecycle logic that should happen around registry writes.

## Registration model

For custom portals, registration happens in `PortalRegistry.register(...)` with:

- portal address;
- name;
- description;
- `isRevocable`;
- owner name.

For default portals, `deployDefaultPortal(...)` both deploys and registers the portal.

## Discoverability vs control

Portals are where issuer identity becomes visible at protocol level:

- they define the owner address;
- they expose the module chain;
- they advertise revocability;
- they give consumers a stable contract-level entrypoint.

That makes portals the right unit for many trust decisions.

## Related concepts

- [Modules](modules.md)
- [Create a Portal](../developer-guides/for-attestation-issuers/create-a-portal.md)
- [Register a Portal](../developer-guides/for-attestation-issuers/register-a-portal.md)
