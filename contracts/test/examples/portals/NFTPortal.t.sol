// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { NFTPortal } from "../../../src/examples/portals/NFTPortal.sol";
import { Router } from "../../../src/Router.sol";
import { AbstractPortalV2 } from "../../../src/abstracts/AbstractPortalV2.sol";
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
  bytes20 public subject1 = bytes20(0x6eCfD8252C19aC2Bf4bd1cBdc026C001C93E179D);
  bytes32 public subject2 = bytes32(uint256(0x0000000000006eCfD8252C19aC2Bf4bd1cBdc026C001C93E179D));
  address public expectedSubject = 0x6eCfD8252C19aC2Bf4bd1cBdc026C001C93E179D;

  event Initialized(uint8 version);
  event AttestationRegistered();
  event BulkAttestationsRegistered();

  function setUp() public {
    router.initialize();
    router.updateModuleRegistry(address(moduleRegistryMock));
    router.updateAttestationRegistry(address(attestationRegistryMock));

    nftPortal = new NFTPortal(modules, address(router));

    // Create attestation payloads
    AttestationPayload memory attestationPayload1 = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      abi.encodePacked(subject1),
      new bytes(1)
    );
    AttestationPayload memory attestationPayload2 = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 1 days),
      abi.encode(subject2),
      new bytes(1)
    );
    // Create validation payload
    bytes[] memory validationPayload = new bytes[](0);
    // Create 2 attestations
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    nftPortal.attest(attestationPayload1, validationPayload);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    nftPortal.attest(attestationPayload2, validationPayload);
  }

  function test_balanceOf() public view {
    uint256 balance = nftPortal.balanceOf(expectedSubject);
    assertEq(balance, 2);
  }

  function test_ownerOf() public view {
    address ownerOfFirstAttestation = nftPortal.ownerOf(1);
    assertEq(ownerOfFirstAttestation, expectedSubject);
    address ownerOfSecondAttestation = nftPortal.ownerOf(2);
    assertEq(ownerOfSecondAttestation, expectedSubject);
  }

  function testSupportsInterface() public view {
    bool isIERC165Supported = nftPortal.supportsInterface(type(IERC165).interfaceId);
    assertTrue(isIERC165Supported);
    bool isIERC721Supported = nftPortal.supportsInterface(type(IERC721).interfaceId);
    assertTrue(isIERC721Supported);
    bool isEASAbstractPortalV2Supported = nftPortal.supportsInterface(type(AbstractPortalV2).interfaceId);
    assertTrue(isEASAbstractPortalV2Supported);
  }
}
