import { ethers, upgrades } from "hardhat";

/*
 * This script aims to rec recreate a lost "network file".
 * Forces the import of an existing proxy contract deployment to be used with this plugin.
 * OpenZeppelin doc: https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#force-import
 * OpenZeppelin doc on network files: https://docs.openzeppelin.com/upgrades-plugins/1.x/network-files
 */
async function main() {
  console.log("Re-importing deployed contracts...");

  console.log("Re-importing AttestationRegistry...");
  const attestationRegistryProxyAddress = process.env.ATTESTATION_REGISTRY_ADDRESS ?? "";
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");

  await upgrades.forceImport(attestationRegistryProxyAddress, AttestationRegistry, { kind: "transparent" });

  console.log("Re-importing ModuleRegistry...");
  const moduleRegistryProxyAddress = process.env.MODULE_REGISTRY_ADDRESS ?? "";
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");

  await upgrades.forceImport(moduleRegistryProxyAddress, ModuleRegistry, { kind: "transparent" });

  console.log("Re-importing PortalRegistry...");
  const portalRegistryProxyAddress = process.env.PORTAL_REGISTRY_ADDRESS ?? "";
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");

  await upgrades.forceImport(portalRegistryProxyAddress, PortalRegistry, { kind: "transparent" });

  console.log("Re-importing SchemaRegistry...");
  const schemaRegistryProxyAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");

  await upgrades.forceImport(schemaRegistryProxyAddress, SchemaRegistry, { kind: "transparent" });

  console.log("All contracts are re-imported and the network file is re-created!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
