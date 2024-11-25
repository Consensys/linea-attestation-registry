// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { RouterManager } from "../src/RouterManager.sol";
import { RouterManagerTestContract } from "./mocks/RouterManagerTestContract.sol";
import { IRouter } from "../src/interfaces/IRouter.sol";

contract RouterManagerTest is Test {
  RouterManagerTestContract public routerManager;

  event RouterUpdated(address routerAddress);

  function setUp() public {
    routerManager = new RouterManagerTestContract();
  }

  function test_updateRouter() public {
    address newRouter = makeAddr("NewRouter");

    vm.expectEmit(true, true, true, true);
    emit RouterUpdated(newRouter);

    vm.prank(address(0));
    routerManager.updateRouter(newRouter);

    assertEq(address(routerManager.router()), newRouter);
  }

  function test_updateRouter_RouterInvalid() public {
    vm.expectRevert(RouterManager.RouterInvalid.selector);

    vm.prank(address(0));
    routerManager.updateRouter(address(0));
  }

  function test_updateRouter_OnlyOwner() public {
    address newRouter = makeAddr("NewRouter");

    vm.prank(makeAddr("NotOwner"));
    vm.expectRevert("Ownable: caller is not the owner");
    routerManager.updateRouter(newRouter);
  }
}
