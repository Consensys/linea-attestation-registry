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

  error InvalidSignature();

  constructor(EIP712Domain memory _domain) {
    domain = _domain;
  }

  function run(
    AttestationPayload memory attestationPayload,
    bytes memory validationPayload,
    address txSender,
    uint256 /*value*/
  ) public view override {
    (uint8 v, bytes32 r, bytes32 s) = abi.decode(validationPayload, (uint8, bytes32, bytes32));

    address signer = ecrecover(bytes32(attestationPayload.attestationData), v, r, s);
    if (signer != txSender) {
      revert InvalidSignature();
    }
  }
}
