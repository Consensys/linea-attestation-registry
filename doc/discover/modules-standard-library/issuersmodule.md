# IssuersModule

Source: `contracts/src/stdlib/IssuersModuleV2.sol`

## What it does

`IssuersModuleV2` restricts a portal so that the attestation `subject` must be a registered issuer in `PortalRegistry`.

The module expects the subject to encode an address in either:

- 20-byte raw address form;
- 32-byte ABI-like address form.

If the subject is not address-like or is not registered as an issuer, the module reverts.

## Good fit when

- your portal should only attest other issuer entities;
- you want protocol-level allowlisted issuer subjects.

## Important note about discovery

Do not rely on the explorer home-page issuer showcase as the exhaustive issuer set. That UI is curated.

For protocol truth, use:

- `PortalRegistry.isIssuer(address)`;
- direct contract reads;
- indexed data built from registry events.
