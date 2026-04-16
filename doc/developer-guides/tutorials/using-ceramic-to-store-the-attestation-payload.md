# Ceramic Integration Example

This page is kept as an external integration example, not as the primary Verax offchain workflow.

## Use this only if you specifically want Ceramic

Ceramic can make sense when you want:

- mutable offchain state;
- ComposeDB-style querying;
- user-controlled offchain profiles or documents.

## Preferred Verax-native offchain path

If your goal is simply to keep large or structured payloads offchain while preserving an onchain attestation, prefer the
canonical `Offchain` schema plus SDK support for IPFS.

See [Offchain Payloads](../offchain-payloads.md).

## How to think about a Ceramic integration

Treat Ceramic as an application-specific storage layer:

1. store or update the mutable document in Ceramic;
2. attest a stable external identifier or URI in Verax;
3. document the semantics of that external payload in the schema description and context;
4. build your own consumer-side fetch and trust rules.

## Documentation boundary

Because Ceramic is not part of the core Verax repository or protocol deployment model, this GitBook does not treat it as
source-of-truth infrastructure. It is one optional integration pattern among others.
