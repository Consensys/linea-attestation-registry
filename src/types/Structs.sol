// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

struct AttestationPayload {
  bytes32 schemaId; // The identifier of the schema this attestation adheres to.
  bytes subject; // The ID of the attestee, EVM address, DID, URL etc.
  uint256 expirationDate; // The expiration date of the attestation.
  bytes attestationData; // The attestation data.
}

struct Attestation {
  uint256 attestationId; // The unique identifier of the attestation.
  bytes32 schemaId; // The identifier of the schema this attestation adheres to.
  address attester; // The address issuing the attestation to the subject.
  address portal; // The id of the portal that created the attestation.
  bytes subject; // The ID of the attestee, EVM address, DID, URL etc.
  uint256 attestedDate; // The date the attestation is issued.
  uint256 expirationDate; // The expiration date of the attestation.
  bool revoked; // Whether the attestation is revoked or not.
  uint256 revocationDate; // The date when the attestation was revoked.
  bytes32 replacedBy; // Whether the attestation was replaced by a new one.
  uint16 version; // Version of the registry when the attestation was created.
  bytes attestationData; // The attestation data.
}

struct Schema {
  string name; // The name of the schema.
  string description; // A description of the schema.
  string context; // The context of the schema.
  string schema; // The schema definition.
}

struct Portal {
  address id; // The unique identifier of the portal.
  string name; // The name of the portal.
  string description; // A description of the portal.
  address[] modules; // Addresses of modules implemented by the portal.
  bool isRevocable; // Whether attestations issued can be revoked.
  address ownerAddress; // The address of the owner of this portal.
  string ownerName; // The name of the owner of this portal.
}

struct Module {
  string name; // The name of the module.
  string description; // A description of the module.
  address moduleAddress; // The address of the module.
}
