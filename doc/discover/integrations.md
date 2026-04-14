# Integrations

This page is about how to discover existing Verax integrations without confusing curated surfaces with protocol truth.

## Explorer

The explorer is the easiest place to browse featured integrations and live protocol objects:

- schemas;
- modules;
- portals;
- attestations;
- subject pages;
- search results.

See [Using the Explorer](../developer-guides/using-the-explorer.md).

## Important limitation

The issuer showcase in the explorer is currently curated UI data, not a complete dynamic index of every issuer in
`PortalRegistry`.

That means:

- featured issuers are useful for discovery;
- they are not an exhaustive protocol-level integration list.

## Exhaustive discovery paths

For complete or programmable discovery, prefer:

- the subgraph;
- SDK multi-chain queries;
- direct reads from `PortalRegistry`, `SchemaRegistry`, and `ModuleRegistry`.
