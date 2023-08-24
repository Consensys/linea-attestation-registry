// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Initializable } from "openzeppelin-contracts-upgradeable/contracts/proxy/utils/Initializable.sol";
// solhint-disable-next-line max-line-length
import { IERC165Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165Upgradeable.sol";
import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { SchemaRegistry } from "../SchemaRegistry.sol";
import { EASAbstractPortal } from "../interface/EASAbstractPortal.sol";
import { Attestation, AttestationPayload, AttestationRequest, AttestationRequestData, Portal } from "../types/Structs.sol";

/**
 * @title EAS Portal
 * @author Consensys
 * @notice This contract aims to integrate with dapps that are already integrated with EAS
 */
contract EASPortal is Initializable, EASAbstractPortal, IERC165Upgradeable {
  address[] public modules;
  bytes32 public schemaId;
  ModuleRegistry public moduleRegistry;
  AttestationRegistry public attestationRegistry;
  SchemaRegistry public schemaRegistry;

  /**
   * @notice Contract initialization
   */
  function initialize(
    address[] calldata _modules,
    bytes32 _schemaId,
    address _moduleRegistry,
    address _attestationRegistry,
    address _schemaRegistry
  ) public initializer {
    // Store registries addresses and modules
    attestationRegistry = AttestationRegistry(_attestationRegistry);
    moduleRegistry = ModuleRegistry(_moduleRegistry);
    schemaRegistry = SchemaRegistry(_schemaRegistry);
    modules = _modules;
    schemaId = _schemaId;
  }

  /**
   * @notice Get all modules from the default portal clone
   * @return The Modules
   */
  function getModules() external view override returns (address[] memory) {
    return modules;
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

    attestationRegistry.attest(attestationPayload, msg.sender);
  }

  /**
   * @notice Implements supports interface method declaring it is an EASAbstractPortal
   */
  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(EASAbstractPortal).interfaceId || interfaceID == type(IERC165Upgradeable).interfaceId;
  }
}
