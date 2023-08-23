// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Initializable } from "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";
import { AttestationRegistry } from "../AttestationRegistry.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { SchemaRegistry } from "../SchemaRegistry.sol";
import { AbstractPortal } from "../interface/AbstractPortal.sol";
import { Attestation, AttestationPayload, Portal } from "../types/Structs.sol";

/**
 * @title Default Portal
 * @author Consensys
 * @notice This contract aims to provide a default portal
 */
contract DefaultPortal is Initializable, AbstractPortal, IERC165 {
  address[] public modules;
  ModuleRegistry public moduleRegistry;
  AttestationRegistry public attestationRegistry;
  SchemaRegistry public schemaRegistry;

  /// @notice Error thown when attempting to initialize the default portal twice
  error PortalAlreadyInitialized();
  /// @notice Error thrown when a schema is not registered in the SchemaRegistry
  error SchemaNotRegistered();
  /// @notice Error thrown when an attempt is made to register an attestation with an empty subject field
  error EmptyAttestationSubjectField();
  /// @notice Error thrown when an attempt is made to register an attestation with an empty data field
  error DataAttestationFieldEmpty();

  /**
   * @notice Contract initialization
   */
  function initialize(
    address[] calldata _modules,
    address _moduleRegistry,
    address _attestationRegistry,
    address _schemaRegistry
  ) public initializer {
    // Store module registry and attestation registry addresses and modules
    attestationRegistry = AttestationRegistry(_attestationRegistry);
    moduleRegistry = ModuleRegistry(_moduleRegistry);
    schemaRegistry = SchemaRegistry(_schemaRegistry);
    modules = _modules;
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
  function attest(
    AttestationPayload memory attestationPayload,
    bytes[] memory validationPayload
  ) external payable override {
    moduleRegistry.runModules(modules, validationPayload);

    // verify the schema id exists
    if (!schemaRegistry.isRegistered(attestationPayload.schemaId)) revert SchemaNotRegistered();

    // the subject field is not blank (or is of minimum length - 8 bytes?)
    if (attestationPayload.subject.length == 0) revert EmptyAttestationSubjectField();

    // the attestationData field is not blank
    if (attestationPayload.attestationData.length == 0) revert DataAttestationFieldEmpty();

    // uint256 attestationCount = attestationRegistry.attestationCount();
    // uint16 version = attestationRegistry.getVersionNumber();

    uint256 attestationCount = 0;
    uint16 version = 0;

    Attestation memory attestation = Attestation({
      attestationId: bytes32(attestationCount + 1),
      schemaId: attestationPayload.schemaId,
      attester: msg.sender,
      portal: address(this),
      subject: attestationPayload.subject,
      attestedDate: block.timestamp,
      expirationDate: attestationPayload.expirationDate,
      revoked: false,
      version: version,
      attestationData: attestationPayload.attestationData
    });

    attestationRegistry.attest(attestation);
  }

  /**
   * @notice Implements supports interface method declaring it is an AbstractPortal
   */
  function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
    return interfaceID == type(AbstractPortal).interfaceId || interfaceID == type(IERC165).interfaceId;
  }
}
