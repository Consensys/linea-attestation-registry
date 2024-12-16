import { ethers, run, upgrades } from "hardhat";
import dotenv from "dotenv";
import { getNetworkConfig } from "../utils";

dotenv.config({ path: "../.env" });

async function main() {
  console.log(`START SCRIPT`);

  const network = await ethers.provider.getNetwork();
  const networkConfig = getNetworkConfig(network.chainId);
  console.log(
    `Chain prefix for chain ID ${network.chainId} is ${networkConfig.chainPrefix} (${
      networkConfig.isTestnet ? "testnet" : "mainnet"
    })`,
  );

  console.log("Deploying Router...");
  const Router = await ethers.getContractFactory("Router");
  const router = await upgrades.deployProxy(Router);
  await router.waitForDeployment();
  const routerProxyAddress = await router.getAddress();
  const routerImplementationAddress = await upgrades.erc1967.getImplementationAddress(routerProxyAddress);

  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    await run("verify:verify", {
      address: routerProxyAddress,
    });
  } catch (e) {
    console.log("Verification failed for Router");
  }

  console.log(`Router successfully deployed and verified!`);
  console.log(`Proxy is at ${routerProxyAddress}`);
  console.log(`Implementation is at ${routerImplementationAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying AttestationRegistry...");
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
  const attestationRegistry = await upgrades.deployProxy(AttestationRegistry, [
    routerProxyAddress,
    networkConfig.chainPrefix,
  ]);
  await attestationRegistry.waitForDeployment();
  const attestationRegistryProxyAddress = await attestationRegistry.getAddress();
  const attestationRegistryImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    attestationRegistryProxyAddress,
  );

  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    await run("verify:verify", {
      address: attestationRegistryProxyAddress,
    });
  } catch (e) {
    console.log("Verification failed for AttestationRegistry");
  }

  console.log(`AttestationRegistry successfully deployed and verified!`);
  console.log(`Proxy is at ${attestationRegistryProxyAddress}`);
  console.log(`Implementation is at ${attestationRegistryImplementationAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying ModuleRegistry...");
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
  const moduleRegistry = await upgrades.deployProxy(ModuleRegistry, [routerProxyAddress]);
  await moduleRegistry.waitForDeployment();
  const moduleRegistryProxyAddress = await moduleRegistry.getAddress();
  const moduleRegistryImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    moduleRegistryProxyAddress,
  );

  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    await run("verify:verify", {
      address: moduleRegistryProxyAddress,
    });
  } catch (e) {
    console.log("Verification failed for ModuleRegistry");
  }

  console.log(`ModuleRegistry successfully deployed and verified!`);
  console.log(`Proxy is at ${moduleRegistryProxyAddress}`);
  console.log(`Implementation is at ${moduleRegistryImplementationAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying PortalRegistry...");
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");
  const portalRegistry = await upgrades.deployProxy(PortalRegistry, [routerProxyAddress, networkConfig.isTestnet]);
  await portalRegistry.waitForDeployment();
  const portalRegistryProxyAddress = await portalRegistry.getAddress();
  const portalRegistryImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    portalRegistryProxyAddress,
  );

  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    await run("verify:verify", {
      address: portalRegistryProxyAddress,
    });
  } catch (e) {
    console.log("Verification failed for PortalRegistry");
  }

  console.log(`PortalRegistry successfully deployed and verified!`);
  console.log(`Proxy is at ${portalRegistryProxyAddress}`);
  console.log(`Implementation is at ${portalRegistryImplementationAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying SchemaRegistry...");
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  const schemaRegistry = await upgrades.deployProxy(SchemaRegistry, [routerProxyAddress]);
  await schemaRegistry.waitForDeployment();
  const schemaRegistryProxyAddress = await schemaRegistry.getAddress();
  const schemaRegistryImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    schemaRegistryProxyAddress,
  );

  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    await run("verify:verify", {
      address: schemaRegistryProxyAddress,
    });
  } catch (e) {
    console.log("Verification failed for SchemaRegistry");
  }

  console.log(`SchemaRegistry successfully deployed and verified!`);
  console.log(`Proxy is at ${schemaRegistryProxyAddress}`);
  console.log(`Implementation is at ${schemaRegistryImplementationAddress}`);

  console.log(`\n----\n`);

  console.log("Updating Router with the registries addresses...");
  await router.updateAttestationRegistry(attestationRegistryProxyAddress);
  await router.updateModuleRegistry(moduleRegistryProxyAddress);
  await router.updatePortalRegistry(portalRegistryProxyAddress);
  await router.updateSchemaRegistry(schemaRegistryProxyAddress);
  console.log("Router updated with the registries addresses!");

  console.log(`\n----\n`);

  console.log(`** SUMMARY **`);
  console.log(`Router = ${routerProxyAddress}`);
  console.log(`AttestationRegistry = ${attestationRegistryProxyAddress}`);
  console.log(`ModuleRegistry = ${moduleRegistryProxyAddress}`);
  console.log(`PortalRegistry = ${portalRegistryProxyAddress}`);
  console.log(`SchemaRegistry = ${schemaRegistryProxyAddress}`);

  console.log(`END SCRIPT`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
