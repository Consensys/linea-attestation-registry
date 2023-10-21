// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { ECDSA } from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";

import { ECDSAModule } from "../../src/examples/modules/ECDSAModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

contract ECDSAModuleTest is Test {
  ECDSAModule private ecdsaModule;
  address private signer;
  uint256 private signerPk;

  function setUp() public {
    (signer, signerPk) = makeAddrAndKey("veraxUser");
    ecdsaModule = new ECDSAModule(signer, signer);

    vm.deal(signer, 1 ether);
  }

  function test_ECDSAModule_validSignature() public {
    address user = makeAddr("user");
    uint256 nonce = 1234567;
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1234)),
      0,
      abi.encode(user),
      abi.encode(nonce)
    );

    bytes32 hash = ECDSA.toEthSignedMessageHash(abi.encodePacked(user, nonce));

    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, hash);
    bytes memory signature = abi.encodePacked(r, s, v);

    ecdsaModule.run(attestationPayload, signature, signer, 0);
  }

  function test_ECDSAModule_revertInvalidSignature() public {
    (address user, uint256 fakeKey) = makeAddrAndKey("user");
    uint256 nonce = 1234567;
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1234)),
      0,
      abi.encode(user),
      abi.encode(nonce)
    );

    bytes32 hash = ECDSA.toEthSignedMessageHash(abi.encodePacked(user, nonce));
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(fakeKey, hash);
    bytes memory signature = abi.encodePacked(r, s, v);

    vm.expectRevert("Wrong signature");
    ecdsaModule.run(attestationPayload, signature, user, 0);
  }

  function test_ECDSAModule_revertNonceUsed() public {
    address user = makeAddr("user");
    uint256 nonce = 1234567;
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1234)),
      0,
      abi.encode(user),
      abi.encode(nonce)
    );

    bytes32 hash = ECDSA.toEthSignedMessageHash(abi.encodePacked(user, nonce));
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, hash);
    bytes memory signature = abi.encodePacked(r, s, v);

    ecdsaModule.run(attestationPayload, signature, user, 0);
    vm.expectRevert("Nonce already used");
    ecdsaModule.run(attestationPayload, signature, user, 0);
  }
}
