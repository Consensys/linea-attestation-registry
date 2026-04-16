# Encoding Attestation Data

Most developers should let the SDK handle encoding for them.

## Recommended path

When you call `veraxSdk.portal.attest(...)`, the SDK:

1. fetches the matching schema;
2. ABI-encodes the payload;
3. submits the encoded bytes to the portal contract.

That means you usually do **not** need to manually build `attestationData`.

## Manual encoding with SDK utilities

If you need low-level control, use:

```ts
const schema = "(string username, uint16 points, bool active)";

const encoded = veraxSdk.utils.encode(schema, ["alice", 42, true]);
const decoded = veraxSdk.utils.decode(schema, encoded);
```

## Equivalent Solidity encoding

```solidity
bytes memory attestationData = abi.encode("alice", 42, true);
```

The order and types must match the schema exactly.

## Nested tuples

For nested data, keep the schema ABI-compatible:

```text
(string username, (string city, string country) location)
```

If you are integrating manually, verify the payload with `utils.decode(...)` before sending transactions.

## Important limitation

The current SDK parser is ABI-oriented. Experimental notation sometimes mentioned in older Verax material, such as
`@extends` or `{ relation ... }`, should not be treated as manually encodable production syntax today.

## When manual encoding is useful

- building custom contracts around Verax;
- debugging explorer calls;
- migrating data;
- validating subgraph or SDK decoding behavior.
