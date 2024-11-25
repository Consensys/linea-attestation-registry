// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { IRouter } from "./interfaces/IRouter.sol";

/**
 * @title RouterManager
 * @notice Centralise la gestion du Router
 */
abstract contract RouterManager is OwnableUpgradeable {
  /// @notice Error thrown when an invalid Router address is given
  error RouterInvalid();
  /// @notice Event emitted when the router is updated
  event RouterUpdated(address routerAddress);

  /**
   * @notice Change l'adresse du Router
   * @dev Seul le propriétaire peut appeler cette méthode
   * @param _router La nouvelle adresse du Router
   */
  function updateRouter(address _router) public onlyOwner {
    if (_router == address(0)) revert RouterInvalid();
    _setRouter(_router); // Appelle une fonction interne pour mettre à jour
    emit RouterUpdated(_router); // Émet un événement pour signaler la mise à jour
  }

  /**
   * @dev Définit l'adresse du Router. Doit être implémentée par les contrats enfants.
   * @param _router La nouvelle adresse du Router
   */
  function _setRouter(address _router) internal virtual;
}
