import { ethers, run, upgrades } from "hardhat";
import { getNetworkConfig } from "../utils";

async function main() {
  console.log(`START IMPLEMENTATIONS DEPLOYMENT`);

  const network = await ethers.provider.getNetwork();
  const networkConfig = getNetworkConfig(network.chainId);
  console.log(
    `Chain prefix for chain ID ${network.chainId} is ${networkConfig.chainPrefix} (${
      networkConfig.isTestnet ? "testnet" : "mainnet"
    })`,
  );

  console.log("Deploying Router implementation...");
  const Router = await ethers.getContractFactory("Router");
  const routerImplementation = await upgrades.deployImplementation(Router);
  console.log(`Router implementation deployed at: ${routerImplementation}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: routerImplementation,
  });

  console.log(`\n----\n`);

  console.log("Deploying AttestationRegistry implementation...");
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
  const attestationRegistryImplementation = await upgrades.deployImplementation(AttestationRegistry);
  console.log(`AttestationRegistry implementation deployed at: ${attestationRegistryImplementation}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: attestationRegistryImplementation,
  });

  console.log(`\n----\n`);

  console.log("Deploying ModuleRegistry implementation...");
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
  const moduleRegistryImplementation = await upgrades.deployImplementation(ModuleRegistry);
  console.log(`ModuleRegistry implementation deployed at: ${moduleRegistryImplementation}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: moduleRegistryImplementation,
  });

  console.log(`\n----\n`);

  console.log("Deploying PortalRegistry implementation...");
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");
  const portalRegistryImplementation = await upgrades.deployImplementation(PortalRegistry);
  console.log(`PortalRegistry implementation deployed at: ${portalRegistryImplementation}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: portalRegistryImplementation,
  });

  console.log(`\n----\n`);

  console.log("Deploying SchemaRegistry implementation...");
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  const schemaRegistryImplementation = await upgrades.deployImplementation(SchemaRegistry);
  console.log(`SchemaRegistry implementation deployed at: ${schemaRegistryImplementation}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: schemaRegistryImplementation,
  });

  console.log(`\n----\n`);

  console.log("Deploying AttestationReader implementation...");
  const AttestationReader = await ethers.getContractFactory("AttestationReader");
  const attestationReaderImplementation = await upgrades.deployImplementation(AttestationReader);
  console.log(`AttestationReader implementation deployed at: ${attestationReaderImplementation}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: attestationReaderImplementation,
  });

  console.log(`\n----\n`);

  console.log(`** IMPLEMENTATION ADDRESSES SUMMARY **`);
  console.log(`Router: ${routerImplementation}`);
  console.log(`AttestationRegistry: ${attestationRegistryImplementation}`);
  console.log(`ModuleRegistry: ${moduleRegistryImplementation}`);
  console.log(`PortalRegistry: ${portalRegistryImplementation}`);
  console.log(`SchemaRegistry: ${schemaRegistryImplementation}`);
  console.log(`AttestationReader: ${attestationReaderImplementation}`);

  console.log(`END IMPLEMENTATIONS DEPLOYMENT`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
