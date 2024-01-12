# Attestations

## Overview

Attestations are statements made by an issuer about a subject.  The subject can be an EVM address, or a DID, or an IPFS hash, or even another attestation.

Examples of attestations could include:

* Owner of address `0xbabe1999…` has completed a course on Solidity
* Contract at address `0x666bea5f…` is a malicious erc-20 token
* Owner of address `0xd00daa…` is a human being (i.e. not a bot)
* Owner of address `0xdeadbeef…` is a member of DimSumDAO
* Attestation `0x1435` is a (in)valid attestation
* Attestation `0x2877` is a "like" for content stored at `0xa1b2c3d4…`
* Owner of address `0x1facedf00dba11…` attended event `0xf00dba11…`

Attestations are created through things called "[portals](portals.md)" that make sure that the attestations are consistent with the logic of a specific domain.

Attestations are created in reference to "[schemas](schemas.md)", which describe the structure of the attestation data, i.e. the various fields and their respective data types.

Attestations can be [linked](linked-data.md) together to form complex graphs of attestations.  Anyone can create link between attestations, and attestations themselves can have attestations.  This allows for deriving complex reputation scores which grow more accurate the more data there is in the registry, resulting in hyperscale signal-to-noise ratio.

## Attestation Metadata

Attestations have various metadata recorded in addition to the raw attestation data itself.  A description of this metadata is listed in the table below:

<table><thead><tr><th width="169">Property</th><th width="108.33333333333331">Datatype</th><th>Description</th></tr></thead><tbody><tr><td>attestationId</td><td>bytes32</td><td>The unique identifier of the attestation</td></tr><tr><td>schemaId</td><td>bytes32</td><td>The identifier of the <a href="schemas.md">schema</a> this attestation adheres to</td></tr><tr><td>replacedBy</td><td>uint256</td><td>The attestation id that replaces this attestation</td></tr><tr><td>attester</td><td>address</td><td>The address issuing the attestation to the subject</td></tr><tr><td>portal</td><td>address</td><td>The address of the <a href="portals.md">portal</a> that created the attestation</td></tr><tr><td>attestedDate</td><td>uint64</td><td>The date the attestation is issued</td></tr><tr><td>expirationDate</td><td>uint64</td><td>The expiration date of the attestation</td></tr><tr><td>revocationDate</td><td>uint64</td><td>The date when the attestation was revoked</td></tr><tr><td>version</td><td>uint16</td><td>Version of the registry when the attestation was created</td></tr><tr><td>revoked</td><td>bool</td><td>Whether the attestation is <a href="../developer-guides/for-attestation-issuers/revoke-an-attestation.md">revoked</a> or not</td></tr><tr><td>subject</td><td>bytes</td><td>The id of the attestee e.g. an EVM address, DID, URL etc.</td></tr><tr><td>attestationData</td><td>bytes</td><td>The raw attestation data</td></tr></tbody></table>

When reading attestations directly from the registry, you need the attestation id.  The attestation data that is returned from the registry in a bytes array, which can be decoded using the schema string, which can be retrieved with the schema id in the attestation metadata.

The next section describes schemas, what they are, and how they are used.
