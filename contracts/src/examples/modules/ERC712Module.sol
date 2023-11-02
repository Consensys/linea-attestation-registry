// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../../interface/AbstractModule.sol";
import { AttestationPayload } from "../../types/Structs.sol";

/**
 * @notice Definition of EIP-712 domain
 */
struct EIP712Domain {
  string name;
  string version;
  uint256 chainId;
  address verifyingContract;
}

contract ERC712Module is AbstractModule {
  EIP712Domain public domain;
  address sender;
  address receiver;

  error InvalidSignature();

  constructor(EIP712Domain memory _domain, address _sender, address _receiver) {
    domain = _domain;
    sender = _sender;
    receiver = _receiver;
  }

  function run(
    AttestationPayload memory attestationPayload,
    bytes memory validationPayload,
    address txSender,
    uint256 /*value*/
  ) public view override {
    (uint8 v, bytes32 r, bytes32 s) = abi.decode(validationPayload, (uint8, bytes32, bytes32));

    bytes32 DOMAIN_TYPE_HASH = keccak256(
      "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );
    bytes32 domainHash = keccak256(
      abi.encode(
        DOMAIN_TYPE_HASH,
        keccak256(bytes(domain.name)),
        keccak256(bytes(domain.version)),
        domain.chainId,
        domain.verifyingContract
      )
    );
    bytes32 TXN_TYPE_HASH = keccak256("Transaction(address from,address to,uint256 value)");
    bytes32 structHash = keccak256(abi.encode(TXN_TYPE_HASH, sender, receiver, uint256(1234)));
    bytes32 hash = keccak256(abi.encodePacked("\x19\x01", domainHash, structHash));

    address signer = ecrecover(hash, v, r, s);
    if (signer != txSender) {
      revert InvalidSignature();
    }
  }
}
