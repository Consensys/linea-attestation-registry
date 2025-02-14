import { ethers, run } from "hardhat";
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
  const router = await Router.deploy();
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log(`Router implementation deployed at: ${routerAddress}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: routerAddress,
  });

  console.log(`\n----\n`);

  console.log("Deploying AttestationRegistry implementation...");
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
  const attestationRegistry = await AttestationRegistry.deploy();
  await attestationRegistry.waitForDeployment();
  const attestationRegistryAddress = await attestationRegistry.getAddress();
  console.log(`AttestationRegistry implementation deployed at: ${attestationRegistryAddress}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: attestationRegistryAddress,
  });

  console.log(`\n----\n`);

  console.log("Deploying ModuleRegistry implementation...");
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
  const moduleRegistry = await ModuleRegistry.deploy();
  await moduleRegistry.waitForDeployment();
  const moduleRegistryAddress = await moduleRegistry.getAddress();
  console.log(`ModuleRegistry implementation deployed at: ${moduleRegistryAddress}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: moduleRegistryAddress,
  });

  console.log(`\n----\n`);

  console.log("Deploying PortalRegistry implementation...");
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");
  const portalRegistry = await PortalRegistry.deploy();
  await portalRegistry.waitForDeployment();
  const portalRegistryAddress = await portalRegistry.getAddress();
  console.log(`PortalRegistry implementation deployed at: ${portalRegistryAddress}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: portalRegistryAddress,
  });

  console.log(`\n----\n`);

  console.log("Deploying SchemaRegistry implementation...");
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  const schemaRegistry = await SchemaRegistry.deploy();
  await schemaRegistry.waitForDeployment();
  const schemaRegistryAddress = await schemaRegistry.getAddress();
  console.log(`SchemaRegistry implementation deployed at: ${schemaRegistryAddress}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await run("verify:verify", {
    address: schemaRegistryAddress,
  });

  console.log(`\n----\n`);

  console.log(`** IMPLEMENTATION ADDRESSES SUMMARY **`);
  console.log(`Router: ${routerAddress}`);
  console.log(`AttestationRegistry: ${attestationRegistryAddress}`);
  console.log(`ModuleRegistry: ${moduleRegistryAddress}`);
  console.log(`PortalRegistry: ${portalRegistryAddress}`);
  console.log(`SchemaRegistry: ${schemaRegistryAddress}`);

  console.log(`END IMPLEMENTATIONS DEPLOYMENT`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
