// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { AbstractModule } from "../../src/interface/AbstractModule.sol";
import { SchemaCheckerModule } from "../../src/examples/modules/SchemaCheckerModule.sol";
import { AttestationPayload } from "../../src/types/Structs.sol";

contract SchemaCheckerModuleTest is Test {
  SchemaCheckerModule private schemaCheckerModule;
  address internal issuer;

  event ModuleRegistered(string name, string description, address moduleAddress);

  function setUp() public {
    issuer = makeAddr("issuer");
    schemaCheckerModule = new SchemaCheckerModule();
    vm.deal(issuer, 1 ether);
  }

  function test_SchemaCheckerModule_verifySchemaId() public {
    address user = makeAddr("user");
    bytes32 schemaId = bytes32(uint256(1234));
    uint64 issueDate = 0;
    AttestationPayload memory attestationPayload = AttestationPayload(
      schemaId,
      0,
      abi.encode(user),
      abi.encode(issuer, schemaId, issueDate)
    );
    
    schemaCheckerModule.run(attestationPayload, bytes("0000"), user, 0);
  }

  function test_SchemaCheckerModule_InvalidSchemaId() public {
    address user = makeAddr("user");
    bytes32 schemaId = bytes32(uint256(1234));
    uint64 issueDate = 0;
    AttestationPayload memory attestationPayload = AttestationPayload(
      schemaId,
      0,
      abi.encode(user),
      abi.encode(issuer, bytes32(uint256(4321)), issueDate)
    );

    vm.expectRevert(SchemaCheckerModule.InvalidSchemaId.selector);
    schemaCheckerModule.run(attestationPayload, bytes("0000"), user, 0);

  }

  function test_EcRecoverModule_supportsInterface() public {
    bool isAbstractModuleSupported = schemaCheckerModule.supportsInterface(type(AbstractModule).interfaceId);
    assertEq(isAbstractModuleSupported, true);
  }
}
