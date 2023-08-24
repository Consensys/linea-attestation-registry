// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

struct AttestationPayload {
  bytes32 schemaId; // The identifier of the schema this attestation adheres to.
  bytes subject; // The ID of the attestee, EVM address, DID, URL etc.
  uint256 expirationDate; // The expiration date of the attestation.
  bytes attestationData; // The attestation data.
}

/// @notice EAS attestation request data.
struct AttestationRequestData {
  address recipient; // The recipient of the attestation.
  uint64 expirationTime; // The time when the attestation expires (Unix timestamp).
  bool revocable; // Whether the attestation is revocable.
  bytes32 refUID; // The UID of the related attestation.
  bytes data; // Custom attestation data.
  uint256 value; // An explicit ETH amount to send to the resolver. This is important to prevent accidental user errors.
}

/// @notice A struct representing the full arguments of the EAS attestation request.
struct AttestationRequest {
  bytes32 schema; // The unique identifier of the schema.
  AttestationRequestData data; // The arguments of the attestation request.
}

struct Attestation {
  bytes32 attestationId; // The unique identifier of the attestation.
  bytes32 schemaId; // The identifier of the schema this attestation adheres to.
  address attester; // The address issuing the attestation to the subject.
  address portal; // The id of the portal that created the attestation.
  bytes subject; // The ID of the attestee, EVM address, DID, URL etc.
  uint256 attestedDate; // The date the attestation is issued.
  uint256 expirationDate; // The expiration date of the attestation.
  bool revoked; // Whether the attestation is revoked or not.
  uint16 version; // Version of the registry when the attestation was created.
  bytes attestationData; // The attestation data.
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
