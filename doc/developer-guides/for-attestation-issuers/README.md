# Build Workflow

This section is the end-to-end path for teams that want to issue attestations with Verax.

In the common case, the workflow is:

1. Define or reuse a schema.
2. Optionally create or reuse modules.
3. Deploy a default portal or a custom portal.
4. Register custom modules and custom portals when needed.
5. Start issuing, revoking, replacing, or linking attestations.

## Two ways to build

### Use an existing Verax deployment

This is the fastest path. You use the deployed registries, subgraph, explorer, and SDK defaults from this repository.

See:

- [Getting Started](../../getting-started.md)
- [Networks and Addresses](../networks-and-addresses.md)
- [Using the SDK](../using-the-sdk.md)

### Deploy your own Verax instance

Use this when you want your own registries, addresses, explorer, or subgraph.

See [Deploying a Verax Instance](../deploying-a-verax-instance.md).

## How to execute the workflow

You can perform most steps in three ways:

- through the SDK;
- through direct contract calls;
- through a block explorer contract UI.

For day-to-day product work, the SDK is the recommended path.
