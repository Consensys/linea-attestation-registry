// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { RouterManager } from "../../src/RouterManager.sol";
import { IRouter } from "../../src/interfaces/IRouter.sol";

/**
 * @title RouterManagerTestContract
 * @notice Real contract to test RouterManager
 */
contract RouterManagerTestContract is RouterManager {
  IRouter public router;

  function _setRouter(address _router) internal override {
    router = IRouter(_router);
  }
}
