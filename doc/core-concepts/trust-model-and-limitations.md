# Trust Model and Limitations

Verax is a shared registry, not a universal truth machine.

Consumers still need to decide which issuers, portals, schemas, and attestation lifecycles they trust.

## What Verax guarantees

Verax gives you strong guarantees about:

- who attested onchain;
- through which portal the attestation was created;
- which schema ID the attestation references;
- whether the attestation was revoked or replaced;
- which network the attestation belongs to through the chain-prefixed ID.

## What Verax does not guarantee

Verax does not automatically guarantee:

- that an issuer is trustworthy;
- that a schema is well designed;
- that a portal’s custom logic is secure;
- that an offchain URI still resolves forever;
- that linked attestations are canonical just because they exist.

## Current protocol constraints

- Mainnet schema and portal registration is still allowlist-gated through `PortalRegistry`.
- `subject` is raw `bytes`, which is flexible but pushes normalization responsibility to consumers.
- `replace` is implemented as revoke-then-attest, so downstream consumers should interpret replacement explicitly.
- Multiple modules see the same `msg.value`; at most one module should account for it.
- `IndexerModuleV2` has known caveats:
  - it does not un-index revoked attestations;
  - it is not reliable for bulk attestation ID prediction;
  - it does not include the chain prefix in its predicted ID logic.

## Practical trust model

Most production consumers should combine:

- issuer-level trust;
- schema-level trust;
- portal-level trust;
- lifecycle rules around expiry, revoke, and replace;
- optional multichain aggregation rules.

The registry makes those dimensions visible. It does not choose them for you.
