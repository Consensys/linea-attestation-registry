# Quickstart

Verax supports two common paths:

1. Use an existing Verax deployment on a supported network.
2. Deploy and operate your own Verax instance on a new network.

## Use an existing Verax deployment

This is the fastest path for most teams.

{% hint style="info" %} Choose this path if you want to issue or consume attestations on an existing Verax network
without operating contracts, subgraph, or explorer infrastructure yourself. {% endhint %}

1. Pick a supported network from [Networks and Addresses](developer-guides/networks-and-addresses.md).
2. Decide whether you only need to consume attestations, or whether you also need to issue them.
3. If you only need reads, start with the [SDK](developer-guides/using-the-sdk.md), the
   [Subgraph](developer-guides/using-the-subgraph.md), or the [Explorer](developer-guides/using-the-explorer.md).
4. If you want to issue attestations, follow the [Build Workflow](developer-guides/for-attestation-issuers/README.md):
   1. choose or create a schema;
   2. optionally add modules;
   3. deploy or register a portal;
   4. issue attestations through that portal.

Use this path when:

- you want Verax discoverability without operating infrastructure;
- your application can fit into the existing shared registry model on a supported chain;
- you want to prototype quickly on Linea, Arbitrum, Base, or BSC.

## Deploy your own Verax instance

Use this path when you need a new chain deployment or want to operate the full stack yourself.

{% hint style="warning" %} Running your own instance means owning more than contracts. You will usually need to operate
or customize the subgraph, SDK config, explorer config, canonical schema bootstrapping, and deployment addresses too.
{% endhint %}

1. Deploy the contracts and registries.
2. Run post-deployment bootstrapping for canonical schemas.
3. Optionally deploy the standard library and EAS compatibility helpers.
4. Deploy a subgraph for the new chain.
5. Add the new configuration to the SDK and explorer.

The full workflow is documented in [Deploy a Verax Instance](developer-guides/deploying-a-verax-instance.md).

## Main Concepts

- `Schema`: the typed structure an attestation follows.
- `Portal`: the contract entrypoint used to issue attestations.
- `Module`: reusable validation logic chained by a portal.
- `Attestation`: the onchain record stored by `AttestationRegistry`.

## Operational Notes

{% hint style="warning" %} Testnets are permissionless for schema and portal registration. Mainnets still require issuer
allowlisting for schema and portal registration. {% endhint %}

{% hint style="info" %} `subject` is stored as raw `bytes`, and attestation IDs are chain-prefixed. Both choices are
important for cross-chain and non-address use cases. {% endhint %}
