// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

struct Attestation {
  bytes32 attestationId; // The unique identifier of the attestation.
  bytes32 schemaId; // The unique identifier of the schema used.
  address portal; // The address issuing the attestation to the attestee.
  address attestee; // The Attestee address (receiving attestation).
  address attestor; // The Attestor smart contract address.
  uint64 attestedDate; // The date the attestation is issued.
  uint64 expirationDate; // The expiration date of the attestation.
  bool revoked; // Whether the attestation is revoked or not.
  bytes[] attestationData; // The attestation data.
}

struct Schema {
  string context; // The context of the schema.
  string name; // The name of the schema.
  string description; // A description of the schema.
  string schema; // The schema definition.
}

struct Portal {
  address id; // The unique identifier of the portal.
  string name; // The name of the portal.
  string description; // A description of the portal.
  address[] modules; // Addresses of modules implemented by the portal.
}

struct Module {
  string name; // The name of the module.
  string description; // A description of the module.
  address moduleAddress; // The address of the module.
}
