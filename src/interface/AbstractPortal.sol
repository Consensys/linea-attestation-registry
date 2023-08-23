// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { Attestation, AttestationPayload } from "../types/Structs.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";

abstract contract AbstractPortal is IERC165 {
  address[] modules;
  ModuleRegistry moduleRegistry;
  AttestationRegistry attestationRegistry;

  error ModulePayloadMismatch();

  constructor(address[] memory _modules, address _moduleRegistry, address _attestationRegistry) {
    attestationRegistry = AttestationRegistry(_attestationRegistry);
    moduleRegistry = ModuleRegistry(_moduleRegistry);
    modules = _modules;
  }

  function _beforeAttest(Attestation memory attestation, uint256 value) internal virtual;

  function _afterAttest(Attestation memory attestation, uint256 value) internal virtual;

  function attest(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload
  ) external payable virtual {
    if (modules.length != 0) _runModules(validationPayload);

    Attestation memory attestation = _buildAttestation(attestationPayload);

    _beforeAttest(attestation, msg.value);

    attestationRegistry.attest(attestation);

    _afterAttest(attestation, msg.value);
  }

  function getModules() external view returns (address[] memory) {
    return modules;
  }

  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165).interfaceId;
  }

  function _buildAttestation(AttestationPayload memory attestationPayload) internal view returns (Attestation memory) {
    uint256 attestationId = attestationRegistry.getAttestationId();
    uint16 version = attestationRegistry.getVersionNumber();
    return
      Attestation(
        attestationId,
        attestationPayload.schemaId,
        attestationPayload.attester,
        address(this),
        attestationPayload.subject,
        block.timestamp,
        attestationPayload.expirationDate,
        false,
        version,
        attestationPayload.attestationData
      );
  }

  function revoke(bytes32 attestationId, bytes32 replacedBy) external virtual;

  function _runModules(bytes[] memory validationPayload) internal {
    if (modules.length != validationPayload.length) revert ModulePayloadMismatch();
    moduleRegistry.runModules(modules, validationPayload);
  }
}
