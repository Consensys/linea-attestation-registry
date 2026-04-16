# Using the Explorer

The public Verax explorer is available at [explorer.ver.ax](https://explorer.ver.ax).

It is useful for browsing public data, validating that an attestation exists, and discovering schemas, modules, and
portals across supported networks.

## What the explorer currently exposes

- an attestation list view;
- a multichain schema catalog grouped by network type;
- a multichain module catalog;
- portal detail pages;
- attestation detail pages;
- subject pages that aggregate attestations by subject;
- search across attestations, schemas, modules, and portals;
- a curated issuer showcase on the home page.

## Important limitation

{% hint style="warning" %} The issuer views in the explorer are currently curated UI data, not a complete onchain
registry-backed issuer index. {% endhint %}

In practice this means:

- the home page and issuer profiles are editorially maintained;
- the registry itself still tracks issuers onchain in `PortalRegistry`;
- for exhaustive or programmable issuer discovery, prefer the subgraph and raw contract reads.

## When to use the explorer

Use the explorer when you want to:

- inspect an attestation or portal manually;
- check whether a schema or module is already public;
- share human-readable links with integrators or partners;
- validate linked-attestation patterns without writing custom queries.

## When not to rely on the explorer alone

Prefer the SDK or subgraph when you need:

- application logic or automated pipelines;
- full multichain querying in code;
- filtering at scale;
- canonical data exports.

## Related tools

- [Using the SDK](using-the-sdk.md)
- [Using the Subgraph](using-the-subgraph.md)
- [Networks and Addresses](networks-and-addresses.md)
