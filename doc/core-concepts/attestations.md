# Attestations

An attestation is a statement made by an attester about a subject through a registered portal and according to a
registered schema.

Examples:

- "This address passed KYC."
- "This contract was audited."
- "This user belongs to this organization."
- "This attestation references that other attestation."

## Payload shape

Portals issue attestations with the `AttestationPayload` struct:

```solidity
struct AttestationPayload {
  bytes32 schemaId;
  uint64 expirationDate;
  bytes subject;
  bytes attestationData;
}
```

`subject` is intentionally `bytes`, not `address`, so Verax can attest more than EVM accounts.

## Stored attestation metadata

When an attestation is created, `AttestationRegistry` stores both the payload and protocol metadata.

| Field             | Type      | Meaning                                            |
| ----------------- | --------- | -------------------------------------------------- |
| `attestationId`   | `bytes32` | Unique chain-prefixed attestation identifier       |
| `schemaId`        | `bytes32` | Registered schema used by the attestation          |
| `replacedBy`      | `bytes32` | ID of the replacement attestation, if any          |
| `attester`        | `address` | Account recorded as issuer for this attestation    |
| `portal`          | `address` | Portal that created the attestation                |
| `attestedDate`    | `uint64`  | Block timestamp at issuance                        |
| `expirationDate`  | `uint64`  | Expiration timestamp, or `0` for no expiry         |
| `revocationDate`  | `uint64`  | Timestamp of revocation or replacement, if revoked |
| `version`         | `uint16`  | Registry version number at issuance                |
| `revoked`         | `bool`    | Revocation status                                  |
| `subject`         | `bytes`   | Raw subject identifier                             |
| `attestationData` | `bytes`   | ABI-encoded payload                                |

## ID format

Verax prefixes attestation IDs with a chain-specific prefix stored in `AttestationRegistry`. That makes the same numeric
counter produce different IDs on different networks.

This matters for:

- multi-chain indexing;
- cross-chain discovery;
- linked-data workflows that reference attestations by ID.

## Creation checks

`AttestationRegistry.attest(...)` rejects a new attestation when:

- the schema is not registered;
- the `subject` field is empty;
- the `attestationData` field is empty;
- the caller is not a registered portal.

Any additional issuer-specific rules are handled in the portal and its modules before the registry write happens.

## Revocation and replacement

Revocation and replacement are portal-mediated lifecycle actions.

- `revoke(attestationId)` marks the existing attestation as revoked.
- `replace(attestationId, newPayload, ...)` revokes the existing attestation, creates a new one, and sets `replacedBy`.

By default, `AbstractPortalV2` restricts revoke and replace operations to the portal owner.

## Reading attestations

There are three common read paths:

- onchain through `AttestationRegistry` or `AttestationReader`;
- indexed reads through the subgraph;
- typed reads through `veraxSdk.attestation`.

The SDK adds useful decoding and enrichment:

- `decodedPayload` based on the schema string;
- `findByMultiChain(...)`;
- `getRelatedAttestations(...)`;
- offchain payload resolution for the canonical `Offchain` schema.

## Related concepts

- [Schemas](schemas.md)
- [Linked Data](linked-data.md)
- [Canonical Schemas](canonical-schemas.md)
