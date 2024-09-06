// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// solhint-disable-next-line max-line-length
import { ERC165CheckerUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol";
import { AbstractPortal } from "./abstracts/AbstractPortal.sol";
import { DefaultPortal } from "./DefaultPortal.sol";
import { Portal } from "./types/Structs.sol";
import { IRouter } from "./interfaces/IRouter.sol";
import { IPortal } from "./interfaces/IPortal.sol";
import { uncheckedInc256 } from "./Common.sol";

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

  bool private isTestnet;

  /// @notice Error thrown when an invalid Router address is given
  error RouterInvalid();
  /// @notice Error thrown when a non-allowlisted user tries to call a forbidden method
  error OnlyAllowlisted();
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

  /// @notice Event emitted when a Portal is registered
  event PortalRegistered(string name, string description, address portalAddress);
  /// @notice Event emitted when a new issuer is added
  event IssuerAdded(address issuerAddress);
  /// @notice Event emitted when the issuer is removed
  event IssuerRemoved(address issuerAddress);
  /// @notice Event emitted when a Portal is revoked
  event PortalRevoked(address portalAddress);
  /// @notice Event emitted when the router is updated
  event RouterUpdated(address routerAddress);
  /// @notice Event emitted when the `isTestnet` flag is updated
  event IsTestnetUpdated(bool isTestnet);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor(bool _isTestnet) {
    _disableInitializers();
    isTestnet = _isTestnet;
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
    emit RouterUpdated(_router);
  }

  /**
   * @notice Registers an address as an issuer
   * @param issuer the address to register as an issuer
   */
  function setIssuer(address issuer) public onlyOwner {
    issuers[issuer] = true;
    emit IssuerAdded(issuer);
  }

  /**
   * @notice Update the testnet status
   * @param _isTestnet the flag defining the testnet status
   */
  function setIsTestnet(bool _isTestnet) public onlyOwner {
    isTestnet = _isTestnet;
    emit IsTestnetUpdated(_isTestnet);
  }

  /**
   * @notice Revokes issuer status from an address
   * @param issuer the address to be revoked as an issuer
   */
  function removeIssuer(address issuer) public onlyOwner {
    issuers[issuer] = false;
    // Emit event
    emit IssuerRemoved(issuer);
  }

  /**
   * @notice Checks if a given address is an issuer
   * @return A flag indicating whether the given address is an issuer
   */
  function isIssuer(address issuer) public view returns (bool) {
    return issuers[issuer];
  }

  /**
   * @notice Checks if the caller is allowlisted.
   * @param user the user address
   */
  modifier onlyAllowlisted(address user) {
    if (!isAllowlisted(user)) revert OnlyAllowlisted();
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
  ) public onlyAllowlisted(msg.sender) {
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
   * @notice Revokes a Portal from the PortalRegistry
   * @param id the portal address
   * @dev Only the registry owner can call this method
   */
  function revoke(address id) public onlyOwner {
    if (!isRegistered(id)) revert PortalNotRegistered();

    portals[id] = Portal(address(0), address(0), new address[](0), false, "", "", "");

    bool found = false;
    uint256 portalAddressIndex;
    for (uint256 i = 0; i < portalAddresses.length; i = uncheckedInc256(i)) {
      if (portalAddresses[i] == id) {
        portalAddressIndex = i;
        found = true;
        break;
      }
    }

    if (!found) {
      revert PortalNotRegistered();
    }

    portalAddresses[portalAddressIndex] = portalAddresses[portalAddresses.length - 1];
    portalAddresses.pop();

    emit PortalRevoked(id);
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
  ) external onlyAllowlisted(msg.sender) {
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
   * @notice Checks if the caller is allowlisted.
   * @return A flag indicating whether the Verax instance is running on testnet
   */
  function getIsTestnet() public view returns (bool) {
    return isTestnet;
  }

  /**
   * @notice Checks if a user is allowlisted.
   * @param user the user address
   * @return A flag indicating whether the given address is allowlisted
   */
  function isAllowlisted(address user) public view returns (bool) {
    return isTestnet || isIssuer(user);
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
