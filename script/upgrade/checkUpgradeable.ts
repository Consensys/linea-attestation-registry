import { ethers, upgrades } from "hardhat";

/*
 * This script aims to dynamically check if the registries contracts are upgradeable.
 * Validates a new implementation contract without deploying it and without actually upgrading to it.
 * OpenZeppelin doc: https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#validate-upgrade
 * Note: this does run the check against the already deployed version of the registries.
 */
async function main() {
  console.log("Checking contracts for upgradeability...");

  console.log("Checking AttestationRegistry...");
  const attestationRegistryProxyAddress = process.env.ATTESTATION_REGISTRY_ADDRESS ?? "";
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");

  await upgrades.validateUpgrade(attestationRegistryProxyAddress, AttestationRegistry, { kind: "transparent" });

  console.log("Checking ModuleRegistry...");
  const moduleRegistryProxyAddress = process.env.MODULE_REGISTRY_ADDRESS ?? "";
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");

  await upgrades.validateUpgrade(moduleRegistryProxyAddress, ModuleRegistry, { kind: "transparent" });

  console.log("Checking PortalRegistry...");
  const portalRegistryProxyAddress = process.env.PORTAL_REGISTRY_ADDRESS ?? "";
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");

  await upgrades.validateUpgrade(portalRegistryProxyAddress, PortalRegistry, { kind: "transparent" });

  console.log("Checking SchemaRegistry...");
  const schemaRegistryProxyAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");

  await upgrades.validateUpgrade(schemaRegistryProxyAddress, SchemaRegistry, { kind: "transparent" });

  console.log("All contracts are upgradeable!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
