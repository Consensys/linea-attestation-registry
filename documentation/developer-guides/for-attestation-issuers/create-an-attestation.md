# Create an Attestation

Once you have decide which schemas and/or modules you want to use (or have created your own) and have deployed and registered a portal, then you can start creating attestations.

To create an attestation, you can call the `attest` function on your portal contract directly:

```solidity
function attest(
  AttestationPayload memory attestationPayload,
  bytes[] memory validationPayload
) public payable;
```

The two argument are separated into 1) the actual attestation you wish to create, and 2) any extra data that is required in order to create an attestation.  For example, the `validationPayload` could be a zero-knowledge-proof that verifies the attestationPayload.\
\
The `AttestationPayload` struct is specified as follows:

```solidity
struct AttestationPayload {
  bytes32 schemaId; // The identifier of the schema this attestation adheres to.
  uint64 expirationDate; // The expiration date of the attestation.
  bytes subject; // The ID of the attestee, EVM address, DID, URL etc.
  bytes attestationData; // The attestation data.
}
```

The attestation subject can be an EVM address, a DID, a URL or anything that you are issuing your attestation to.   The `attestationData` is the raw bytes that will be `abi.decode`d according the the schema id.

## Constraints on Creating Attestations

When calling the `attest` function, the registry performs certain integrity checks on the new attestation:

* verifies the `schemaId` exists
* verifies the `subject` field is not blank
* verifies the `attestationData` field is not blank

## Attestation Metadata

When creating an attestation, you simply need to specify four properties, as outlined above, however, the attestation registry itself automatically populates the other fields in the attestation metadata at the point at which it is created.  The full list os attestation metadata is included below:

<table><thead><tr><th width="169">Property</th><th width="114.33333333333331">Datatype</th><th>Description</th></tr></thead><tbody><tr><td>attestationId</td><td>bytes32</td><td>The unique identifier of the attestation</td></tr><tr><td>schemaId</td><td>bytes32</td><td>The identifier of the <a href="../../core-concepts/schemas.md">schema</a> this attestation adheres to</td></tr><tr><td>replacedBy</td><td>uint256</td><td>The attestation id that replaces this attestation</td></tr><tr><td>attester</td><td>address</td><td>The address issuing the attestation to the subject</td></tr><tr><td>portal</td><td>address</td><td>The address of the <a href="../../core-concepts/portals.md">portal</a> that created the attestation</td></tr><tr><td>attestedDate</td><td>uint64</td><td>The date the attestation is issued</td></tr><tr><td>expirationDate</td><td>uint64</td><td>The expiration date of the attestation</td></tr><tr><td>revocationDate</td><td>uint64</td><td>The date when the attestation was revoked</td></tr><tr><td>version</td><td>uint16</td><td>Version of the registry when the attestation was created</td></tr><tr><td>revoked</td><td>bool</td><td>Whether the attestation is <a href="revoke-an-attestation.md">revoked</a> or not</td></tr><tr><td>revocationDate</td><td>uint64</td><td>If revoked, the date it was revoked / replaced</td></tr><tr><td>subject</td><td>bytes</td><td>The id of the attestee e.g. an EVM address, DID, URL etc.</td></tr><tr><td>attestationData</td><td>bytes</td><td>The raw attestation data</td></tr></tbody></table>

The `attestationId` is derived from an internal autoincremented counter that is converted from `uint32` to `byte32` and which correlates to the number of attestations issued.

Once the attestation is successfully created in the registry, an `AttestationRegistered` event is emitted with the attestation id, which is subsequently picked up by indexers.
