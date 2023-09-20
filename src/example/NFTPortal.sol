// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { IERC721, ERC721 } from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";
import { AbstractPortal } from "../interface/AbstractPortal.sol";
import { Attestation, AttestationPayload } from "../types/Structs.sol";

/**
 * @title NFT Portal
 * @author Consensys
 * @notice This contract aims to provide ERC 721 features
 * @dev This Portal implements ERC 721 - balanceOf and ownerOf functions
 */
contract NFTPortal is AbstractPortal, ERC721 {
  mapping(bytes owner => uint256 numberOfAttestations) private numberOfAttestationsPerOwner;

  constructor(address[] memory modules, address router) AbstractPortal(modules, router) ERC721("1", "2") {}

  /// @notice Count all NFTs assigned to an owner
  /// @dev NFTs assigned to the zero address are considered invalid, and this
  ///  function throws for queries about the zero address.
  /// @param owner An address for whom to query the balance
  /// @return The number of NFTs owned by `owner`, possibly zero
  function balanceOf(address owner) public view virtual override returns (uint256) {
    return numberOfAttestationsPerOwner[abi.encodePacked(owner)];
  }

  /// @notice Find the owner of an NFT
  /// @dev NFTs assigned to zero address are considered invalid, and queries
  ///  about them do throw.
  /// @param tokenId The identifier for an NFT
  /// @return The address of the owner of the NFT
  function ownerOf(uint256 tokenId) public view virtual override returns (address)
  {
    bytes32 attestationId = bytes32(tokenId);
    Attestation memory attestation = attestationRegistry.getAttestation(attestationId);
    return address(uint160(bytes20(attestation.subject)));
  }

  function attest(AttestationPayload memory attestationPayload, bytes[] memory validationPayloads) public override payable {
    super.attest(attestationPayload, validationPayloads);
    numberOfAttestationsPerOwner[attestationPayload.subject]++;
  }

  function withdraw(address payable to, uint256 amount) external override {}

  /**
   * @notice Verifies that a specific interface is implemented by the Portal, following ERC-165 specification
   * @param interfaceID the interface identifier checked in this call
   * @return The list of modules addresses linked to the Portal
   */
  function supportsInterface(bytes4 interfaceID) public pure virtual override(AbstractPortal, ERC721) returns (bool) {
    return
      interfaceID == type(AbstractPortal).interfaceId ||
      interfaceID == type(IERC165).interfaceId ||
      interfaceID == type(IERC721).interfaceId;
  }
}
