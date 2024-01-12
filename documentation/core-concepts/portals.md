# Portals

Portals are the entry point into the registry for attestations.  All attestations are made through portals.  A portal is normally associated with a specific issuer, who would create a portal specifically to issue their attestations with, but portals can also be open to allow anyone to use.

A portal is a smart contract that executes specific verification logic through a chain of modules  that attestations run through before being issued to the registry.  Portals also have metadata associated with them and can optionally execute lifecycle hooks.

## Portal Metadata

All portals contain certain metadata that is associated with them when they are registered:

<table><thead><tr><th width="170">Field</th><th width="120">Type</th><th>Description</th></tr></thead><tbody><tr><td>id</td><td>address</td><td>The portal id which is the address of portal contract</td></tr><tr><td>ownerAddress</td><td>address</td><td>The address of the owner of this portal</td></tr><tr><td>modules</td><td>address[]</td><td>Addresses of modules implemented by the portal</td></tr><tr><td>isRevocable</td><td>bool</td><td>Whether attestations issued can be revoked</td></tr><tr><td>name</td><td>string</td><td>(required) A descriptive name for the module</td></tr><tr><td>description</td><td>string (URI)</td><td>(optional) A link to documentation about the module, it’s intended use etc.</td></tr><tr><td>ownerName</td><td>string</td><td>The name of the owner of this portal</td></tr></tbody></table>

## Lifecycle Hooks

Each portal can specify optional lifecycle hooks that are executed at specific points in an attestations lifecycle.  Hooks are specific functions called at specific points, which include:

* **onAttest** - executed just before an attestation is first created
* **onReplace** - executed just before an attestation is replaced by another attestation
* **onRevoke** - executed when an attestation is first revoked
* **onBulkAttest** - executed when attestations are created in bulk
* **onBulkRevoke** - executed when an attestations are revoked in bulk

## Customization

It's worth noting that the portal contract is entirely under the issuer's control and that the issuer is free to add any logic they want to the portal and customize it in any way!

***

To find out how to create a portal, see the [Create a Portal](../developer-guides/for-attestation-issuers/create-a-portal.md) page for more information.
