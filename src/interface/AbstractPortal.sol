// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { Attestation, AttestationPayload } from "../types/Structs.sol";
import "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165Upgradeable.sol";

abstract contract AbstractPortal is IERC165Upgradeable {
  address[] public modules;
  ModuleRegistry public moduleRegistry;
  AttestationRegistry public attestationRegistry;

  error ModulePayloadMismatch();

  constructor(address[] memory _modules, address _moduleRegistry, address _attestationRegistry) {
    attestationRegistry = AttestationRegistry(_attestationRegistry);
    moduleRegistry = ModuleRegistry(_moduleRegistry);
    modules = _modules;
  }

  function _beforeAttest(AttestationPayload memory attestationPayload, uint256 value) internal virtual;

  function _afterAttest(Attestation memory attestation) internal virtual;

  /**
   * @notice attest the schema with given attestationPayload and validationPayload
   * @dev Runs all modules for the portal and registers the attestation using AttestationRegistry
   */
  function attest(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload
  ) external payable virtual {
    if (modules.length != 0) _runModules(validationPayload);

    _beforeAttest(attestationPayload, msg.value);

    Attestation memory attestation = attestationRegistry.attest(attestationPayload, msg.sender);

    _afterAttest(attestation);
  }

  function getModules() external view returns (address[] memory) {
    return modules;
  }

  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165Upgradeable).interfaceId;
  }

  function revoke(bytes32 attestationId, bytes32 replacedBy) external virtual;

  function _runModules(bytes[] memory validationPayload) internal {
    if (modules.length != validationPayload.length) revert ModulePayloadMismatch();
    moduleRegistry.runModules(modules, validationPayload);
  }
}
