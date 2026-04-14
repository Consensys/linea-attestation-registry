# Governance Parameters

This page summarizes the kinds of parameters governance is expected to manage. It should not be treated as a permanent
snapshot of live production settings.

## Typical governance-controlled areas

- deployment ownership and operational multisigs;
- issuer onboarding policy for allowlisted environments;
- proposal lifecycles and review expectations;
- upgrade approval flows;
- chain deployment decisions.

## Issuer onboarding context

On testnet deployments, registration is permissionless because `PortalRegistry` can run with `isTestnet = true`.

On mainnet deployments, issuer onboarding still matters because schema creation and portal registration depend on the
allowlist flow managed through `PortalRegistry`.

## Practical rule

Use this page for governance framing only. For the actual live onboarding process, proposal timing, and decision
criteria, confirm on the community forum.
