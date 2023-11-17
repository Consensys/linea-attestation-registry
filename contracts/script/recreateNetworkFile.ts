import { ethers, upgrades } from "hardhat";

/*
 * This script aims to rec recreate a lost "network file".
 * Forces the import of an existing proxy contract deployment to be used with this plugin.
 * OpenZeppelin doc: https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#force-import
 * OpenZeppelin doc on network files: https://docs.openzeppelin.com/upgrades-plugins/1.x/network-files
 */
async function main() {
  console.log("Re-importing deployed contracts...");

  console.log("Re-importing Router...");
  const routerProxyAddress = process.env.ROUTER_ADDRESS ?? "";
  const Router = await ethers.getContractFactory("Router");

  try {
    await upgrades.forceImport(routerProxyAddress, Router, { kind: "transparent" });
    console.log("✅ Router re-imported");
  } catch (e) {
    console.log("❌ Router already registered");
  }

  console.log("Re-importing AttestationRegistry...");
  const attestationRegistryProxyAddress = process.env.ATTESTATION_REGISTRY_ADDRESS ?? "";
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");

  try {
    await upgrades.forceImport(attestationRegistryProxyAddress, AttestationRegistry, { kind: "transparent" });
    console.log("✅ AttestationRegistry re-imported");
  } catch (e) {
    console.log("❌ AttestationRegistry already registered");
  }

  console.log("Re-importing ModuleRegistry...");
  const moduleRegistryProxyAddress = process.env.MODULE_REGISTRY_ADDRESS ?? "";
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");

  try {
    await upgrades.forceImport(moduleRegistryProxyAddress, ModuleRegistry, { kind: "transparent" });
    console.log("✅ ModuleRegistry re-imported");
  } catch (e) {
    console.log("❌ ModuleRegistry already registered");
  }

  console.log("Re-importing PortalRegistry...");
  const portalRegistryProxyAddress = process.env.PORTAL_REGISTRY_ADDRESS ?? "";
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");

  try {
    await upgrades.forceImport(portalRegistryProxyAddress, PortalRegistry, { kind: "transparent" });
    console.log("✅ PortalRegistry re-imported");
  } catch (e) {
    console.log("❌ PortalRegistry already registered");
  }

  console.log("Re-importing SchemaRegistry...");
  const schemaRegistryProxyAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");

  try {
    await upgrades.forceImport(schemaRegistryProxyAddress, SchemaRegistry, { kind: "transparent" });
    console.log("✅ SchemaRegistry re-imported");
  } catch (e) {
    console.log("❌ SchemaRegistry already registered");
  }

  console.log("Re-importing AttestationReader...");
  const attestationReaderProxyAddress = process.env.ATTESTATION_READER_ADDRESS ?? "";
  const AttestationReader = await ethers.getContractFactory("AttestationReader");

  try {
    await upgrades.forceImport(attestationReaderProxyAddress, AttestationReader, { kind: "transparent" });
    console.log("✅ AttestationReader re-imported");
  } catch (e) {
    console.log("❌ AttestationReader already registered");
  }

  console.log("All contracts are re-imported and the network file is re-created!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
