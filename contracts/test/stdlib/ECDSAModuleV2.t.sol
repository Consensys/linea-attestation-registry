// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import { ECDSAModuleV2, AbstractModuleV2 } from "../../src/stdlib/ECDSAModuleV2.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { PortalRegistryMock } from "../mocks/PortalRegistryMock.sol";

contract ECDSAModuleV2Test is Test {
  using ECDSA for bytes32;

  ECDSAModuleV2 private ecdsaModule;
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
    authorizationStatus[1] = true;

    vm.startPrank(portalOwner);
    // add portal to mock registry
    portalRegistry = new PortalRegistryMock();
    portalRegistry.register(address(portal), "portal", "portal", false, "portal");

    ecdsaModule = new ECDSAModuleV2(address(portalRegistry));
    vm.stopPrank();
  }

  function test_setAuthorizedSigners() public {
    vm.prank(portalOwner);
    vm.expectEmit({ emitter: address(ecdsaModule) });
    emit SignersAuthorized(portal, signers, authorizationStatus);
    ecdsaModule.setAuthorizedSigners(address(portal), signers, authorizationStatus);
  }

  function test_setAuthorizedSigners_OnlyPortalOwner() public {
    vm.prank(user);
    vm.expectRevert(AbstractModuleV2.OnlyPortalOwner.selector);
    ecdsaModule.setAuthorizedSigners(address(portal), signers, authorizationStatus);
  }

  function test_setAuthorizedSigners_ArrayLengthMismatch() public {
    vm.prank(portalOwner);
    vm.expectRevert(ECDSAModuleV2.ArrayLengthMismatch.selector);
    ecdsaModule.setAuthorizedSigners(address(portal), signers, new bool[](1));
  }

  function test_run() public {
    vm.prank(portalOwner);
    ecdsaModule.setAuthorizedSigners(address(portal), signers, authorizationStatus);

    AttestationPayload memory aPayload = AttestationPayload(bytes32("1"), 0, bytes(""), bytes(""));
    bytes memory validationPayload = makeSignature(signerPk1, aPayload);

    vm.prank(portal);
    ecdsaModule.run(aPayload, validationPayload, signer1, 0, address(makeAddr("attester")), portal);
  }

  function test_run_SignerNotAuthorized() public {
    AttestationPayload memory aPayload = AttestationPayload(bytes32("1"), 0, bytes(""), bytes(""));
    bytes memory validationPayload = makeSignature(signerPk1, aPayload);

    vm.prank(portal);
    vm.expectRevert(ECDSAModuleV2.SignerNotAuthorized.selector);
    ecdsaModule.run(aPayload, validationPayload, signer1, 0, address(makeAddr("attester")), portal);
  }

  function makeSignature(uint256 signerPk, AttestationPayload memory payload) private pure returns (bytes memory) {
    bytes32 messageHash = keccak256(abi.encode(payload)).toEthSignedMessageHash();
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, messageHash);
    return abi.encodePacked(r, s, v);
  }
}
