# Create and Register a Schema

Before issuing attestations, you need a registered schema or a schema that already exists in the target Verax
deployment.

## Onchain interface

Schemas are created in `SchemaRegistry`:

```solidity
function createSchema(
  string calldata name,
  string calldata description,
  string calldata context,
  string calldata schemaString
) public;
```

Protocol checks:

- `name` must be non-empty;
- `schemaString` must be non-empty;
- the schema ID must not already be registered.

| Parameter      | Type     | Meaning                                     |
| -------------- | -------- | ------------------------------------------- |
| `name`         | `string` | Human-readable schema name                  |
| `description`  | `string` | Link or text describing intended use        |
| `context`      | `string` | Semantic context hint or vocabulary pointer |
| `schemaString` | `string` | ABI-like schema definition                  |

{% hint style="warning" %} On mainnets, schema creation is gated by issuer allowlisting. On testnets, the deployment is
permissionless. {% endhint %}

## Recommended flow

1. Compute the schema ID first.
2. Check whether it is already registered.
3. Create it only if needed.

{% hint style="info" %} Because schema IDs are deterministic, recomputing the ID locally is usually easier and more
reliable than scraping it from explorer logs. {% endhint %}

## SDK

```ts
const schemaString = "(bool isExample, uint16 score)";
const schemaId = await veraxSdk.schema.getIdFromSchemaString(schemaString);
const exists = await veraxSdk.schema.isRegistered(schemaId);

if (!exists) {
  await veraxSdk.schema.create(
    "Example Schema",
    "Example schema used in documentation",
    "https://schema.org/Thing",
    schemaString,
    { waitForConfirmation: true },
  );
}
```

## Explorer or manual contract call

<figure><img src="../../.gitbook/assets/create_schema.png" alt="" width="283"><figcaption><p>Example explorer form for calling <code>createSchema</code> on <code>SchemaRegistry</code>.</p></figcaption></figure>

1. Find the `SchemaRegistry` address for your network in [Networks and Addresses](../networks-and-addresses.md).
2. Open the contract page in your network explorer.
3. Go to the contract write interface.
4. Call `createSchema(name, description, context, schemaString)`.
5. Read the emitted `SchemaCreated` event or recompute the ID locally with `getIdFromSchemaString(schemaString)`.

Using the deterministic ID is usually easier than scraping explorer logs.

## Updating the context later

The schema creator can later update `context` with:

```solidity
function updateContext(bytes32 schemaId, string calldata context) public;
```

The caller must be the assigned issuer for that schema.

## Related reads

- [Schemas](../../core-concepts/schemas.md)
- [Canonical Schemas](../../core-concepts/canonical-schemas.md)
