// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC721, ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import { AbstractPortal } from "../../abstracts/AbstractPortal.sol";
import { Attestation, AttestationPayload } from "../../types/Structs.sol";
import { IPortal } from "../../interfaces/IPortal.sol";

/**
 * @title NFT Portal
 * @author Consensys
 * @notice This contract aims to provide ERC 721 compatibility
 * @dev This Portal implements parts of ERC 721 - balanceOf and ownerOf functions
 */
contract NFTPortal is AbstractPortal, ERC721 {
  mapping(bytes owner => uint256 numberOfAttestations) private numberOfAttestationsPerOwner;

  /// @notice Error thrown when someone else than the Attestation's subject is trying to revoke
  error OnlySubject();

  /**
   * @notice Contract constructor
   * @param modules list of modules to use for the portal (can be empty)
   * @param router Router's address
   * @param name The name of the token
   * @param symbol The symbol of the token
   * @dev This sets the addresses for the AttestationRegistry, ModuleRegistry and PortalRegistry
   */
  constructor(
    address[] memory modules,
    address router,
    string memory name,
    string memory symbol
  ) AbstractPortal(modules, router) ERC721(name, symbol) {}

  function _baseURI() internal pure override returns (string memory) {
    return "https://explorer.ver.ax/linea/attestations";
  }

  /**
   * @notice Count all attestations assigned to an owner
   * @param owner An address for whom to query the balance
   * @return The number of attestations owned by `owner`, possibly zero
   */
  function balanceOf(address owner) public view virtual override returns (uint256) {
    return numberOfAttestationsPerOwner[abi.encode(owner)];
  }

  /**
   * @notice Find the owner of an attestation
   * @param tokenId The identifier for an attestation
   * @return The address of the owner of the attestation
   */
  function ownerOf(uint256 tokenId) public view virtual override returns (address) {
    bytes32 attestationId = bytes32(tokenId);
    Attestation memory attestation = attestationRegistry.getAttestation(attestationId);
    return abi.decode(attestation.subject, (address));
  }

  /**
   * @inheritdoc AbstractPortal
   */
  function _onAttest(
    AttestationPayload memory attestationPayload,
    address /*attester*/,
    uint256 /*value*/
  ) internal override {
    numberOfAttestationsPerOwner[attestationPayload.subject]++;
  }

  /**
   * @inheritdoc AbstractPortal
   */
  function _onAttestV2(
    AttestationPayload memory attestationPayload,
    bytes[] memory /*validationPayloads*/,
    uint256 /*value*/
  ) internal override {
    numberOfAttestationsPerOwner[attestationPayload.subject]++;
  }

  /**
   * @inheritdoc AbstractPortal
   */
  function _onBulkAttest(
    AttestationPayload[] memory /*attestationsPayloads*/,
    bytes[][] memory /*validationPayloads*/
  ) internal pure override {
    revert("Bulk attest is not implemented.");
  }

  /**
   * @inheritdoc AbstractPortal
   */
  function _onReplace(
    bytes32 /*attestationId*/,
    AttestationPayload memory /*attestationPayload*/,
    address /*attester*/,
    uint256 /*value*/
  ) internal pure override {
    revert("Replace is not implemented.");
  }

  /**
   * @inheritdoc AbstractPortal
   */
  function _onBulkReplace(
    bytes32[] memory /*attestationIds*/,
    AttestationPayload[] memory /*attestationsPayloads*/,
    bytes[][] memory /*validationPayloads*/
  ) internal pure override {
    revert("Bulk replace is not implemented.");
  }

  /**
   * @inheritdoc AbstractPortal
   */
  function _onRevoke(bytes32 attestationId) internal virtual override {
    Attestation memory attestation = attestationRegistry.getAttestation(attestationId);
    address subject = abi.decode(attestation.subject, (address));
    if (msg.sender != subject) revert OnlySubject();
    // TODO: transfer the token to address(0)?
  }

  /**
   * @inheritdoc AbstractPortal
   */
  function _onBulkRevoke(bytes32[] memory attestationIds) internal virtual override {
    for (uint256 i = 0; i < attestationIds.length; i++) {
      _onRevoke(attestationIds[i]);
    }
  }

  /// @inheritdoc AbstractPortal
  function withdraw(address payable to, uint256 amount) external override {}

  // TODO: decide what to do with "transfer" functions
  // safeTransferFrom(from, to, tokenId, data)
  // safeTransferFrom(from, to, tokenId)
  // transferFrom(from, to, tokenId)

  // TODO: decide what to do with "approve" functions
  // approve(to, tokenId)
  // setApprovalForAll(operator, approved)
  // getApproved(tokenId)
  // isApprovedForAll(owner, operator)

  /**
   * @notice Verifies that a specific interface is implemented by the Portal, following ERC-165 specification
   * @param interfaceID the interface identifier checked in this call
   * @return The list of modules addresses linked to the Portal
   */
  function supportsInterface(bytes4 interfaceID) public pure virtual override(AbstractPortal, ERC721) returns (bool) {
    return
      interfaceID == type(AbstractPortal).interfaceId ||
      interfaceID == type(IPortal).interfaceId ||
      interfaceID == type(IERC165).interfaceId ||
      interfaceID == type(IERC721).interfaceId;
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 /*firstTokenId*/,
    uint256 /*batchSize*/
  ) internal pure override {
    require(
      from == address(0),
      "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner."
    );
  }
}
