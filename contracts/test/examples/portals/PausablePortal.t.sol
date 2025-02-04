// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { PausablePortal } from "../../../src/examples/portals/PausablePortal.sol";
import { Router } from "../../../src/Router.sol";
import { AbstractPortalV2 } from "../../../src/abstracts/AbstractPortalV2.sol";
import { AttestationPayload } from "../../../src/types/Structs.sol";
import { AttestationRegistryMock } from "../../mocks/AttestationRegistryMock.sol";
import { PortalRegistryMock } from "../../mocks/PortalRegistryMock.sol";
import { ModuleRegistryMock } from "../../mocks/ModuleRegistryMock.sol";
import { IERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

contract PausablePortalTest is Test {
  address public portalOwner = makeAddr("portalOwner");
  PausablePortal public pausablePortal;
  address[] public modules = new address[](0);
  ModuleRegistryMock public moduleRegistryMock = new ModuleRegistryMock();
  AttestationRegistryMock public attestationRegistryMock = new AttestationRegistryMock();
  PortalRegistryMock public portalRegistryMock = new PortalRegistryMock();
  Router public router = new Router();

  event Initialized(uint8 version);
  event AttestationRegistered();
  event AttestationReplaced();
  event BulkAttestationsReplaced();
  event BulkAttestationsRegistered();
  event AttestationRevoked(bytes32 attestationId);
  event BulkAttestationsRevoked(bytes32[] attestationId);

  function setUp() public {
    router.initialize();
    router.updateModuleRegistry(address(moduleRegistryMock));
    router.updateAttestationRegistry(address(attestationRegistryMock));
    router.updatePortalRegistry(address(portalRegistryMock));

    pausablePortal = new PausablePortal(modules, address(router));

    vm.prank(portalOwner);
    portalRegistryMock.register(address(pausablePortal), "PausablePortal", "PausablePortal", true, "owner");
  }

  function test_setUp() public view {
    bool paused = pausablePortal.paused();
    assertFalse(paused);
  }

  function test_pause() public {
    bool paused = pausablePortal.paused();
    assertFalse(paused);

    vm.prank(address(this));
    pausablePortal.pause();

    paused = pausablePortal.paused();
    assertTrue(paused);
  }

  function test_unpause() public {
    bool paused = pausablePortal.paused();
    assertFalse(paused);

    vm.prank(address(this));
    pausablePortal.pause();

    paused = pausablePortal.paused();
    assertTrue(paused);

    vm.prank(address(this));
    pausablePortal.unpause();

    paused = pausablePortal.paused();
    assertFalse(paused);
  }

  function test_attest_unpaused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);
  }

  function test_attest_paused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.prank(address(this));
    pausablePortal.pause();

    vm.expectRevert("Pausable: paused");
    pausablePortal.attest(attestationPayload, validationPayload);
  }

  function test_bulkAttest_unpaused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    AttestationPayload[] memory attestationPayloads = new AttestationPayload[](2);
    attestationPayloads[0] = attestationPayload;
    attestationPayloads[1] = attestationPayload;

    bytes[] memory validationPayload = new bytes[](2);
    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload;
    validationPayloads[1] = validationPayload;

    vm.prank(address(0));
    vm.expectEmit(true, true, true, true);
    emit BulkAttestationsRegistered();
    pausablePortal.bulkAttest(attestationPayloads, validationPayloads);
  }

  function test_bulkAttest_paused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    AttestationPayload[] memory attestationPayloads = new AttestationPayload[](2);
    attestationPayloads[0] = attestationPayload;
    attestationPayloads[1] = attestationPayload;

    bytes[] memory validationPayload = new bytes[](2);
    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload;
    validationPayloads[1] = validationPayload;

    vm.prank(address(this));
    pausablePortal.pause();

    vm.expectRevert("Pausable: paused");
    pausablePortal.bulkAttest(attestationPayloads, validationPayloads);
  }

  function test_replace_unpaused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);

    vm.prank(portalOwner);
    vm.expectEmit(true, true, true, true);
    emit AttestationReplaced();
    pausablePortal.replace(bytes32(uint256(1)), attestationPayload, validationPayload);
  }

  function test_replace_paused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);

    vm.prank(address(this));
    pausablePortal.pause();

    vm.prank(portalOwner);
    vm.expectRevert("Pausable: paused");
    pausablePortal.replace(bytes32(uint256(1)), attestationPayload, validationPayload);
  }

  function test_replace_onlyPortalOwner() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);

    vm.prank(makeAddr("wrongOwner"));
    vm.expectRevert(AbstractPortalV2.OnlyPortalOwner.selector);
    pausablePortal.replace(bytes32(uint256(1)), attestationPayload, validationPayload);
  }

  function test_bulkReplace_unpaused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    AttestationPayload[] memory attestationPayloads = new AttestationPayload[](2);
    attestationPayloads[0] = attestationPayload;
    attestationPayloads[1] = attestationPayload;

    bytes[] memory validationPayload = new bytes[](2);
    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload;
    validationPayloads[1] = validationPayload;

    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = bytes32(uint256(1));
    attestationIds[1] = bytes32(uint256(2));

    vm.prank(portalOwner);
    vm.expectEmit(true, true, true, true);
    emit BulkAttestationsReplaced();
    pausablePortal.bulkReplace(attestationIds, attestationPayloads, validationPayloads);
  }

  function test_bulkReplace_paused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    AttestationPayload[] memory attestationPayloads = new AttestationPayload[](2);
    attestationPayloads[0] = attestationPayload;
    attestationPayloads[1] = attestationPayload;

    bytes[] memory validationPayload = new bytes[](2);
    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload;
    validationPayloads[1] = validationPayload;

    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = bytes32(uint256(1));
    attestationIds[1] = bytes32(uint256(2));

    vm.prank(address(this));
    pausablePortal.pause();

    vm.prank(portalOwner);
    vm.expectRevert("Pausable: paused");
    pausablePortal.bulkReplace(attestationIds, attestationPayloads, validationPayloads);
  }

  function test_bulkReplace_onlyPortalOwner() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    AttestationPayload[] memory attestationPayloads = new AttestationPayload[](2);
    attestationPayloads[0] = attestationPayload;
    attestationPayloads[1] = attestationPayload;

    bytes[] memory validationPayload = new bytes[](2);
    bytes[][] memory validationPayloads = new bytes[][](2);
    validationPayloads[0] = validationPayload;
    validationPayloads[1] = validationPayload;

    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = bytes32(uint256(1));
    attestationIds[1] = bytes32(uint256(2));

    vm.prank(makeAddr("wrongOwner"));
    vm.expectRevert(AbstractPortalV2.OnlyPortalOwner.selector);
    pausablePortal.bulkReplace(attestationIds, attestationPayloads, validationPayloads);
  }

  function test_revoke_unpaused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);

    vm.prank(portalOwner);
    vm.expectEmit(true, true, true, true);
    emit AttestationRevoked(bytes32(uint256(1)));
    pausablePortal.revoke(bytes32(uint256(1)));
  }

  function test_revoke_paused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);

    vm.prank(address(this));
    pausablePortal.pause();

    vm.prank(portalOwner);
    vm.expectRevert("Pausable: paused");
    pausablePortal.replace(bytes32(uint256(1)), attestationPayload, validationPayload);
  }

  function test_revoke_onlyPortalOwner() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);

    vm.prank(makeAddr("wrongOwner"));
    vm.expectRevert(AbstractPortalV2.OnlyPortalOwner.selector);
    pausablePortal.revoke(bytes32(uint256(1)));
  }

  function test_bulkRevoke_unpaused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);

    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = bytes32(uint256(1));
    attestationIds[1] = bytes32(uint256(2));

    vm.prank(portalOwner);
    vm.expectEmit(true, true, true, true);
    emit BulkAttestationsRevoked(attestationIds);
    pausablePortal.bulkRevoke(attestationIds);
  }

  function test_bulkRevoke_paused() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);

    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = bytes32(uint256(1));
    attestationIds[1] = bytes32(uint256(2));

    vm.prank(address(this));
    pausablePortal.pause();

    vm.prank(portalOwner);
    vm.expectRevert("Pausable: paused");
    pausablePortal.bulkRevoke(attestationIds);
  }

  function test_bulkRevoke_onlyPortalOwner() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1)),
      uint64(block.timestamp + 30 days),
      abi.encode(makeAddr("user")),
      new bytes(1)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);
    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    pausablePortal.attest(attestationPayload, validationPayload);

    bytes32[] memory attestationIds = new bytes32[](2);
    attestationIds[0] = bytes32(uint256(1));
    attestationIds[1] = bytes32(uint256(2));

    vm.prank(makeAddr("wrongOwner"));
    vm.expectRevert(AbstractPortalV2.OnlyPortalOwner.selector);
    pausablePortal.bulkRevoke(attestationIds);
  }

  function testSupportsInterface() public view {
    bool isIERC165Supported = pausablePortal.supportsInterface(type(IERC165).interfaceId);
    assertTrue(isIERC165Supported);
    bool isEASAbstractPortalV2Supported = pausablePortal.supportsInterface(type(AbstractPortalV2).interfaceId);
    assertTrue(isEASAbstractPortalV2Supported);
  }
}
