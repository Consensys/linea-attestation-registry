# Portals

Portals are the entry point into the registry for attestations. All attestations are made through portals. A portal is
normally associated with a specific issuer, who would create a portal specifically to issue their attestations with, but
portals can also be open to allow anyone to use.

A portal is a smart contract that executes specific verification logic through a chain of modules that attestations run
through before being issued to the registry. Portals also have metadata associated with them and can optionally execute
lifecycle hooks.

## Portal Metadata

All portals contain certain metadata associated with them when they are registered:

<table><thead><tr><th width="167.51020408163265">Field</th><th width="120">Type</th><th>Description</th></tr></thead><tbody><tr><td>id</td><td>address</td><td>The portal ID (the address of portal contract)</td></tr><tr><td>ownerAddress</td><td>address</td><td>The address of this portal’s owner</td></tr><tr><td>modules</td><td>address[]</td><td>Addresses of modules implemented by the portal</td></tr><tr><td>isRevocable</td><td>bool</td><td>Whether attestations issued can be revoked</td></tr><tr><td>name</td><td>string</td><td>(required) A descriptive name for the module</td></tr><tr><td>description</td><td>string (URI)</td><td>(optionally) A link to documentation about the module, its intended use, etc.</td></tr><tr><td>ownerName</td><td>string</td><td>The name of this portal’s owner</td></tr></tbody></table>

## Lifecycle Hooks

Each portal can specify optional lifecycle hooks that are executed at specific points in an attestation lifecycle. Hooks
are specific functions called at specific points, which include:

- **onAttest** - executed just before an attestation is first created
- **onReplace** - executed just before an attestation is replaced by another attestation
- **onRevoke** - executed when an attestation is first revoked
- **onBulkAttest** - executed when attestations are created in bulk
- **onBulkReplace** - executed when attestations are replaced in bulk
- **onBulkRevoke** - executed when attestations are revoked in bulk

## Customization

It is worth noting that the portal contract is entirely under the issuer's control and that the issuer is free to add
any logic they want to the portal and customize it in any way!

---

To find out how to create a portal, see the
[Create a Portal](../developer-guides/for-attestation-issuers/register-a-portal.md) page for more information.
