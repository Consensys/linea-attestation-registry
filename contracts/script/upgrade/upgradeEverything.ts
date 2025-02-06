import { ethers, run, upgrades } from "hardhat";
import dotenv from "dotenv";
import { getNetworkConfig } from "../utils";

dotenv.config({ path: "../.env" });

async function main() {
  console.log(`Upgrading all contracts...`);

  const routerProxyAddress = process.env.ROUTER_ADDRESS;
  if (!routerProxyAddress) {
    throw new Error("Router proxy address not found");
  }

  const attestationProxyAddress = process.env.ATTESTATION_REGISTRY_ADDRESS;
  if (!attestationProxyAddress) {
    throw new Error("Attestation proxy address not found");
  }

  const moduleProxyAddress = process.env.MODULE_REGISTRY_ADDRESS;
  if (!moduleProxyAddress) {
    throw new Error("Module proxy address not found");
  }

  const portalProxyAddress = process.env.PORTAL_REGISTRY_ADDRESS;
  if (!portalProxyAddress) {
    throw new Error("Portal proxy address not found");
  }

  const schemaProxyAddress = process.env.SCHEMA_REGISTRY_ADDRESS;
  if (!schemaProxyAddress) {
    throw new Error("Schema proxy address not found");
  }

  const network = await ethers.provider.getNetwork();
  const networkConfig = getNetworkConfig(network.chainId);
  console.log(
    `Chain prefix for chain ID ${network.chainId} is ${networkConfig.chainPrefix} (${
      networkConfig.isTestnet ? "testnet" : "mainnet"
    })`,
  );

  console.log("Upgrading Router, with proxy at", routerProxyAddress);
  const Router = await ethers.getContractFactory("Router");
  await upgrades.upgradeProxy(routerProxyAddress, Router);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log(`Router successfully upgraded!`);

  console.log(`\n----\n`);

  console.log("Upgrading AttestationRegistry, with proxy at", attestationProxyAddress);
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
  const attestationRegistry = await upgrades.upgradeProxy(attestationProxyAddress, AttestationRegistry);

  await attestationRegistry.incrementVersionNumber();

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log(`AttestationRegistry successfully upgraded!`);

  console.log(`\n----\n`);

  console.log("Upgrading ModuleRegistry, with proxy at", moduleProxyAddress);
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
  await upgrades.upgradeProxy(moduleProxyAddress, ModuleRegistry);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log(`ModuleRegistry successfully upgraded!`);

  console.log(`\n----\n`);

  console.log("Upgrading PortalRegistry, with proxy at", portalProxyAddress);
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");
  await upgrades.upgradeProxy(portalProxyAddress, PortalRegistry);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log(`PortalRegistry successfully upgraded!`);

  console.log(`\n----\n`);

  console.log("Upgrading SchemaRegistry, with proxy at", schemaProxyAddress);
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  await upgrades.upgradeProxy(schemaProxyAddress, SchemaRegistry);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log(`SchemaRegistry successfully upgraded!`);

  console.log(`\n----\n`);

  const routerImplementationAddress = await upgrades.erc1967.getImplementationAddress(routerProxyAddress);

  try {
    await run("verify:verify", {
      address: routerProxyAddress,
    });
  } catch (e) {
    console.log(`Error verifying Router: ${e}`);
  }

  console.log(`Router successfully upgraded and verified!`);
  console.log(`Proxy is at ${routerProxyAddress}`);
  console.log(`Implementation is at ${routerImplementationAddress}`);

  console.log(`\n----\n`);

  const attestationImplementationAddress = await upgrades.erc1967.getImplementationAddress(attestationProxyAddress);
  try {
    await run("verify:verify", {
      address: attestationProxyAddress,
    });
  } catch (e) {
    console.log(`Error verifying AttestationRegistry: ${e}`);
  }

  const newVersion = await attestationRegistry.getVersionNumber();

  console.log(`AttestationRegistry successfully upgraded to version ${newVersion} and verified!`);
  console.log(`Proxy is at ${attestationProxyAddress}`);
  console.log(`Implementation is at ${attestationImplementationAddress}`);

  console.log(`\n----\n`);

  const moduleImplementationAddress = await upgrades.erc1967.getImplementationAddress(moduleProxyAddress);

  try {
    await run("verify:verify", {
      address: moduleProxyAddress,
    });
  } catch (e) {
    console.log(`Error verifying ModuleRegistry: ${e}`);
  }

  console.log(`ModuleRegistry successfully upgraded and verified!`);
  console.log(`Proxy is at ${moduleProxyAddress}`);
  console.log(`Implementation is at ${moduleImplementationAddress}`);

  console.log(`\n----\n`);

  const portalImplementationAddress = await upgrades.erc1967.getImplementationAddress(portalProxyAddress);

  try {
    await run("verify:verify", {
      address: portalProxyAddress,
    });
  } catch (e) {
    console.log(`Error verifying PortalRegistry: ${e}`);
  }

  console.log(`PortalRegistry successfully upgraded and verified!`);
  console.log(`Proxy is at ${portalProxyAddress}`);
  console.log(`Implementation is at ${portalImplementationAddress}`);

  console.log(`\n----\n`);

  const schemaImplementationAddress = await upgrades.erc1967.getImplementationAddress(schemaProxyAddress);

  try {
    await run("verify:verify", {
      address: schemaProxyAddress,
    });
  } catch (e) {
    console.log(`Error verifyingSchemaRegistry: ${e}`);
  }

  console.log(`SchemaRegistry successfully upgraded and verified!`);
  console.log(`Proxy is at ${schemaProxyAddress}`);
  console.log(`Implementation is at ${schemaImplementationAddress}`);

  console.log(`\n----\n`);

  console.log(`** SUMMARY **`);
  console.log(`Router = ${routerProxyAddress}`);
  console.log(`AttestationRegistry = ${attestationProxyAddress}`);
  console.log(`ModuleRegistry = ${moduleProxyAddress}`);
  console.log(`PortalRegistry = ${portalProxyAddress}`);
  console.log(`SchemaRegistry = ${schemaProxyAddress}`);

  console.log(`All contracts were upgraded!`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
