import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Checking contracts for upgradeability...");

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
  await upgrades.validateImplementation(PortalRegistry);
  console.log("PortalRegistry OK");

  console.log("Checking SchemaRegistry...");
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  await upgrades.validateImplementation(SchemaRegistry);
  console.log("SchemaRegistry OK");

  console.log("All contracts are upgradeable!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
