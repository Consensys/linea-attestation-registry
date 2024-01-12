---
description: >-
  Description of the official SenderModule contract. This module aims to provide
  a standard way of checking if the sender of an attestation creation
  transaction is authorized for a given portal.
---

# SenderModule

## Link to the code

{% embed url="https://github.com/Consensys/linea-attestation-registry/blob/dev/contracts/src/stdlib/SenderModule.sol" %}

## When to use this module?

An Issuer might want to restrict the addresses able to issue an attestation through his portal. To avoid re-developing an access-based portal, Verax proposes a standard module to that effect.

Once this module is set for a portal, any attestation payload going through the portal will need to come from an authorized sender.

The list of authorized senders may change over time, that's why the issuer can add and/or remove authorized addresses easily via this module.

{% hint style="info" %}
Only the address identified as the 'owner' of a portal can edit the list of authorized senders for his portal.
{% endhint %}

## When not to use this module?

If the logic of your authorization mechanism goes beyond "address 0x... is/isn't authorized", you'll probably need a custom module to enforce your rules.

## How to use this module?

1. Add one or multiple authorized sender(s) for a given portal, by calling the `setAuthorizedSenders` function
2. Pass the address of this module when registering your portal
3. Change the list of authorized senders for a given portal, by calling the `setAuthorizedSenders`function again
4. An event is emitted when the list is updated, containing all the changes

## How to check the authorized sender(s)?

1. The `SenderModule` exposes an `authorizedSenders` mapping
2. Anyone can call this public mapping for a portal address and get the list of authorized addresses as sender
