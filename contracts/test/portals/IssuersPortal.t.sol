// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { IssuersPortal } from "../../src/portals/IssuersPortal.sol";
import { Router } from "../../src/Router.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";
import { AttestationRegistryMock } from "../mocks/AttestationRegistryMock.sol";
import { ModuleRegistryMock } from "../mocks/ModuleRegistryMock.sol";

contract IssuersPortalTest is Test {
  address public attester = makeAddr("attester");
  IssuersPortal public issuersPortal;
  address[] public modules = new address[](0);
  ModuleRegistryMock public moduleRegistryMock = new ModuleRegistryMock();
  AttestationRegistryMock public attestationRegistryMock = new AttestationRegistryMock();
  Router public router = new Router();

  event Initialized(uint8 version);
  event AttestationRegistered();
  event BulkAttestationsRegistered();

  function setUp() public {
    router.initialize();
    router.updateModuleRegistry(address(moduleRegistryMock));
    router.updateAttestationRegistry(address(attestationRegistryMock));

    issuersPortal = new IssuersPortal(modules, address(router));
  }

  function test_attest() public {
    AttestationPayload memory attestationPayload = AttestationPayload(
      bytes32("schema1"),
      0,
      new bytes(0),
      new bytes(0)
    );
    bytes[] memory validationPayload = new bytes[](0);

    vm.expectEmit(true, true, true, true);
    emit AttestationRegistered();
    issuersPortal.attest(attestationPayload, validationPayload);
  }
}
