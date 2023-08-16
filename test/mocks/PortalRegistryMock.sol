// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.21;

contract PortalRegistryMock {
  event PortalRegistered(string name, string description, address moduleAddress);
  mapping(address => bool) public portals;

  function register(address id, string memory name, string memory description) external {
    portals[id] = true;
    emit PortalRegistered(name, description, id);
  }

  function isRegistered(address id) public view returns (bool) {
    return portals[id];
  }
}
