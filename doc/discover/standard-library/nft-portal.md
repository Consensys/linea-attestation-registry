# NFT-Compatible Portal Example

Source: `examples/src/portals/NFTPortal.sol`

This is an example portal showing how a Verax portal can expose selected ERC-721-style read behavior.

## What the example demonstrates

The example:

- inherits `AbstractPortalV2`;
- also inherits `ERC721`;
- maps attestation ownership-like reads onto Verax attestations;
- implements `balanceOf(...)` and `ownerOf(...)` in terms of Verax data.

## What it is not

This is **not** a drop-in standard NFT bridge and it is **not** a full ERC-721 lifecycle mirror.

In particular, the example does not try to model:

- token transfers;
- burn behavior on revoke;
- replacement semantics as NFT mutations;
- the full product expectations of wallets and NFT marketplaces.

It is best read as architectural inspiration for compatibility layers, not as a production-ready universal portal.

## When this pattern is useful

Use this pattern when you want an external system that already understands NFT-like ownership reads to consume Verax
attestations with minimal adaptation.
