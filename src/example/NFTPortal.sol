// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { IERC721, ERC721 } from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";
import { AbstractPortal } from "../interface/AbstractPortal.sol";
import { Attestation, AttestationPayload } from "../types/Structs.sol";

/**
 * @title NFT Portal
 * @author Consensys
 * @notice This contract aims to provide ERC 721 compatibility
 * @dev This Portal implements parts of ERC 721 - balanceOf and ownerOf functions
 */
contract NFTPortal is AbstractPortal, ERC721 {
  mapping(bytes owner => uint256 numberOfAttestations) private numberOfAttestationsPerOwner;

  constructor(
    address[] memory modules,
    address router
  ) AbstractPortal(modules, router) ERC721("NFTPortal", "NFTPortal") {}

  /** @notice Count all attestations assigned to an owner
   * @param owner An address for whom to query the balance
   * @return The number of attestations owned by `owner`, possibly zero
   */
  function balanceOf(address owner) public view virtual override returns (uint256) {
    return numberOfAttestationsPerOwner[abi.encode(owner)];
  }

  /** @notice Find the owner of an attestation
   * @param tokenId The identifier for an attestation
   * @return The address of the owner of the attestation
   */
  function ownerOf(uint256 tokenId) public view virtual override returns (address) {
    bytes32 attestationId = bytes32(tokenId);
    Attestation memory attestation = attestationRegistry.getAttestation(attestationId);
    return abi.decode(attestation.subject, (address));
  }

  /**
   * @notice Method run before a payload is attested
   * @param attestationPayload the attestation payload supposed to be attested
   */
  function _onAttest(AttestationPayload memory attestationPayload) internal override {
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
