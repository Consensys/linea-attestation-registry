// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { ECDSA } from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";

import { ERC1271Module, AbstractModule } from "../../src/stdlib/ERC1271Module.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";

contract ERC1271ModuleTest is Test {
  using ECDSA for bytes32;

  ERC1271Module private erc1271Module;
  address private signer1;
  uint256 private signerPk1;
  address private signer2;
  uint256 private signerPk2;
  address private portal = makeAddr("portal");
  AttestationPayload private attestationPayload;
  PortalRegistryMock private portalRegistry;

  address private portalOwner = makeAddr("portalOwner");
  address private user = makeAddr("user");
  uint256 private nonce = 1234567;

  address[] private signers = new address[](2);
  bool[] private authorizationStatus = new bool[](2);

  event SignersAuthorized(address indexed portal, address[] signers, bool[] authorizationStatus);

  function setUp() public {
    (signer1, signerPk1) = makeAddrAndKey("signer1");
    (signer2, signerPk2) = makeAddrAndKey("signer2");

    signers[0] = signer1;
    signers[1] = signer2;

    authorizationStatus[0] = true;
    authorizationStatus[1] = false;

    vm.startPrank(portalOwner);
    // add portal to mock registry
    portalRegistry = new PortalRegistryMock();
    portalRegistry.register(address(portal), "portal", "portal", false, "portal");

    erc1271Module = new ERC1271Module(address(portalRegistry));
    vm.stopPrank();
  }

  function test_setAuthorizedSigners() public {
    vm.prank(portalOwner);
    vm.expectEmit({ emitter: address(erc1271Module) });
    emit SignersAuthorized(portal, signers, authorizationStatus);
    erc1271Module.setAuthorizedSigners(address(portal), signers, authorizationStatus);
  }

  function test_setAuthorizedSigners_OnlyPortalOwner() public {
    vm.prank(user);
    vm.expectRevert(AbstractModule.OnlyPortalOwner.selector);
    erc1271Module.setAuthorizedSigners(address(portal), signers, authorizationStatus);
  }

  function test_setAuthorizedSigners_ArrayLengthMismatch() public {
    vm.prank(portalOwner);
    vm.expectRevert(ERC1271Module.ArrayLengthMismatch.selector);
    erc1271Module.setAuthorizedSigners(address(portal), signers, new bool[](1));
  }

  function test_run() public {
    vm.prank(portalOwner);
    erc1271Module.setAuthorizedSigners(portal, signers, authorizationStatus);
    attestationPayload = AttestationPayload(bytes32(uint256(1234)), 0, abi.encode(user), "");

    bytes32 hash = createMessageHash(attestationPayload);
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk1, hash);

    bytes memory signature = abi.encodePacked(r, s, v);

    vm.prank(portal);
    erc1271Module.run(attestationPayload, signature, signer1, 0);
  }

  function test_run_SignerNotAuthorized() public {
    vm.prank(portalOwner);
    erc1271Module.setAuthorizedSigners(portal, signers, authorizationStatus);
    attestationPayload = AttestationPayload(bytes32(uint256(1234)), 0, abi.encode(user), "");

    bytes32 hash = createMessageHash(attestationPayload);
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk2, hash);

    bytes memory signature = abi.encodePacked(r, s, v);

    vm.prank(portal);
    vm.expectRevert(ERC1271Module.SignerNotAuthorized.selector);
    erc1271Module.run(attestationPayload, signature, signer2, 0);
  }

  function createMessageHash(AttestationPayload memory payload) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", keccak256(abi.encode(payload))));
  }
}
