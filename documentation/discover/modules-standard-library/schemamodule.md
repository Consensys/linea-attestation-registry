---
description: >-
  Description of the official SchemaModule contract. This module aims to provide
  a standard way of checking if the Schema ID used in an attestation request is
  authorized for a given portal.
---

# SchemaModule

## Link to the code

{% embed url="https://github.com/Consensys/linea-attestation-registry/blob/dev/contracts/src/stdlib/SchemaModule.sol" %}

## When to use this module?

An Issuer might want to restrict the Schemas with which an attestation can be issued through his portal. To avoid re-developing this feature for each portal, Verax proposes a standard module to that effect.

Once this module is set for a portal, any attestation request going through the portal will need to use an authorized Schema.

The list of authorized Schema may change over time, that's why the issuer can add and/or remove authorized Schemas easily via this module.

{% hint style="info" %}
Only the address identified as the 'owner' of a portal can edit the list of authorized Schemas for his portal.
{% endhint %}

## When not to use this module?

If the logic of your authorization mechanism goes beyond "Schema 0x... is/isn't authorized", you'll probably need a custom module to enforce your rules.

## How to use this module?

1. Add one or multiple authorized Schema(s) for a given portal, by calling the `setAuthorizedSchemaIds` function
2. Pass the address of this module when registering your portal
3. Change the list of authorized Schemas for a given portal, by calling the `setAuthorizedSchemaIds`function again
4. An event is emitted when the list is updated, containing all the changes

## How to check the authorized sender(s)?

1. The `SchemaModule` exposes an `authorizedSchemaIds` mapping
2. Anyone can call this public mapping for a portal address and get the list of authorized Schema IDs
