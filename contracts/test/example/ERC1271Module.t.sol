// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { AbstractModule } from "../../src/interface/AbstractModule.sol";
import { ERC1271Module } from "../../src/examples/modules/ERC1271Module.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

contract ERC1271ModuleTest is Test {
  ERC1271Module private erc1271Module;
  uint256 internal signerPrivateKey;
  address internal signerAddress;

  event ModuleRegistered(string name, string description, address moduleAddress);

  function setUp() public {
    (signerAddress, signerPrivateKey) = makeAddrAndKey("veraxUser");
    erc1271Module = new ERC1271Module(signerAddress);
    vm.deal(signerAddress, 1 ether);
  }

  function test_ERC1271Module_verifySignature() public {
    address user = makeAddr("user");
    uint256 nonce = 1234567;
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32(uint256(1234)),
      0,
      abi.encode(user),
      abi.encode(nonce)
    );

    bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", abi.encodePacked(user, nonce)));
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPrivateKey, hash);

    bytes memory signature = abi.encodePacked(r, s, v);

    erc1271Module.run(attestationPayload, signature, signerAddress, 0);
  }

  function test_EcRecoverModule_supportsInterface() public {
    bool isAbstractModuleSupported = erc1271Module.supportsInterface(type(AbstractModule).interfaceId);
    assertEq(isAbstractModuleSupported, true);
  }
}
