---
description: This tutorial aims to create a Schema, a Portal and issue an Attestation via the Verax SDK in a frontend application.
---

{% hint style="warning" %}
To go through this tutorial, you must be allow-listed as an Issuer.
You can reach out to us via our [**Discord server**](https://discord.gg/Sq4EmYdBEk).
{% endhint %}

For this tutorial, we will aim to issue an attestation that the user has completed … the tutorial.
To that end, we'll go with a basic Vite/React setup.

The 5 steps of the tutorial are as follows:

1. Connect a wallet
2. Instantiate the Verax SDK
3. Create a Schema
4. Create a Portal
5. Issue an Attestation
6. Display the Attestation

The webapp created for this tutorial can be found [on our website](https://ver.ax/#/tutorials).
The code for this web application can be
found [on GitHub](https://github.com/Consensys/linea-attestation-registry/blob/dev/website/src/pages/Tutorials.tsx).

## 1. Connect a wallet

As this is not the focus of the tutorial, we will not go into details on how to connect a wallet.  
In any case, we recommend using the widely used [Web3Modal](https://docs.walletconnect.com/web3modal/react/about)
connector.

## 2. Instantiate the Verax SDK

Instead of writing all our code by hand, we'll rely on the Verax SDK to do the heavy lifting for us.  
Let's start with installing this dependency:

```bash
npm i @verax-attestation-registry/verax-sdk
```

Now, let's import the Verax SDK and instantiate it:

```typescript
import {VeraxSdk} from "@verax-attestation-registry/verax-sdk";

const sdkConf = chain.id === 59144 ? VeraxSdk.DEFAULT_LINEA_MAINNET_FRONTEND : VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND;
const veraxSdk = new VeraxSdk(sdkConf, address);
```

Let's break down the different parts of this code:

1. We import the VeraxSdk class from the Verax SDK package
2. We define the configuration for the Verax SDK. In this case, we use the default configuration for the Linea testnet,
   or the Linea mainnet depending on the chain ID.
3. We instantiate the VeraxSdk class with the configuration, and the address of the wallet we connected to.

We can now use the `veraxSdk` object to interact with the Verax SDK (and behind the scenes, the Verax smart contracts
and the subgraph GraphQL API).

## Create a Schema

First, we need to define the Schema representing the content that will be attested by our dApp.  
A Schema is a Solidity-typed string defining a structure. We strongly encourage the developers to follow the
format `(type fieldName)` where `type` is a Solidity type and `fieldName` is a name for the field.

In our case, we want to attest that a user has completed the tutorial. Let's declare a Schema string for that:

```typescript
const SCHEMA = '(bool hasCompletedTutorial)';
```

Let's use Verax's SDK to create a Schema on-chain:

```typescript
await veraxSdk.schema.create(
    "Tutorial Schema",
    "This Schema is used for the tutorial",
    "https://ver.ax/#/tutorials",
    SCHEMA,
);
```

The `create` method takes four arguments:

1. The name of the Schema
2. The description of the Schema
3. The context of the Schema
4. The Schema string itself

This method will register the Schema on-chain, on the `SchemaRegistry` contract and return the hash of the corresponding
transaction that was emitted.

Two important things to note:

1. It is possible to pre-compute the Schema ID.
2. It is impossible to define the same Schema twice. If you try to do so, the transaction will revert.

### Pre-compute the Schema ID

```typescript
const schemaId = (await veraxSdk.schema.getIdFromSchemaString(SCHEMA)) as `0x${string}`;
```

### Check if the Schema already exists

```typescript
const alreadyExists = (await veraxSdk.schema.getSchema(schemaId)) as boolean;
```

## Create a Portal

Now that we have a Schema, we need to create a Portal, which will be the gateway to issue attestations.  
We have two ways to do so:

1. Create a custom Portal (a smart contract), deploy it and register it on the `PortalRegistry` contract.
2. Deploy a default Portal, directly via the `PortalRegistry` contract.

We are going to use the second option, as it is the simplest and fastest one.

```typescript
const hash = await veraxSdk.portal.deployDefaultPortal(
    [],
    "Tutorial Portal",
    "This Portal is used for the tutorial",
    true,
    "Verax Tutorial",
);
```

The `deployDefaultPortal` method takes five arguments:

1. The list of Modules this Portal leverages (in our case, we don't need any)
2. The name of the Portal
3. The description of the Portal
4. Whether the Portal issues attestations that are revocable or not
5. The name of the Portal owner for discoverability

This method will register the Portal on-chain, on the `PortalRegistry` contract and return the hash of the corresponding
transaction that was emitted.

## Issue an Attestation

Now that we have a Schema and a Portal, we can finally issue an Attestation!

```typescript
const hash = await veraxSdk.portal.attest(
    portalId,
    {
        schemaId,
        expirationDate: Math.floor(Date.now() / 1000) + 2592000,
        subject: address,
        attestationData: [{hasCompletedTutorial: true}],
    },
    [],
);
```

The `attest` method takes three arguments:

1. The ID of the Portal (its Ethereum address)
2. The Attestation payload:
    1. The ID of the Schema it follows
    2. The expiration date of the Attestation (timestamp in seconds, in our case 30 days from now)
    3. The subject of the Attestation (the entity that was attested, in our case, the Ethereum address of the connected user)
    4. The data of the Attestation, as an array of objects matching the Schema
3. The payload to validate the attestation through the Modules (empty in our case, as we don't use any)

This method will register the Attestation on-chain, on the `AttestationRegistry` contract and return the hash of the
corresponding
transaction that was emitted.

## Display the Attestation

Once the Attestation is issued, we can display it to the user.

```typescript
const attestation = await veraxSdk.attestation.getAttestation(attestationId);
```

The `getAttestation` method takes one argument:

1. The ID of the Attestation

This method will return the Attestation, which was registered on-chain, indexed by the subgraph and decoded by the
SDK.

## Conclusion

This example is basic, but it shows how easy it is to integrate Verax into your dApp thanks to the Verax
SDK.

The webapp created for this tutorial can be found [on our website](https://ver.ax/#/tutorials).
The code for this web application can be
found [on GitHub](https://github.com/Consensys/linea-attestation-registry/blob/dev/website/src/pages/Tutorials.tsx).
