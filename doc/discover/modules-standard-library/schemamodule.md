# SchemaModule

Source: `contracts/src/stdlib/SchemaModuleV2.sol`

## What it does

`SchemaModuleV2` restricts a portal to an allowlist of schema IDs.

```solidity
mapping(address portal => mapping(bytes32 schemaId => bool authorized))
  public authorizedSchemaIds;
```

If an attestation payload uses an unauthorized schema ID, the module reverts.

## Portal-owner configuration

```solidity
function setAuthorizedSchemaIds(address portal, bytes32[] calldata schemaIds, bool[] calldata authorizedStatus) public;
```

Only the portal owner can update the schema allowlist for that portal.

## Good fit when

- one portal should issue only a small set of approved schemas;
- you want contract-level enforcement instead of relying on frontend behavior.
