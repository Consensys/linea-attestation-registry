// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Portal } from "../../src/types/Structs.sol";

contract PortalRegistryNotAllowlistedMock {
  event PortalRegistered(string name, string description, address portalAddress);

  mapping(address id => Portal portal) private portals;

  mapping(address issuerAddress => bool isIssuer) private issuers;

  function test() public {}

  function register(
    address id,
    string calldata name,
    string calldata description,
    bool isRevocable,
    string calldata ownerName
  ) external {
    Portal memory newPortal = Portal(id, msg.sender, new address[](0), isRevocable, name, description, ownerName);
    portals[id] = newPortal;
    emit PortalRegistered(name, description, id);
  }

  function isRegistered(address id) public view returns (bool) {
    return portals[id].id != address(0);
  }

  function getPortalByAddress(address id) public view returns (Portal memory) {
    return portals[id];
  }

  function getPortalOwner(address portalAddress) external view returns (address) {
    return portals[portalAddress].ownerAddress;
  }

  function getPortalRevocability(address portalAddress) external view returns (bool) {
    return portals[portalAddress].isRevocable;
  }

  function setIssuer(address issuer) public {
    issuers[issuer] = true;
  }

  function isIssuer(address issuer) public view returns (bool) {
    return issuers[issuer];
  }

  function isAllowlisted(address /*user*/) public pure returns (bool) {
    return false;
  }
}
