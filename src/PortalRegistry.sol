// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

import { Initializable } from "openzeppelin-contracts/contracts/proxy/utils/Initializable.sol";
import { ERC165Checker } from "openzeppelin-contracts/contracts/utils/introspection/ERC165Checker.sol";
import { IPortal } from "./interface/IPortal.sol";
import { Portal } from "./struct/Portal.sol";

/**
 * @title Portal Registry
 * @author Consensys
 * @notice This contract aims to manage the Portals used by attestation issuers
 */
contract PortalRegistry is Initializable {
  mapping(address id => Portal portal) private portals;
  address[] private portalAddresses;

  /// @notice Error thown when attempting to register a Portal twice
  error PortalAlreadyExists();
  /// @notice Error thrown when attempting to register a Portal that is not a smart contract
  error PortalAddressInvalid();
  /// @notice Error thown when attempting to register a Portal with an empty name
  error PortalNameMissing();
  /// @notice Error thrown when attempting to register a Portal with an empty description
  error PortalDescriptionMissing();
  /// @notice Error thrown when attempting to register a Portal that does not implement IPortal interface
  error PortalInvalid();
  /// @notice Error thrown when attempting to get a Portal that is not registered
  error PortalNotRegistered();

  /// @notice Event emitted when a Portal registered
  event PortalRegistered(string name, string description, address moduleAddress);

  /**
   * @notice Contract initialization
   */
  function initialize() public initializer {}

  /**
   * @notice Registers a Portal to the PortalRegistry
   * @param id the portal name
   * @param name the portal description
   * @param description the address of the deployed smart contract
   */
  function register(address id, string memory name, string memory description) external {
    // Check if portal already exists
    if (portals[id].id != address(0)) revert PortalAlreadyExists();

    // Check if portal is a smart contract
    if (!isContractAddress(id)) revert PortalAddressInvalid();

    // Check if name is not empty
    if (bytes(name).length == 0) revert PortalNameMissing();

    // Check if description is not empty
    if (bytes(description).length == 0) revert PortalDescriptionMissing();

    // Check if portal has implemented IPortal
    if (!ERC165Checker.supportsInterface(id, type(IPortal).interfaceId)) revert PortalInvalid();

    // Get the array of modules implemented by the portal
    address[] memory modules = IPortal(id).getModules();

    // Add portal to mapping
    Portal memory newPortal = Portal(id, name, description, modules);
    portals[id] = newPortal;
    portalAddresses.push(id);

    // Emit event
    emit PortalRegistered(name, description, id);
  }

  /**
   * @notice Get a Portal by its address
   * @param id The address of the Portal
   * @return The Portal
   */
  function getPortals(address id) public view returns (Portal memory) {
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
