// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { NFTPortal } from "../../../src/examples/portals/NFTPortal.sol";
import { Router } from "../../../src/Router.sol";
import { AbstractPortal } from "../../../src/abstracts/AbstractPortal.sol";
import { AttestationPayload } from "../../../src/types/Structs.sol";
import { AttestationRegistryMock } from "../../mocks/AttestationRegistryMock.sol";
import { ModuleRegistryMock } from "../../mocks/ModuleRegistryMock.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract NFTPortalTest is Test {
  address public attester = makeAddr("attester");
  NFTPortal public nftPortal;
  address[] public modules = new address[](0);
  ModuleRegistryMock public moduleRegistryMock = new ModuleRegistryMock();
  AttestationRegistryMock public attestationRegistryMock = new AttestationRegistryMock();
  Router public router = new Router();

  event Initialized(uint8 version);
  event AttestationRegistered();
  event BulkAttestationsRegistered();

  function setUp() public {
    router.initialize();
    router.updateModuleRegistry(address(moduleRegistryMock));
    router.updateAttestationRegistry(address(attestationRegistryMock));

    nftPortal = new NFTPortal(modules, address(router));

    // Create attestation payload
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      abi.encode(address(1)), // Convert address(1) to bytes and use as subject
      new bytes(1)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](0);
    // Create 2 attestations
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    nftPortal.attest(attestationPayload, validationPayload);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    nftPortal.attest(attestationPayload, validationPayload);
  }

  function test_balanceOf() public view {
    uint256 balance = nftPortal.balanceOf(address(1));
    assertEq(balance, 2);
  }

  function test_ownerOf() public view {
    address ownerOfFirstAttestation = nftPortal.ownerOf(1);
    address ownerOfSecondAttestation = nftPortal.ownerOf(2);
    assertEq(ownerOfFirstAttestation, address(1));
    assertEq(ownerOfSecondAttestation, address(1));
  }

  function testSupportsInterface() public view {
    bool isIERC165Supported = nftPortal.supportsInterface(type(IERC165).interfaceId);
    assertTrue(isIERC165Supported);
    bool isIERC721Supported = nftPortal.supportsInterface(type(IERC721).interfaceId);
    assertTrue(isIERC721Supported);
    bool isEASAbstractPortalSupported = nftPortal.supportsInterface(type(AbstractPortal).interfaceId);
    assertTrue(isEASAbstractPortalSupported);
  }
}
