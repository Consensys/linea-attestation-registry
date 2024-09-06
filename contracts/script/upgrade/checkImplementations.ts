import { ethers, upgrades } from "hardhat";

/*
 * This script aims to statically check if the implementation contracts follow the rules for upgradeability.
 * It validates implementation contracts without deploying them.
 * OpenZeppelin doc: https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#validate-implementation
 * Note: this does not run the check against the already deployed version of the registries.
 */
async function main() {
  console.log("Checking contracts implementation for upgradeability...");

  console.log("Checking AttestationRegistry...");
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
  await upgrades.validateImplementation(AttestationRegistry);
  console.log("AttestationRegistry OK");

  console.log("Checking ModuleRegistry...");
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
  await upgrades.validateImplementation(ModuleRegistry);
  console.log("ModuleRegistry OK");

  console.log("Checking PortalRegistry...");
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");
  // @ts-expect-error-next-line - constructorArgs is not part of the type
  await upgrades.validateImplementation(PortalRegistry, { constructorArgs: [false] });
  console.log("PortalRegistry OK");

  console.log("Checking SchemaRegistry...");
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  await upgrades.validateImplementation(SchemaRegistry);
  console.log("SchemaRegistry OK");

  console.log("Checking AttestationReader...");
  const AttestationReader = await ethers.getContractFactory("AttestationReader");
  await upgrades.validateImplementation(AttestationReader);
  console.log("AttestationReader OK");

  console.log("All contracts implementations are upgradeable!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
