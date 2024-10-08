// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { ERC712ModuleV2, EIP712Domain, AbstractModuleV2 } from "../../../src/examples/modules/ERC712ModuleV2.sol";
import { OperationType } from "../../../src/types/Enums.sol";
import { AttestationPayload } from "../../../src/types/Structs.sol";

contract ERC712ModuleV2Test is Test {
  ERC712ModuleV2 private erc712Module;
  address private signer;
  uint256 private signerPk;
  address private receiver;
  bytes32 private eip712DomainHash;
  bytes32 private constant DOMAIN_TYPE_HASH =
    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
  bytes32 private constant TXN_TYPE_HASH = keccak256("Transaction(address from,address to,uint256 value)");

  event ModuleRegistered(string name, string description, address moduleAddress);

  function setUp() public {
    (signer, signerPk) = makeAddrAndKey("veraxSigner");
    address contractAddress = makeAddr("contract");
    receiver = makeAddr("receiver");
    EIP712Domain memory domain = EIP712Domain({
      name: "tester",
      version: "1.0",
      chainId: uint256(1234),
      verifyingContract: contractAddress
    });
    erc712Module = new ERC712ModuleV2(domain, signer, receiver);

    eip712DomainHash = keccak256(
      abi.encode(
        DOMAIN_TYPE_HASH,
        keccak256(bytes(domain.name)),
        keccak256(bytes(domain.version)),
        domain.chainId,
        domain.verifyingContract
      )
    );

    vm.deal(contractAddress, 1 ether);
  }

  function test_ERC712Module_verifySuccess() public {
    bytes32 hashStruct = keccak256(abi.encode(TXN_TYPE_HASH, signer, receiver, uint256(1234)));
    bytes32 hash = keccak256(abi.encodePacked("\x19\x01", eip712DomainHash, hashStruct));

    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, hash);
    bytes memory signature = abi.encode(v, r, s);

    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("12345678"),
      0,
      bytes("subject"),
      abi.encode(hash)
    );
    erc712Module.run(
      attestationPayload,
      signature,
      signer,
      0,
      address(makeAddr("attester")),
      address(makeAddr("portal")),
      OperationType.Attest
    );
  }

  function test_ERC712Module_invalidSignature() public {
    bytes32 hash = keccak256(abi.encode(signer, receiver, uint256(1234)));

    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, hash);
    bytes memory signature = abi.encode(v, r, s);

    address not_signer = makeAddr("not_origin_signer");
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("12345678"),
      0,
      bytes("subject"),
      abi.encode(hash)
    );
    vm.expectRevert(ERC712ModuleV2.InvalidSignature.selector);
    erc712Module.run(
      attestationPayload,
      signature,
      not_signer,
      0,
      address(makeAddr("attester")),
      address(makeAddr("portal")),
      OperationType.Attest
    );
  }

  function test_ERC712Module_invalidSignatureByWrongHash() public {
    bytes32 hash = keccak256(abi.encode(signer, receiver, uint256(1234)));

    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, hash);
    bytes memory signature = abi.encode(v, r, s);

    address not_signer = makeAddr("not_origin_signer");
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("12345678"),
      0,
      bytes("subject"),
      abi.encode(bytes32("0000"))
    );
    vm.expectRevert(ERC712ModuleV2.InvalidSignature.selector);
    erc712Module.run(
      attestationPayload,
      signature,
      not_signer,
      0,
      address(makeAddr("attester")),
      address(makeAddr("portal")),
      OperationType.Attest
    );
  }

  function test_ERC712Module_supportsInterface() public view {
    bool isAbstractModuleSupported = erc712Module.supportsInterface(type(AbstractModuleV2).interfaceId);
    assertEq(isAbstractModuleSupported, true);
  }
}
