// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

/// @notice A struct representing a single attestation.
// solhint-disable-next-line max-line-length
// this definition was taken from: https://github.com/ethereum-attestation-service/eas-contracts/blob/master/contracts/Common.sol#L25
struct Attestation {
  bytes32 uid; // A unique identifier of the attestation.
  bytes32 schema; // The unique identifier of the schema.
  uint64 time; // The time when the attestation was created (Unix timestamp).
  uint64 expirationTime; // The time when the attestation expires (Unix timestamp).
  uint64 revocationTime; // The time when the attestation was revoked (Unix timestamp).
  bytes32 refUID; // The UID of the related attestation.
  address recipient; // The recipient of the attestation.
  address attester; // The attester/sender of the attestation.
  bool revocable; // Whether the attestation is revocable.
  bytes data; // Custom attestation data.
}

/// @title IEAS
/// @notice EAS - Ethereum Attestation Service interface.
// solhint-disable-next-line max-line-length
// this definition was taken from: https://github.com/ethereum-attestation-service/eas-contracts/blob/master/contracts/IEAS.sol#L86
interface IEAS {
  /// @notice Returns an existing attestation by UID.
  /// @param uid The UID of the attestation to retrieve.
  /// @return The attestation data members.
  function getAttestation(bytes32 uid) external view returns (Attestation memory);
}
