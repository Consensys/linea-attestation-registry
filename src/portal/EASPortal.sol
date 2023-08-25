// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Initializable } from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
// solhint-disable-next-line max-line-length
import { IERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165Upgradeable.sol";
import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { SchemaRegistry } from "../SchemaRegistry.sol";
import { Attestation, AttestationPayload, Portal } from "../types/Structs.sol";

struct AttestationRequestData {
  address recipient;
  uint64 expirationTime;
  bool revocable;
  bytes32 refUID;
  bytes data;
  uint256 value;
}

struct AttestationRequest {
  bytes32 schema;
  AttestationRequestData data;
}

abstract contract EASAbstractPortal {
  function attest(AttestationRequest memory attestationRequest) external payable virtual;
}

/**
 * @title EAS Portal
 * @author Consensys
 * @notice This contract aims to integrate with dapps that are already integrated with EAS
 */
contract EASPortal is Initializable, EASAbstractPortal, IERC165Upgradeable {
  AttestationRegistry public attestationRegistry;

  /**
   * @notice Contract initialization
   */
  function initialize(address _attestationRegistry) public initializer {
    // Store registries addresses
    attestationRegistry = AttestationRegistry(_attestationRegistry);
  }

  /**
   * @notice attest the schema with given attestationPayload and validationPayload
   * @dev Runs all modules for the portal and stores the attestation in AttestationRegistry
   */
  function attest(AttestationRequest memory attestationRequest) external payable override {
    AttestationRequestData memory attestationRequestData = attestationRequest.data;

    AttestationPayload memory attestationPayload = AttestationPayload(
      attestationRequest.schema,
      abi.encodePacked(attestationRequestData.recipient),
      uint256(attestationRequestData.expirationTime),
      attestationRequestData.data
    );

    attestationRegistry.attest(attestationPayload);
  }

  /**
   * @notice Implements supports interface method declaring it is an EASAbstractPortal
   */
  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(EASAbstractPortal).interfaceId || interfaceID == type(IERC165Upgradeable).interfaceId;
  }
}
