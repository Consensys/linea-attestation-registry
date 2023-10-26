// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { AbstractModule } from "../../src/interface/AbstractModule.sol";
import { MerkleProofModule } from "../../src/examples/modules/MerkleProofModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

contract MerkleProofModuleTest is Test {
  MerkleProofModule private merkleProofModule;

  event ModuleRegistered(string name, string description, address moduleAddress);

  function setUp() public {
    merkleProofModule = new MerkleProofModule();
  }

  function buildMerkleTree() private returns (bytes32[] memory) {
    bytes32[] memory hashes = new bytes32[](7);
    string[4] memory transactions = ["alice -> bob", "bob -> dave", "carol -> alice", "dave -> bob"];
    for (uint i = 0; i < transactions.length; i++) {
      hashes[i] = keccak256(abi.encodePacked(transactions[i]));
    }

    uint n = transactions.length;
    uint offset = 0;
    uint current = n;

    while (n > 0) {
      for (uint i = 0; i < n - 1; i += 2) {
        hashes[current] = keccak256(abi.encodePacked(hashes[offset + i], hashes[offset + i + 1]));
        current += 1;
      }
      offset += n;
      n = n / 2;
    }
    return hashes;
  }

  function test_MerkleProofModule_MerkleProofVerifySuccess() public {
    bytes32[] memory hashes = buildMerkleTree();
    // Replace by an invalid root node.
    hashes[hashes.length - 1] = bytes32("0");
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("1234"),
      0,
      abi.encode("attestee_id"),
      bytes.concat(hashes[2])
    );
    address user = makeAddr("user");
    bytes memory proofData = abi.encode(hashes);
    vm.expectRevert(MerkleProofModule.MerkelProofVerifyFailed.selector);
    merkleProofModule.run(attestationPayload, proofData, user, 0);
  }

  function test_MerkleProofModule_MerkleProofInvalidation() public {
    bytes32[] memory hashes = buildMerkleTree();
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("1234"),
      0,
      abi.encode("attestee_id"),
      bytes.concat(hashes[2])
    );
    address user = makeAddr("user");
    bytes memory proofData = abi.encode(hashes);
    merkleProofModule.run(attestationPayload, proofData, user, 0);
  }

  function test_MerkleProofModule_supportsInterface() public {
    bool isAbstractModuleSupported = merkleProofModule.supportsInterface(type(AbstractModule).interfaceId);
    assertEq(isAbstractModuleSupported, true);
  }
}
