// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { Attestation as EASAttestation, IEAS } from "./interfaces/IEAS.sol";
import { Attestation } from "./types/Structs.sol";
import { AttestationRegistry } from "./AttestationRegistry.sol";
import { PortalRegistry } from "./PortalRegistry.sol";
import { IRouter } from "./interfaces/IRouter.sol";

/**
 * @title Attestation Reader
 * @author Consensys
 * @notice This contract allows to read attestations stored by EAS or Verax
 */
contract AttestationReader is OwnableUpgradeable {
  IRouter public router;
  IEAS public easRegistry;

  /// @notice Error thrown when an invalid EAS registry address is given
  error EASAddressInvalid();

  /// @notice Error thrown when the EAS registry address remains unchanged
  error EASRegistryAddressAlreadyUpdated();

  /// @notice Error thrown when the router address is the zero address
  error RouterAddressInvalid();

  /// @notice Event emitted when the EAS registry address is updated
  event EASRegistryAddressUpdated(address easRegistryAddress);

  /// @notice Event emitted when the router address is set
  event RouterSet(address indexed router);

  /**
   * @notice Contract initialization
   * @param _router the address of the Router contract
   */
  function initialize(address _router) public initializer {
    __Ownable_init();
    if (_router == address(0)) revert RouterAddressInvalid();
    router = IRouter(_router);
    emit RouterSet(_router);
  }

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice Changes the address for the EAS attestation registry
   * @param _easRegistryAddress the new EAS Registry address
   * @dev Only the owner can call this method
   */
  function updateEASRegistryAddress(address _easRegistryAddress) public onlyOwner {
    if (_easRegistryAddress == address(0)) revert EASAddressInvalid();
    if (_easRegistryAddress == address(easRegistry)) revert EASRegistryAddressAlreadyUpdated();

    easRegistry = IEAS(_easRegistryAddress);
    emit EASRegistryAddressUpdated(_easRegistryAddress);
  }

  /**
   * @notice Gets an attestation by its identifier
   * @param uid the attestation identifier
   * @return attestation the attestation, following EAS's format
   */
  function getAttestation(bytes32 uid) public view returns (EASAttestation memory attestation) {
    attestation = easRegistry.getAttestation(uid);
    if (attestation.schema == bytes32(0)) {
      AttestationRegistry veraxAttestationRegistry = AttestationRegistry(router.getAttestationRegistry());
      Attestation memory veraxAttestation = veraxAttestationRegistry.getAttestation(uid);
      attestation = _convertToEASAttestation(veraxAttestation);
    }
  }

  /**
   * @notice Converts a Verax attestation to an EAS attestation
   * @param veraxAttestation the Verax attestation to convert
   * @return The EAS attestation converted from the Verax attestation
   * @dev The EAS attestation will have a "zero address" subject if the original subject is not an address
   */
  function _convertToEASAttestation(Attestation memory veraxAttestation) private view returns (EASAttestation memory) {
    address subject = address(0);

    if (veraxAttestation.subject.length == 32) {
      // Check if the first 12 bytes are zero
      bytes memory rawSubject = veraxAttestation.subject;
      if (uint96(bytes12(rawSubject)) == 0) {
        subject = abi.decode(rawSubject, (address));
      }
    }
    if (veraxAttestation.subject.length == 20) subject = address(uint160(bytes20(veraxAttestation.subject)));

    return
      EASAttestation(
        veraxAttestation.attestationId,
        veraxAttestation.schemaId,
        veraxAttestation.attestedDate,
        veraxAttestation.expirationDate,
        veraxAttestation.revocationDate,
        bytes32(0),
        subject,
        veraxAttestation.attester,
        PortalRegistry(router.getPortalRegistry()).getPortalRevocability(veraxAttestation.portal),
        veraxAttestation.attestationData
      );
  }
}
