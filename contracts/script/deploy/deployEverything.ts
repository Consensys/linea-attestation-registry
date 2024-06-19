import { ethers, run, upgrades } from "hardhat";
import dotenv from "dotenv";
import { getNetworkConfig } from "../utils";

dotenv.config({ path: "../.env" });

async function main() {
  console.log(`START SCRIPT`);

  const easRegistryAddress = process.env.EAS_REGISTRY_ADDRESS;
  if (!easRegistryAddress) {
    throw new Error("EAS address not found");
  }

  const network = await ethers.provider.getNetwork();
  const networkConfig = getNetworkConfig(network.chainId);
  console.log(
    `Chain prefix for chain ID ${network.chainId} is ${networkConfig.chainPrefix} (${
      networkConfig.isTestnet ? "testnet" : "mainnet"
    })`,
  );

  console.log("Deploying Router...");
  let router;
  let routerProxyAddress;
  try {
    const Router = await ethers.getContractFactory("Router");
    router = await upgrades.deployProxy(Router, {
      timeout: 20000,
      txOverrides: { gasLimit: 10000000n, gasPrice: 1000000000n },
    });
    await router.waitForDeployment();
    routerProxyAddress = await router.getAddress();

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds

    await run("verify:verify", {
      address: routerProxyAddress,
    });

    console.log(`Router successfully deployed and verified!`);
    console.log(`Proxy is at ${routerProxyAddress}`);
  } catch (e) {
    console.log(`Error deploying Router: ${e}`);
  }

  console.log(`\n----\n`);

  console.log("Deploying AttestationRegistry...");
  let attestationRegistry;
  let attestationRegistryProxyAddress;
  try {
    const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
    attestationRegistry = await upgrades.deployProxy(AttestationRegistry, {
      timeout: 20000,
      txOverrides: { gasLimit: 10000000n, gasPrice: 1000000000n },
    });
    await attestationRegistry.waitForDeployment();
    attestationRegistryProxyAddress = await attestationRegistry.getAddress();

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds

    await run("verify:verify", {
      address: attestationRegistryProxyAddress,
    });

    console.log(`AttestationRegistry successfully deployed and verified!`);
    console.log(`Proxy is at ${attestationRegistryProxyAddress}`);
  } catch (e) {
    console.log(`Error deploying Router: ${e}`);
  }
  console.log(`\n----\n`);

  console.log("Deploying ModuleRegistry...");
  let moduleRegistry;
  let moduleRegistryProxyAddress;
  try {
    const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
    moduleRegistry = await upgrades.deployProxy(ModuleRegistry, {
      timeout: 20000,
      txOverrides: { gasLimit: 10000000n, gasPrice: 1000000000n },
    });
    await moduleRegistry.waitForDeployment();
    moduleRegistryProxyAddress = await moduleRegistry.getAddress();

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds

    await run("verify:verify", {
      address: moduleRegistryProxyAddress,
    });

    console.log(`ModuleRegistry successfully deployed and verified!`);
    console.log(`Proxy is at ${moduleRegistryProxyAddress}`);
  } catch (e) {
    console.log(`Error deploying Router: ${e}`);
  }

  console.log(`\n----\n`);

  console.log("Deploying PortalRegistry...");
  let portalRegistry;
  let portalRegistryProxyAddress;
  try {
    const PortalRegistry = await ethers.getContractFactory("PortalRegistry");
    portalRegistry = await upgrades.deployProxy(PortalRegistry, {
      timeout: 20000,
      txOverrides: { gasLimit: 10000000n, gasPrice: 1000000000n },
    });
    await portalRegistry.waitForDeployment();
    portalRegistryProxyAddress = await portalRegistry.getAddress();

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds

    await run("verify:verify", {
      address: portalRegistryProxyAddress,
    });

    console.log(`PortalRegistry successfully deployed and verified!`);
    console.log(`Proxy is at ${portalRegistryProxyAddress}`);
  } catch (e) {
    console.log(`Error deploying Router: ${e}`);
  }

  console.log(`\n----\n`);

  console.log("Deploying SchemaRegistry...");
  let schemaRegistry;
  let schemaRegistryProxyAddress;
  try {
    const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
    schemaRegistry = await upgrades.deployProxy(SchemaRegistry, {
      timeout: 20000,
      txOverrides: { gasLimit: 10000000n, gasPrice: 1000000000n },
    });
    await schemaRegistry.waitForDeployment();
    schemaRegistryProxyAddress = await schemaRegistry.getAddress();

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds

    await run("verify:verify", {
      address: schemaRegistryProxyAddress,
    });

    console.log(`SchemaRegistry successfully deployed and verified!`);
    console.log(`Proxy is at ${schemaRegistryProxyAddress}`);
  } catch (e) {
    console.log(`Error deploying Router: ${e}`);
  }
  console.log(`\n----\n`);

  if (!router || !attestationRegistry || !moduleRegistry || !portalRegistry || !schemaRegistry) {
    console.log("Some contracts failed to deploy. Exiting script...");
    return;
  }

  console.log("Updating Router with the registries addresses...");
  await router.updateAttestationRegistry(attestationRegistryProxyAddress);
  await router.updateModuleRegistry(moduleRegistryProxyAddress);
  await router.updatePortalRegistry(portalRegistryProxyAddress);
  await router.updateSchemaRegistry(schemaRegistryProxyAddress);
  console.log("Router updated with the registries addresses!");

  console.log(`\n----\n`);

  console.log(`Updating registries with the Router address...`);

  console.log("Updating AttestationRegistry with the Router address...");
  await attestationRegistry.updateRouter(routerProxyAddress);
  console.log("AttestationRegistry updated!");

  console.log("Updating AttestationRegistry with the chain prefix...");
  await attestationRegistry.updateChainPrefix(networkConfig.chainPrefix);
  console.log("AttestationRegistry updated!");

  console.log("Updating ModuleRegistry with the Router address...");
  await moduleRegistry.updateRouter(routerProxyAddress);
  console.log("ModuleRegistry updated!");

  console.log("Updating PortalRegistry with the Router address...");
  await portalRegistry.updateRouter(routerProxyAddress);
  console.log("PortalRegistry updated!");

  console.log("Updating SchemaRegistry with the Router address...");
  await schemaRegistry.updateRouter(routerProxyAddress);
  console.log("SchemaRegistry updated!");

  console.log("Registries updated with the Router address!");

  console.log(`\n----\n`);

  if (!router || !attestationRegistry || !moduleRegistry || !portalRegistry || !schemaRegistry) {
    console.log("Some contracts failed to deploy. Exiting script...");
    return;
  }

  console.log("Updating Router with the registries addresses...");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Updating Router with attestationRegistryProxyAddress");
  await router.updateAttestationRegistry(attestationRegistryProxyAddress);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Updating Router with moduleRegistryProxyAddress");
  await router.updateModuleRegistry(moduleRegistryProxyAddress);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Updating Router with portalRegistryProxyAddress");
  await router.updatePortalRegistry(portalRegistryProxyAddress);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Updating Router with schemaRegistryProxyAddress");
  await router.updateSchemaRegistry(schemaRegistryProxyAddress);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("Router updated with the registries addresses!");

  console.log(`\n----\n`);

  console.log(`Updating registries with the Router address...`);

  console.log("Updating AttestationRegistry with the Router address...");
  await attestationRegistry.updateRouter(routerProxyAddress);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("AttestationRegistry updated!");

  console.log("Updating AttestationRegistry with the chain prefix...");
  await attestationRegistry.updateChainPrefix(networkConfig.chainPrefix);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("AttestationRegistry updated!");

  console.log("Updating ModuleRegistry with the Router address...");
  await moduleRegistry.updateRouter(routerProxyAddress);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("ModuleRegistry updated!");

  console.log("Updating PortalRegistry with the Router address...");
  await portalRegistry.updateRouter(routerProxyAddress);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("PortalRegistry updated!");

  console.log("Updating SchemaRegistry with the Router address...");
  await schemaRegistry.updateRouter(routerProxyAddress);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log("SchemaRegistry updated!");

  console.log("Registries updated with the Router address!");

  console.log(`\n----\n`);

  console.log(`** SUMMARY **`);
  console.log(`Router = ${routerProxyAddress}`);
  console.log(`AttestationRegistry = ${attestationRegistryProxyAddress}`);
  console.log(`ModuleRegistry = ${moduleRegistryProxyAddress}`);
  console.log(`PortalRegistry = ${portalRegistryProxyAddress}`);
  console.log(`SchemaRegistry = ${schemaRegistryProxyAddress}`);

  console.log(`\n----\n`);

  console.log(`** SUMMARY **`);
  console.log(`Router = ${routerProxyAddress}`);
  console.log(`AttestationRegistry = ${attestationRegistryProxyAddress}`);
  console.log(`ModuleRegistry = ${moduleRegistryProxyAddress}`);
  console.log(`PortalRegistry = ${portalRegistryProxyAddress}`);
  console.log(`SchemaRegistry = ${schemaRegistryProxyAddress}`);
  console.log(`AttestationReader = ${attestationReaderProxyAddress}`);

  console.log(`END SCRIPT`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
