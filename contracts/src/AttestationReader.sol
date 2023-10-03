// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import { Attestation as EASAttestation, IEAS } from "./interface/IEAS.sol";
import { Attestation } from "./types/Structs.sol";
import { AttestationRegistry } from "./AttestationRegistry.sol";
import { PortalRegistry } from "./PortalRegistry.sol";
import { IRouter } from "./interface/IRouter.sol";

/**
 * @title Attestation reader
 * @author Consensys
 * @notice This is an example of how to read attestations from both Verax and EAS.
 */
contract AttestationReader is OwnableUpgradeable {
  IRouter public router;
  IEAS public easRegistry;

  /// @notice Error thrown when an invalid Router address is given
  error RouterInvalid();
  /// @notice Error thrown when an invalid EAS registry address is given
  error EASAddressInvalid();

  /**
   * @notice Contract initialization
   */
  function initialize() public initializer {
    __Ownable_init();
  }

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice Changes the address for the Router
   * @dev Only the registry owner can call this method
   */
  function updateRouter(address _router) public onlyOwner {
    if (_router == address(0)) revert RouterInvalid();
    router = IRouter(_router);
  }

  /**
   * @notice Changes the address for the EAS attestation registry
   * @dev Only the owner can call this method
   */
  function updateEASRegistryAddress(address _easRegistryAddress) public onlyOwner {
    if (_easRegistryAddress == address(0)) revert EASAddressInvalid();
    easRegistry = IEAS(_easRegistryAddress);
  }

  /**
   * @notice Gets an attestation by its identifier
   * @param uid the attestation identifier
   * @return the attestation
   */
  function getAttestation(bytes32 uid) public view returns (EASAttestation memory) {
    EASAttestation memory attestation = easRegistry.getAttestation(uid);
    if (attestation.schema == bytes32(0)) {
      AttestationRegistry veraxAttestationRegistry = AttestationRegistry(router.getAttestationRegistry());
      Attestation memory veraxAttestation = veraxAttestationRegistry.getAttestation(uid);
      attestation = _convertToEASAttestation(veraxAttestation);
    }
    return attestation;
  }

  /**
   * @notice Converts verax attestation to EAS attestation
   */
  function _convertToEASAttestation(Attestation memory veraxAttestation) private view returns (EASAttestation memory) {
    EASAttestation memory attestation = EASAttestation(
      veraxAttestation.attestationId,
      veraxAttestation.schemaId,
      veraxAttestation.attestedDate,
      veraxAttestation.expirationDate,
      veraxAttestation.revocationDate,
      bytes32(0),
      abi.decode(veraxAttestation.subject, (address)),
      veraxAttestation.attester,
      PortalRegistry(router.getPortalRegistry()).getPortalByAddress(veraxAttestation.portal).isRevocable,
      veraxAttestation.attestationData
    );
    return attestation;
  }
}
