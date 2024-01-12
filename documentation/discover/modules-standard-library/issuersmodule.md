---
description: >-
  Description of the official SchemaModule contract. This module aims to provide
  a standard way of checking if the subject of an Attestation payload is an
  Issuer.
---

# IssuersModule

## Link to the code

{% embed url="https://github.com/Consensys/linea-attestation-registry/blob/dev/contracts/src/stdlib/IssuersModule.sol" %}

## When to use this module?

An Issuer might want to restrict the use of his portal to only Issuers. In other words, his portal will only be able to attest Issuers as subjects (attestees) of the future attestations.

Once this module is set for a portal, any attestation request going through the portal will need to be destined to an Issuer as subject.

The list of Issuers changes over time, but is not controlled by this module. It is managed at the `PortalRegistry` level.

## When not to use this module?

This Module probably serves its purpose in only a few cases, so make sure your use case really requires to only attestations to Issuers.

## How to use this module?

This Module doesn't require any preliminary setup, you just need to pass its address registering your Portal.

## How to check the list of Issuers?

### Via the Explorer

The Issuers are listed on the [landing page of the Explorer](https://explorer.ver.ax)

### Via the SDK

Pending issue [#506](https://github.com/Consensys/linea-attestation-registry/issues/506) resolution.
