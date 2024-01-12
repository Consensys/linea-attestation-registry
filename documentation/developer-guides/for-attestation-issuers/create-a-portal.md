# Create a Portal

## Creating a Portal

In order to create a portal, you must first deploy a contract which inherits the [`AbstractPortal`](https://github.com/Consensys/linea-attestation-registry/blob/cd8f14463d5e96718b021bb3f66a9467e7c0ea3a/src/interface/AbstractPortal.sol) abstract contract.  This portal contract is where you create attestations in the registry.  You have full control over the logic in this contract, so long as it inherits the base `AbstractPortal` contract.  The function that you will calling in order to issue an attestation is:

```solidity
function attest(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload
  ) public payable;
```

This function allows you to actually create attestations, you can call the various modules and/or apply any other logic you need to.  The convention is to keep as much logic as possible in modules, but it's up to you how you implement your own domain logic.  You can choose to override this function and add your own logic, or simply use the function as defined in `AbstractPortal`.\
\
The `AttestationPayload` struct is specified as follows:

```solidity
struct AttestationPayload {
  bytes32 schemaId; // The identifier of the schema this attestation adheres to
  uint64 expirationDate; // The expiration date of the attestation
  bytes subject; // The identifier of the attestee e.g. EVM address, DID, URL etc.
  bytes attestationData; // The raw attestation data
}
```

## Deploying the Portal

It is possible to deploy a portal without writing a single line of code, by simply calling the `deployDefaultPortal` function on the Portal Registry contract.  This function accepts the following parameters:

```solidity
function deployDefaultPortal(
  address[] calldata modules,
  string memory name,
  string memory description,
  bool isRevocable,
  string memory ownerName
)
```

Descriptions for each of the parameters are as follow:

<table><thead><tr><th width="149.33333333333331">Parameter</th><th width="114">Datatype</th><th>Description</th></tr></thead><tbody><tr><td>modules</td><td>address[]</td><td>address of the modules to execute for all attestations</td></tr><tr><td>name</td><td>string</td><td>a descriptive name for the portal</td></tr><tr><td>description</td><td>string</td><td>a description of the portal's functionality</td></tr><tr><td>isRevocable</td><td>bool</td><td>whether attestations issued by the portal can be revoked</td></tr><tr><td>ownerName</td><td>string</td><td>The name of the owner of the portal</td></tr></tbody></table>

It is recommended to deploy and registry at least the `MsgSenderModule` module contract and pass it's address in the first parameter.  This module will allow you to lock down the portal so that only you can issue attestations through it.  Alternatively, you can create a module that checks a signature, or a module that checks that the attestations coming through your portal are based on specific schemas.

## Lifecycle Hooks

The `AbstractPortal` contract defines the following life cycle hooks:

* onAttest
* onReplace
* onBulkAttest
* onBulkReplace
* onRevoke
* onBulkRevoke

These lifecycle hooks can be overridden in the concrete implementation of the Portal, and can be used to implement additional logic and specific points in the lifecycle of an attestation.

## Registering the Portal

Once you have deployed your portal contract, you simply call the `registerPortal` function on the registry contract, providing the portal contract address, as well as the portal name and description.  Note however that any modules you specify on the module chain will need to be deployed and registered first.  For more details on the smart contract calls and the required arguments, see the [Create a Portal](create-a-portal.md) page.

{% hint style="warning" %}
While you can put whatever logic you want to in your portal contracts, it is strongly advised that you keep you portal as modular as possible, which means keeping your logic in modules.  In the future, we _may_ pivot to no-code portals, which have no contract, and which simply execute a specific chain of modules!
{% endhint %}

One important caveat is that initially creating a portal requires that you need to be listed as an "issuer" in the registry.  To be listed as an issuer, you simply need to reach out to any of the core contributors.  In the early stages of the project, we will be in a closed beta, which means you'll need to get listed before deploying a portal or registering a schema. Getting listed as an issuer is as easy as getting in touch using any of our [communication channels](../../get-involved/get-in-touch.md).

Once you have deployed you portal, you are ready to issue your first attestation!
