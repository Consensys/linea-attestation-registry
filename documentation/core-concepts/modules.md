# Modules

Modules are smart contracts that inherit the [`AbstractModule`](https://github.com/Consensys/linea-attestation-registry/blob/dev/src/interface/AbstractModule.sol) contract and are registered in the registry.  They allow for attestation creators to run custom logic in order to do things like:

* verify that attestations conform to some business logic
* verify a signature or a zk-snark
* perform other actions like transferring some tokens or minting an NFT
* recursively create another attestation

Modules are specified in a [portal](portals.md) and all attestations created by that portal are routed through the specified modules.  Modules can also be chained together into discrete pieces of specific functionality.

Each module exposes a public function called `run`:

```solidity
function run(
    AttestationPayload memory attestationPayload,
    bytes memory validationPayload,
    address txSender,
    uint256 value
  ) public pure override {}
```

The function executes whatever logic it needs to, and reverts if the incoming transaction doesn't conform to the required logic.  The `attestationPayload` is the raw data of the incoming attestation, and the `validationPayload` is any qualifying data that is required for verification, but that doesn't make it into the on-chain attestation, e.g. a snark proof, merkle proof or signature etc.

As well as implementing the `Module` interface, a module must also implement [ERC-165](https://eips.ethereum.org/EIPS/eip-165) to ensure that it can be verified properly when being registered.

## Module Metadata

Once the module smart contract is deployed, it can be registered with the following metadata:

<table><thead><tr><th width="179">Field</th><th width="120">Type</th><th>Description</th></tr></thead><tbody><tr><td>moduleAddress</td><td>address</td><td>(required) The address of the module smart contract</td></tr><tr><td>name</td><td>string</td><td>(required) A descriptive name for the module</td></tr><tr><td>description</td><td>string (URI)</td><td>(optional) A link to documentation about the module, its intended use etc.</td></tr></tbody></table>

The metadata above is intended to help to discover modules that can be reused once created.  Modules are chained together and executed in [portals](portals.md).  The next section dives into portals, what they are, and how to create them.
