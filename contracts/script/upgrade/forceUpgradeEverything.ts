import { ethers, run, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  console.log(`START SCRIPT`);

  const routerProxyAddress = process.env.ROUTER_ADDRESS;
  if (!routerProxyAddress) {
    throw new Error("Router proxy address not found");
  }

  const attestationProxyAddress = process.env.ATTESTATION_REGISTRY_ADDRESS ?? "";
  if (!attestationProxyAddress) {
    throw new Error("Attestation proxy address not found");
  }

  const moduleProxyAddress = process.env.MODULE_REGISTRY_ADDRESS ?? "";
  if (!moduleProxyAddress) {
    throw new Error("Module proxy address not found");
  }

  const portalProxyAddress = process.env.PORTAL_REGISTRY_ADDRESS ?? "";
  if (!portalProxyAddress) {
    throw new Error("Portal proxy address not found");
  }

  const schemaProxyAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";
  if (!schemaProxyAddress) {
    throw new Error("Schema proxy address not found");
  }

  const attestationReaderProxyAddress = process.env.ATTESTATION_READER_ADDRESS ?? "";
  if (!attestationReaderProxyAddress) {
    throw new Error("Attestation reader proxy address not found");
  }

  console.log("Upgrading Router, with proxy at", routerProxyAddress);
  const Router = await ethers.getContractFactory("Router");
  await upgrades.upgradeProxy(routerProxyAddress, Router, {
    redeployImplementation: "always",
  });

  console.log(`Router successfully upgraded!`);

  console.log(`\n----\n`);

  console.log("Upgrading AttestationRegistry, with proxy at", attestationProxyAddress);
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
  const attestationRegistry = await upgrades.upgradeProxy(attestationProxyAddress, AttestationRegistry, {
    redeployImplementation: "always",
  });

  await attestationRegistry.incrementVersionNumber();

  console.log(`AttestationRegistry successfully upgraded!`);

  console.log(`\n----\n`);

  console.log("Upgrading ModuleRegistry, with proxy at", moduleProxyAddress);
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
  await upgrades.upgradeProxy(moduleProxyAddress, ModuleRegistry, {
    redeployImplementation: "always",
  });

  console.log(`ModuleRegistry successfully upgraded!`);

  console.log(`\n----\n`);

  console.log("Upgrading PortalRegistry, with proxy at", portalProxyAddress);
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");
  await upgrades.upgradeProxy(portalProxyAddress, PortalRegistry, {
    redeployImplementation: "always",
  });

  console.log(`PortalRegistry successfully upgraded!`);

  console.log(`\n----\n`);

  console.log("Upgrading SchemaRegistry, with proxy at", schemaProxyAddress);
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  await upgrades.upgradeProxy(schemaProxyAddress, SchemaRegistry, {
    redeployImplementation: "always",
  });

  console.log(`SchemaRegistry successfully upgraded!`);

  console.log(`\n----\n`);

  console.log("Upgrading AttestationReader, with proxy at", attestationReaderProxyAddress);
  const AttestationReader = await ethers.getContractFactory("AttestationReader");
  await upgrades.upgradeProxy(attestationReaderProxyAddress, AttestationReader, {
    redeployImplementation: "always",
  });

  console.log(`AttestationReader successfully upgraded!`);

  console.log(`\n----\n`);

  const routerImplementationAddress = await upgrades.erc1967.getImplementationAddress(routerProxyAddress);

  await run("verify:verify", {
    address: routerProxyAddress,
  });

  console.log(`Router successfully upgraded and verified!`);
  console.log(`Proxy is at ${routerProxyAddress}`);
  console.log(`Implementation is at ${routerImplementationAddress}`);

  console.log(`\n----\n`);

  const attestationImplementationAddress = await upgrades.erc1967.getImplementationAddress(attestationProxyAddress);

  await run("verify:verify", {
    address: attestationProxyAddress,
  });

  const newVersion = await attestationRegistry.getVersionNumber();

  console.log(`AttestationRegistry successfully upgraded to version ${newVersion} and verified!`);
  console.log(`Proxy is at ${attestationProxyAddress}`);
  console.log(`Implementation is at ${attestationImplementationAddress}`);

  console.log(`\n----\n`);

  const moduleImplementationAddress = await upgrades.erc1967.getImplementationAddress(moduleProxyAddress);

  await run("verify:verify", {
    address: moduleProxyAddress,
  });

  console.log(`ModuleRegistry successfully upgraded and verified!`);
  console.log(`Proxy is at ${moduleProxyAddress}`);
  console.log(`Implementation is at ${moduleImplementationAddress}`);

  console.log(`\n----\n`);

  const portalImplementationAddress = await upgrades.erc1967.getImplementationAddress(portalProxyAddress);

  await run("verify:verify", {
    address: portalProxyAddress,
  });

  console.log(`PortalRegistry successfully upgraded and verified!`);
  console.log(`Proxy is at ${portalProxyAddress}`);
  console.log(`Implementation is at ${portalImplementationAddress}`);

  console.log(`\n----\n`);

  const schemaImplementationAddress = await upgrades.erc1967.getImplementationAddress(schemaProxyAddress);

  await run("verify:verify", {
    address: schemaProxyAddress,
  });

  console.log(`SchemaRegistry successfully upgraded and verified!`);
  console.log(`Proxy is at ${schemaProxyAddress}`);
  console.log(`Implementation is at ${schemaImplementationAddress}`);

  console.log(`\n----\n`);

  const attestationReaderImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    attestationReaderProxyAddress,
  );

  await run("verify:verify", {
    address: attestationReaderProxyAddress,
  });

  console.log(`AttestationReader successfully upgraded and verified!`);
  console.log(`Proxy is at ${attestationReaderProxyAddress}`);
  console.log(`Implementation is at ${attestationReaderImplementationAddress}`);

  console.log(`\n----\n`);

  console.log(`** SUMMARY **`);
  console.log(`Router = ${routerProxyAddress}`);
  console.log(`AttestationRegistry = ${attestationProxyAddress}`);
  console.log(`ModuleRegistry = ${moduleProxyAddress}`);
  console.log(`PortalRegistry = ${portalProxyAddress}`);
  console.log(`SchemaRegistry = ${schemaProxyAddress}`);
  console.log(`AttestationReader = ${attestationReaderProxyAddress}`);

  console.log(`END SCRIPT`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
