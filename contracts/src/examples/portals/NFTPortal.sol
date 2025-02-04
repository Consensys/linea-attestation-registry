// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC721, ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { AbstractPortalV2 } from "../../abstracts/AbstractPortalV2.sol";
import { Attestation, AttestationPayload } from "../../types/Structs.sol";
import { IPortal } from "../../interfaces/IPortal.sol";

/**
 * @title NFT Portal
 * @notice This contract aims to provide ERC 721 compatibility
 * @dev This Portal implements parts of ERC 721 - balanceOf and ownerOf functions
 */
contract NFTPortal is AbstractPortalV2, ERC721 {
  mapping(address => uint256) private numberOfAttestationsPerOwner;

  /// @dev Error thrown when the subject of an attestation is not a valid address
  error SubjectNotAnAddress();

  /**
   * @notice Contract constructor
   * @param modules list of modules to use for the portal (can be empty)
   * @param router Router's address
   * @dev This sets the addresses for the AttestationRegistry, ModuleRegistry and PortalRegistry
   */
  constructor(
    address[] memory modules,
    address router
  ) AbstractPortalV2(modules, router) ERC721("NFTPortal", "NFTPortal") {}

  /**
   * @notice Count all attestations assigned to an owner
   * @param owner An address for whom to query the balance
   * @return The number of attestations owned by `owner`, possibly zero
   */
  function balanceOf(address owner) public view virtual override returns (uint256) {
    return numberOfAttestationsPerOwner[owner];
  }

  /**
   * @notice Find the owner of an attestation
   * @param tokenId The identifier for an attestation
   * @return The address of the owner of the attestation
   */
  function ownerOf(uint256 tokenId) public view virtual override returns (address) {
    bytes32 attestationId = bytes32(tokenId);
    Attestation memory attestation = attestationRegistry.getAttestation(attestationId);

    bytes memory subject = attestation.subject;
    if (subject.length == 32) {
      // Check if the first 12 bytes are zero
      if (uint96(bytes12(subject)) == 0) {
        return abi.decode(subject, (address));
      }
    }

    if (subject.length == 20) {
      return address(uint160(bytes20(subject)));
    }

    revert SubjectNotAnAddress();
  }

  /**
   * @inheritdoc AbstractPortalV2
   */
  function _onAttest(
    AttestationPayload memory attestationPayload,
    bytes[] memory /*validationPayloads*/,
    uint256 /*value*/
  ) internal override {
    address owner = address(0);
    bytes memory rawSubject = attestationPayload.subject;

    if (rawSubject.length == 32) {
      // Check if the first 12 bytes are zero
      if (uint96(bytes12(rawSubject)) == 0) {
        owner = abi.decode(rawSubject, (address));
      }
    }

    if (rawSubject.length == 20) {
      owner = address(uint160(bytes20(rawSubject)));
    }

    if (owner != address(0)) {
      numberOfAttestationsPerOwner[owner]++;
    }
  }

  /**
   * @notice Verifies that a specific interface is implemented by the Portal, following ERC-165 specification
   * @param interfaceID the interface identifier checked in this call
   * @return The list of modules addresses linked to the Portal
   */
  function supportsInterface(bytes4 interfaceID) public view virtual override(AbstractPortalV2, ERC721) returns (bool) {
    return interfaceID == type(IERC721).interfaceId || super.supportsInterface(interfaceID);
  }
}
