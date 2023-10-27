// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { AbstractModule } from "../../src/interface/AbstractModule.sol";
import { EIP712Domain, ERC712Module } from "../../src/examples/modules/ERC712Module.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

contract ERC712ModuleTest is Test {
  ERC712Module private erc712Module;
  address private signer;
  uint256 private signerPk;
  bytes32 eip712DomainHash;

  event ModuleRegistered(string name, string description, address moduleAddress);

  function setUp() public {
    (signer, signerPk) = makeAddrAndKey("veraxSigner");
    address contractAddress = makeAddr("contract");
    EIP712Domain memory domain = EIP712Domain({
      name: "tester",
      version: "1.0",
      chainId: uint256(1234),
      verifyingContract: contractAddress
    });
    erc712Module = new ERC712Module(domain);

    eip712DomainHash = keccak256(
      abi.encode(
        keccak256(bytes(domain.name)),
        keccak256(bytes(domain.version)),
        domain.chainId,
        domain.verifyingContract
      )
    );

    vm.deal(contractAddress, 1 ether);
  }

  function test_ERC712Module_verifySuccess() public {
    address receiver = makeAddr("receiver");

    bytes32 hashStruct = keccak256(abi.encode(signer, receiver, uint256(1234)));
    bytes32 hash = keccak256(abi.encodePacked("\x19\x01", eip712DomainHash, hashStruct));

    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, hash);
    bytes memory signature = abi.encode(v, r, s);

    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("12345678"),
      0,
      abi.encode(signer),
      abi.encode(hash)
    );
    erc712Module.run(attestationPayload, signature, signer, 0);
  }

  function test_ERC712Module_invalidSignature() public {
    address receiver = makeAddr("receiver");

    bytes32 hash = keccak256(abi.encode(signer, receiver, uint256(1234)));

    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, hash);
    bytes memory signature = abi.encode(v, r, s);

    address not_signer = makeAddr("not_origin_signer");
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("12345678"),
      0,
      abi.encode(not_signer),
      abi.encode(hash)
    );
    vm.expectRevert(ERC712Module.InvalidSignature.selector);
    erc712Module.run(attestationPayload, signature, not_signer, 0);
  }

  function test_ERC712Module_supportsInterface() public {
    bool isAbstractModuleSupported = erc712Module.supportsInterface(type(AbstractModule).interfaceId);
    assertEq(isAbstractModuleSupported, true);
  }
}