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
  AttestationPayload private attestationPayload;

  address private user = makeAddr("veraxUser");
  uint256 private nonce = 1234567;

  function setUp() public {
    (signer, signerPk) = makeAddrAndKey("veraxSigner");
    ecdsaModule = new ECDSAModule(signer);

    attestationPayload = AttestationPayload(bytes32(uint256(1234)), 0, abi.encode(user), abi.encode(nonce));
  }

  function test_ECDSAModule_validSignature() public {
    bytes memory signature = makeSignature(signerPk);

    ecdsaModule.run(attestationPayload, signature, signer, 0);
  }

  function test_ECDSAModule_revertInvalidSignature() public {
    Account memory fakeSigner = makeAccount("user");

    bytes memory signature = makeSignature(fakeSigner.key);

    vm.expectRevert("Wrong signature");
    ecdsaModule.run(attestationPayload, signature, user, 0);
  }

  function test_ECDSAModule_revertNonceUsed() public {
    bytes memory signature = makeSignature(signerPk);

    ecdsaModule.run(attestationPayload, signature, user, 0);
    vm.expectRevert("Nonce already used");
    ecdsaModule.run(attestationPayload, signature, user, 0);
  }

  function makeSignature(uint256 _signer) private view returns (bytes memory) {
    bytes32 hash = ECDSA.toEthSignedMessageHash(abi.encodePacked(user, nonce));

    (uint8 v, bytes32 r, bytes32 s) = vm.sign(_signer, hash);
    return abi.encodePacked(r, s, v);
  }
}
