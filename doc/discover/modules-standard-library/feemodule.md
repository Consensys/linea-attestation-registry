# FeeModule

Source: `contracts/src/stdlib/FeeModuleV2.sol`

## What it does

`FeeModuleV2` enforces a minimum fee per portal and schema:

```solidity
mapping(address portal => mapping(bytes32 schemaId => uint256 attestationFee))
  public attestationFees;
```

If the forwarded value is lower than the configured fee, the module reverts.

## Portal-owner configuration

```solidity
function setFees(address portal, bytes32[] calldata schemaIds, uint256[] calldata fees) public;
```

Only the portal owner can configure fees for that portal.

## Important limitation

This module validates the fee but does not route funds anywhere. The value remains in the portal contract, so your
portal needs a withdrawal path.

Also remember:

- only one module in a portal chain should interpret `msg.value`;
- bulk module execution currently uses `0` as forwarded value.
