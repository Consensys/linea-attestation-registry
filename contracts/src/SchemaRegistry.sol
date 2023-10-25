// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import { Schema } from "./types/Structs.sol";
import { PortalRegistry } from "./PortalRegistry.sol";
import { IRouter } from "./interface/IRouter.sol";

/**
 * @title Schema Registry
 * @author Consensys
 * @notice This contract aims to manage the Schemas used by the Portals, including their discoverability
 */
contract SchemaRegistry is OwnableUpgradeable {
  IRouter public router;
  /// @dev The list of Schemas, accessed by their ID
  mapping(bytes32 id => Schema schema) private schemas;
  /// @dev Associates a Schema ID with the address of the Issuer who created it
  mapping(bytes32 id => address issuer) private schemasIssuers;
  /// @dev The list of Schema IDs
  bytes32[] public schemaIds;

  /// @notice Error thrown when an invalid Router address is given
  error RouterInvalid();
  /// @notice Error thrown when a non-issuer tries to call a method that can only be called by an issuer
  error OnlyIssuer();
  /// @notice Error thrown when a non-assigned issuer tries to call a method that can only be called by an assigned issuer
  error OnlyAssignedIssuer();
  /// @notice Error thrown when an invalid Issuer address is given
  error IssuerInvalid();
  /// @notice Error thrown when an identical Schema was already registered
  error SchemaAlreadyExists();
  /// @notice Error thrown when attempting to add a Schema without a name
  error SchemaNameMissing();
  /// @notice Error thrown when attempting to add a Schema without a string to define it
  error SchemaStringMissing();
  /// @notice Error thrown when attempting to get a Schema that is not registered
  error SchemaNotRegistered();

  /// @notice Event emitted when a Schema is created and registered
  event SchemaCreated(bytes32 indexed id, string name, string description, string context, string schemaString);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice Contract initialization
   */
  function initialize() public initializer {
    __Ownable_init();
  }

  /**
   * @notice Checks if the caller is a registered issuer.
   * @param issuer the issuer address
   */
  modifier onlyIssuers(address issuer) {
    bool isIssuerRegistered = PortalRegistry(router.getPortalRegistry()).isIssuer(issuer);
    if (!isIssuerRegistered) revert OnlyIssuer();
    _;
  }

  /**
   * @notice Changes the address for the Router
   * @dev Only the registry owner can call this method
   */
  function updateRouter(address _router) public onlyOwner {
    if (_router == address(0)) revert RouterInvalid();
    router = IRouter(_router);
  }

  /**
   * @notice Updates a given Schema's Issuer
   * @param schemaId the Schema's ID
   * @param issuer the address of the issuer who created the given Schema
   * @dev Updates issuer for the given schemaId in the `schemaIssuers` mapping
   *      The issuer must already be registered as an Issuer via the `PortalRegistry`
   */
  function updateSchemaIssuer(bytes32 schemaId, address issuer) public onlyOwner {
    if (!isRegistered(schemaId)) revert SchemaNotRegistered();
    if (issuer == address(0)) revert IssuerInvalid();
    schemasIssuers[schemaId] = issuer;
  }

  /**
   * Generate an ID for a given schema
   * @param schema the string defining a schema
   * @return the schema ID
   * @dev encodes a schema string to unique bytes
   */
  function getIdFromSchemaString(string memory schema) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(schema));
  }

  /**
   * @notice Creates a Schema, with its metadata and runs some checks:
   * - mandatory name
   * - mandatory string defining the schema
   * - the Schema must be unique
   * @param name the Schema name
   * @param description the Schema description
   * @param context the Schema context
   * @param schemaString the string defining a Schema
   * @dev The Schema is stored in the `schemas` mapping, its ID is added to an array of IDs and an event is emitted
   *      The caller is assigned as the creator of the Schema, via the `schemasIssuers` mapping
   */
  function createSchema(
    string memory name,
    string memory description,
    string memory context,
    string memory schemaString
  ) public onlyIssuers(msg.sender) {
    if (bytes(name).length == 0) revert SchemaNameMissing();
    if (bytes(schemaString).length == 0) revert SchemaStringMissing();

    bytes32 schemaId = getIdFromSchemaString(schemaString);

    if (isRegistered(schemaId)) {
      revert SchemaAlreadyExists();
    }

    schemas[schemaId] = Schema(name, description, context, schemaString);
    schemaIds.push(schemaId);
    schemasIssuers[schemaId] = msg.sender;
    emit SchemaCreated(schemaId, name, description, context, schemaString);
  }

  /**
   * @notice Updates the context of a given schema
   * @param schemaId the schema ID
   * @param context the Schema context
   * @dev Retrieve the Schema with given ID and update its context with new value
   *      The caller must be the creator of the given Schema (through the `schemaIssuers` mapping)
   */
  function updateContext(bytes32 schemaId, string memory context) public {
    if (!isRegistered(schemaId)) revert SchemaNotRegistered();
    if (schemasIssuers[schemaId] != msg.sender) revert OnlyAssignedIssuer();
    schemas[schemaId].context = context;
  }

  /**
   * @notice Gets a schema by its identifier
   * @param schemaId the schema ID
   * @return the schema
   */
  function getSchema(bytes32 schemaId) public view returns (Schema memory) {
    if (!isRegistered(schemaId)) revert SchemaNotRegistered();
    return schemas[schemaId];
  }

  /**
   * @notice Get the number of Schemas managed by the contract
   * @return The number of Schemas already registered
   * @dev Returns the length of the `schemaIds` array
   */
  function getSchemasNumber() public view returns (uint256) {
    return schemaIds.length;
  }

  /**
   * @notice Check if a Schema is registered
   * @param schemaId The ID of the Schema
   * @return True if the Schema is registered, false otherwise
   */
  function isRegistered(bytes32 schemaId) public view returns (bool) {
    return bytes(schemas[schemaId].name).length > 0;
  }
}
