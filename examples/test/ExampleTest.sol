// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { Test } from "forge-std/Test.sol";
import { ERC712ModuleV2 } from "../src/modules/ERC712ModuleV2.sol";
import { MerkleProofModuleV2 } from "../src/modules/MerkleProofModuleV2.sol";
import { EASPortal } from "../src/portals/EASPortal.sol";
import { NFTPortal } from "../src/portals/NFTPortal.sol";
import { PausablePortal } from "../src/portals/PausablePortal.sol";

contract ExampleTest is Test {
    function setUp() public {
        // Setup code if needed
    }

    function testExamplesCompile() public {
        // This test simply ensures that all examples compile correctly
        assertTrue(true);
    }
} 