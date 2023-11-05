// SPDX-License-Identifier: MIT
pragma solidity <0.9.0;

import { Test } from "forge-std/Test.sol";
import { AbstractModule } from "../../src/interface/AbstractModule.sol";
import { DelegatableModule } from "../../src/examples/modules/DelegatableModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { EIP712Decoder, SignedDelegation, Delegation } from "delegatable-sol/TypesAndDecoders.sol";
import { Caveat, DELEGATION_TYPEHASH, EIP712DOMAIN_TYPEHASH } from "delegatable-sol/TypesAndDecoders.sol";

contract DelegatableModuleTest is Test {
  DelegatableModule private delegatableModule;
  address private signer;
  uint256 private signerPk;
  bytes32 private domainHash;

  event ModuleRegistered(string name, string description, address moduleAddress);

  function setUp() public {
    (signer, signerPk) = makeAddrAndKey("Issuer");
    delegatableModule = new DelegatableModule("test-contract", "123", signer);
    domainHash = keccak256(
      abi.encode(
        EIP712DOMAIN_TYPEHASH,
        keccak256(bytes("test-contract")),
        keccak256(bytes("123")),
        block.chainid,
        address(delegatableModule)
      )
    );
  }

  function test_DelegatableModule_verifySuccess() public {
    Caveat[] memory caveats = new Caveat[](2);
    caveats[0] = Caveat({ enforcer: makeAddr("enforcer"), terms: bytes("0") });
    Delegation memory delegation = Delegation({ delegate: signer, authority: bytes32(bytes("0")), caveats: caveats });

    EIP712Decoder eip712Decoder = new EIP712Decoder();
    bytes32 hash = keccak256(
      abi.encodePacked(
        "\x19\x01",
        domainHash,
        keccak256(
          abi.encode(
            DELEGATION_TYPEHASH,
            delegation.delegate,
            delegation.authority,
            eip712Decoder.GET_CAVEAT_ARRAY_PACKETHASH(delegation.caveats)
          )
        )
      )
    );
    (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, hash);
    bytes memory signature = abi.encodePacked(r, s, v);

    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("12345678"),
      0,
      bytes("subject"),
      abi.encode(hash)
    );
    delegatableModule.run(
      attestationPayload,
      abi.encode(delegation.delegate, delegation.authority, caveats, signature),
      signer,
      uint256(0)
    );
  }

  function test_DelegatableModule_supportsInterface() public {
    bool isAbstractModuleSupported = delegatableModule.supportsInterface(type(AbstractModule).interfaceId);
    assertEq(isAbstractModuleSupported, true);
  }
}
