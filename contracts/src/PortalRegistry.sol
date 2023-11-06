// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
// solhint-disable-next-line max-line-length
import { ERC165CheckerUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165CheckerUpgradeable.sol";
import { AbstractPortal } from "./abstracts/AbstractPortal.sol";
import { DefaultPortal } from "./DefaultPortal.sol";
import { SchemaRegistry } from "./SchemaRegistry.sol";
import { Portal } from "./types/Structs.sol";
import { IRouter } from "./interfaces/IRouter.sol";
import { IPortal } from "./interfaces/IPortal.sol";

/**
 * @title Portal Registry
 * @author Consensys
 * @notice This contract aims to manage the Portals used by attestation issuers
 */
contract PortalRegistry is OwnableUpgradeable {
  IRouter public router;

  mapping(address id => Portal portal) private portals;

  mapping(address issuerAddress => bool isIssuer) private issuers;

  address[] private portalAddresses;

  /// @notice Error thrown when an invalid Router address is given
  error RouterInvalid();
  /// @notice Error thrown when a non-issuer tries to call a method that can only be called by an issuer
  error OnlyIssuer();
  /// @notice Error thrown when attempting to register a Portal twice
  error PortalAlreadyExists();
  /// @notice Error thrown when attempting to register a Portal that is not a smart contract
  error PortalAddressInvalid();
  /// @notice Error thrown when attempting to register a Portal with an empty name
  error PortalNameMissing();
  /// @notice Error thrown when attempting to register a Portal with an empty description
  error PortalDescriptionMissing();
  /// @notice Error thrown when attempting to register a Portal with an empty owner name
  error PortalOwnerNameMissing();
  /// @notice Error thrown when attempting to register a Portal that does not implement IPortal interface
  error PortalInvalid();
  /// @notice Error thrown when attempting to get a Portal that is not registered
  error PortalNotRegistered();

  /// @notice Event emitted when a Portal registered
  event PortalRegistered(string name, string description, address portalAddress);

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
   * @notice Changes the address for the Router
   * @dev Only the registry owner can call this method
   */
  function updateRouter(address _router) public onlyOwner {
    if (_router == address(0)) revert RouterInvalid();
    router = IRouter(_router);
  }

  /**
   * @notice Registers an address as been an issuer
   * @param issuer the address to register as an issuer
   */
  function setIssuer(address issuer) public onlyOwner {
    issuers[issuer] = true;
  }

  /**
   * @notice Revokes issuer status from an address
   * @param issuer the address to be revoked as an issuer
   */
  function removeIssuer(address issuer) public onlyOwner {
    issuers[issuer] = false;
    SchemaRegistry(router.getSchemaRegistry()).updateMatchingSchemaIssuers(issuer, msg.sender);
  }

  /**
   * @notice Checks if a given address is an issuer
   * @return A flag indicating whether the given address is an issuer
   */
  function isIssuer(address issuer) public view returns (bool) {
    return issuers[issuer];
  }

  /**
   * @notice Checks if the caller is a registered issuer.
   * @param issuer the issuer address
   */
  modifier onlyIssuers(address issuer) {
    if (!isIssuer(issuer)) revert OnlyIssuer();
    _;
  }

  /**
   * @notice Registers a Portal to the PortalRegistry
   * @param id the portal address
   * @param name the portal name
   * @param description the portal description
   * @param isRevocable whether the portal issues revocable attestations
   * @param ownerName name of this portal's owner
   */
  function register(
    address id,
    string memory name,
    string memory description,
    bool isRevocable,
    string memory ownerName
  ) public onlyIssuers(msg.sender) {
    // Check if portal already exists
    if (portals[id].id != address(0)) revert PortalAlreadyExists();

    // Check if portal is a smart contract
    if (!isContractAddress(id)) revert PortalAddressInvalid();

    // Check if name is not empty
    if (bytes(name).length == 0) revert PortalNameMissing();

    // Check if description is not empty
    if (bytes(description).length == 0) revert PortalDescriptionMissing();

    // Check if the owner's name is not empty
    if (bytes(ownerName).length == 0) revert PortalOwnerNameMissing();

    // Check if portal has implemented AbstractPortal
    if (!ERC165CheckerUpgradeable.supportsInterface(id, type(IPortal).interfaceId)) revert PortalInvalid();

    // Get the array of modules implemented by the portal
    address[] memory modules = AbstractPortal(id).getModules();

    // Add portal to mapping
    Portal memory newPortal = Portal(id, msg.sender, modules, isRevocable, name, description, ownerName);
    portals[id] = newPortal;
    portalAddresses.push(id);

    // Emit event
    emit PortalRegistered(name, description, id);
  }

  /**
   * @notice Deploys and registers a clone of default portal
   * @param modules the modules addresses
   * @param name the portal name
   * @param description the portal description
   * @param ownerName name of this portal's owner
   */
  function deployDefaultPortal(
    address[] calldata modules,
    string memory name,
    string memory description,
    bool isRevocable,
    string memory ownerName
  ) external onlyIssuers(msg.sender) {
    DefaultPortal defaultPortal = new DefaultPortal(modules, address(router));
    register(address(defaultPortal), name, description, isRevocable, ownerName);
  }

  /**
   * @notice Get a Portal by its address
   * @param id The address of the Portal
   * @return The Portal
   */
  function getPortalByAddress(address id) public view returns (Portal memory) {
    if (!isRegistered(id)) revert PortalNotRegistered();
    return portals[id];
  }

  /**
   * @notice Check if a Portal is registered
   * @param id The address of the Portal
   * @return True if the Portal is registered, false otherwise
   */
  function isRegistered(address id) public view returns (bool) {
    return portals[id].id != address(0);
  }

  /**
   * @notice Get the number of Portals managed by the contract
   * @return The number of Portals already registered
   * @dev Returns the length of the `portalAddresses` array
   */
  function getPortalsCount() public view returns (uint256) {
    return portalAddresses.length;
  }

  /**
   * Check if address is smart contract and not EOA
   * @param contractAddress address to be verified
   * @return the result as true if it is a smart contract else false
   */
  function isContractAddress(address contractAddress) internal view returns (bool) {
    return contractAddress.code.length > 0;
  }
}
