# SenderModule

Source: `contracts/src/stdlib/SenderModuleV2.sol`

## What it does

`SenderModuleV2` restricts a portal to an allowlist of transaction senders.

```solidity
mapping(address portal => mapping(address sender => bool authorized))
  public authorizedSenders;
```

The module checks `initialCaller`, meaning the original transaction sender passed by the portal workflow.

## Portal-owner configuration

```solidity
function setAuthorizedSenders(address portal, address[] calldata senders, bool[] calldata authorizedStatus) public;
```

Only the portal owner can update the allowlist for that portal.

## Good fit when

- only a backend relayer or privileged account should issue through the portal;
- you want simple sender-based access control without signatures.
