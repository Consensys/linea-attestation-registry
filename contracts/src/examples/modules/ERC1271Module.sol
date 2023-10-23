// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../interface/AbstractModule.sol";
import { AttestationPayload } from "../types/Structs.sol";

contract ERC1271Module is AbstractModule {
  address public owner;

  constructor(address _owner) {
    owner = _owner;
  }

  /**
   * @notice Recover the signer of hash, assuming it's an EOA account
   * @dev Only for EthSign signatures
   * @param _hash       Hash of message that was signed
   * @param _signature  Signature encoded as (bytes32 r, bytes32 s, uint8 v)
   */
  function recoverSigner(bytes32 _hash, bytes memory _signature) internal pure returns (address signer) {
    require(_signature.length == 65, "Invalid signature length");
    bytes32 r;
    bytes32 s;
    uint8 v;
    assembly {
      r := mload(add(_signature, 0x20))
      s := mload(add(_signature, 0x40))
      v := byte(0, mload(add(_signature, 0x60)))
    }
    if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
      revert("SignatureValidator#recoverSigner: invalid signature 's' value");
    }
    if (v != 27 && v != 28) {
      revert("SignatureValidator#recoverSigner: invalid signature 'v' value");
    }

    signer = ecrecover(_hash, v, r, s);
    // Prevent signer from being 0x0
    require(signer != address(0x0), "SignatureValidator#recoverSigner: INVALID_SIGNER");
    return signer;
  }

  /**
   * @notice Verifies that the signer is the owner of the signing contract.
   */
  function isValidSignature(bytes32 _hash, bytes memory _signature) internal view returns (bytes4) {
    // Validate signatures
    address signer = recoverSigner(_hash, _signature);
    if (signer == owner) {
      return 0x1626ba7e;
    } else {
      return 0xffffffff;
    }
  }

  function run(
    AttestationPayload memory attestationPayload,
    bytes memory validationPayload,
    address txSender,
    uint256 /*value*/
  ) public view override {
    require(txSender == owner, "Invalid sender");
    address signee = abi.decode(attestationPayload.subject, (address));
    uint256 nonce = abi.decode(attestationPayload.attestationData, (uint256));
    bytes memory message = abi.encodePacked(signee, nonce);
    bytes32 digest = keccak256(bytes.concat("\x19Ethereum Signed Message:\n", message));
    require(
      isValidSignature(digest, validationPayload) == 0x1626ba7e,
      "SignatureValidator#isValidSignature: INVALID_SIGNER"
    );
  }
}
