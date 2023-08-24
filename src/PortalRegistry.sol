// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
// solhint-disable-next-line max-line-length
import { ERC165CheckerUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/introspection/ERC165CheckerUpgradeable.sol";
import { AbstractPortal } from "./interface/AbstractPortal.sol";
import { DefaultPortal } from "./portal/DefaultPortal.sol";
import { Portal } from "./types/Structs.sol";
import { IRouter } from "./interface/IRouter.sol";

/**
 * @title Portal Registry
 * @author Consensys
 * @notice This contract aims to manage the Portals used by attestation issuers
 */
contract PortalRegistry is OwnableUpgradeable {
  IRouter public router;

  mapping(address id => Portal portal) private portals;

  address[] private portalAddresses;

  /// @notice Error thrown when an invalid Router address is given
  error RouterInvalid();
  /// @notice Error thrown when attempting to register a Portal twice
  error PortalAlreadyExists();
  /// @notice Error thrown when attempting to register a Portal that is not a smart contract
  error PortalAddressInvalid();
  /// @notice Error thrown when attempting to register a Portal with an empty name
  error PortalNameMissing();
  /// @notice Error thrown when attempting to register a Portal with an empty description
  error PortalDescriptionMissing();
  /// @notice Error thrown when attempting to register a Portal that does not implement IPortal interface
  error PortalInvalid();
  /// @notice Error thrown when attempting to get a Portal that is not registered
  error PortalNotRegistered();

  /// @notice Event emitted when a Portal registered
  event PortalRegistered(string name, string description, address moduleAddress);

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
   */
  function updateRouter(address _router) public onlyOwner {
    if (_router == address(0)) revert RouterInvalid();
    router = IRouter(_router);
  }

  /**
   * @notice Registers a Portal to the PortalRegistry
   * @param id the portal address
   * @param name the portal name
   * @param description the portal description
   */
  function register(address id, string memory name, string memory description) public {
    // Check if portal already exists
    if (portals[id].id != address(0)) revert PortalAlreadyExists();

    // Check if portal is a smart contract
    if (!isContractAddress(id)) revert PortalAddressInvalid();

    // Check if name is not empty
    if (bytes(name).length == 0) revert PortalNameMissing();

    // Check if description is not empty
    if (bytes(description).length == 0) revert PortalDescriptionMissing();

    // Check if portal has implemented IPortal
    if (!ERC165CheckerUpgradeable.supportsInterface(id, type(AbstractPortal).interfaceId)) revert PortalInvalid();

    // Get the array of modules implemented by the portal
    address[] memory modules = AbstractPortal(id).getModules();

    // Add portal to mapping
    Portal memory newPortal = Portal(id, name, description, modules);
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
   */
  function deployDefaultPortal(address[] calldata modules, string memory name, string memory description) external {
    DefaultPortal defaultPortal = new DefaultPortal();
    defaultPortal.initialize(modules, router.getModuleRegistry(), router.getAttestationRegistry());
    register(address(defaultPortal), name, description);
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
