// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import { AbstractModule } from "../../interface/AbstractModule.sol";
import { AttestationPayload } from "../../types/Structs.sol";
import { Delegatable } from "delegatable-sol/Delegatable.sol";
import { SignedDelegation, Caveat, Delegation } from "delegatable-sol/TypesAndDecoders.sol";

contract DelegatableModule is AbstractModule, Delegatable {
  error InvalidSignature();

  constructor(string memory name, string memory version, address issuer) Delegatable(name, version) {}

  function run(
    AttestationPayload memory attestationPayload,
    bytes memory validationPayload,
    address /*txSender*/,
    uint256 /*value*/
  ) public view override {
    (address mainIssuer, bytes32 authority, Caveat[] memory caveats, bytes memory signature) = abi.decode(
      validationPayload,
      (address, bytes32, Caveat[], bytes)
    );
    Delegation memory delegation = Delegation({ delegate: mainIssuer, authority: authority, caveats: caveats });
    SignedDelegation memory signedDelegation = SignedDelegation({ delegation: delegation, signature: signature });
    address signer = verifyDelegationSignature(signedDelegation);
    if (signer != mainIssuer) {
      revert InvalidSignature();
    }
  }
}
