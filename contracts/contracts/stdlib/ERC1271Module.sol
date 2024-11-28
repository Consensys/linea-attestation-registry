// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { AbstractModule } from "../abstracts/AbstractModule.sol";
import { PortalRegistry } from "../PortalRegistry.sol";
import { AttestationPayload } from "../types/Structs.sol";

interface ERC1271 {
  function isValidSignature(bytes32 _hash, bytes memory _signature) external view returns (bytes4 magicValue);
}

contract ERC1271Module is ERC1271, AbstractModule {
  bytes4 internal constant MAGIC_VALUE = 0x1626ba7e;
  bytes4 internal constant INVALID_SIGNATURE = 0xffffffff;

  PortalRegistry public portalRegistry;

  mapping(address portal => mapping(address signer => bool authorizedSigners)) public authorizedSigners;

  /// @notice Error thrown when an array length mismatch occurs
  error ArrayLengthMismatch();
  /// @notice Error thrown when a signer is not authorized by the module
  error SignerNotAuthorized();
  /// @notice Error thrown when a signature length is not the expected one
  error InvalidSignatureLength();
  /// @notice Error thrown when a signature is invalid, with a message to explain what is invalid
  error InvalidSignature(string msg);

  modifier onlyPortalOwner(address portal) {
    if (msg.sender != portalRegistry.getPortalOwner(portal)) revert OnlyPortalOwner();
    _;
  }

  event SignersAuthorized(address indexed portal, address[] signers, bool[] authorizationStatus);

  /**
   * @notice Contract constructor sets the portal registry
   */
  constructor(address _portalRegistry) {
    portalRegistry = PortalRegistry(_portalRegistry);
  }

  /**
   * @notice Set the accepted status of schemaIds
   * @param signers The signers to be set
   * @param authorizationStatus The authorization status of signers
   */
  function setAuthorizedSigners(
    address portal,
    address[] memory signers,
    bool[] memory authorizationStatus
  ) public onlyPortalOwner(portal) {
    if (signers.length != authorizationStatus.length) revert ArrayLengthMismatch();

    for (uint256 i = 0; i < signers.length; i++) {
      authorizedSigners[portal][signers[i]] = authorizationStatus[i];
    }

    emit SignersAuthorized(portal, signers, authorizationStatus);
  }

  function run(
    AttestationPayload memory attestationPayload,
    bytes memory validationPayload,
    address /*txSender*/,
    uint256 /*value*/
  ) public view override {
    bytes32 messageHash = keccak256(abi.encode(attestationPayload));
    if (isValidSignature(messageHash, validationPayload) != MAGIC_VALUE) {
      revert SignerNotAuthorized();
    }
  }

  function isValidSignature(bytes32 _hash, bytes memory _signature) public view override returns (bytes4 magicValue) {
    bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash));
    address signer = recoverSigner(messageHash, _signature);
    if (authorizedSigners[msg.sender][signer]) {
      return MAGIC_VALUE;
    } else {
      return INVALID_SIGNATURE;
    }
  }

  /**
   * @notice Recover the signer of hash, assuming it's an EOA account
   * @dev Only for EthSign signatures
   * @param _hash       Hash of message that was signed
   * @param _signature  Signature encoded as (bytes32 r, bytes32 s, uint8 v)
   */
  function recoverSigner(bytes32 _hash, bytes memory _signature) internal pure returns (address signer) {
    if (_signature.length != 65) {
      revert InvalidSignatureLength();
    }

    bytes32 r;
    bytes32 s;
    uint8 v;

    // solhint-disable no-inline-assembly
    assembly {
      r := mload(add(_signature, 0x20))
      s := mload(add(_signature, 0x40))
      v := byte(0, mload(add(_signature, 0x60)))
    }

    if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
      revert InvalidSignature("Invalid signature 's' value");
    }

    if (v != 27 && v != 28) {
      revert InvalidSignature("Invalid signature 'v' value");
    }

    signer = ecrecover(_hash, v, r, s);
    // Prevent signer from being 0x0
    if (signer == address(0x0)) {
      revert InvalidSignature("Invalid signer");
    }
    return signer;
  }
}
