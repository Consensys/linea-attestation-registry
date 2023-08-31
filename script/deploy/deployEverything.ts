import { ethers, run, upgrades } from "hardhat";

async function main() {
  console.log(`START SCRIPT`);

  console.log("Deploying Router...");
  const Router = await ethers.getContractFactory("Router");
  const router = await upgrades.deployProxy(Router);
  await router.waitForDeployment();
  const routerProxyAddress = await router.getAddress();
  const routerImplementationAddress = await upgrades.erc1967.getImplementationAddress(routerProxyAddress);

  await run("verify:verify", {
    address: routerProxyAddress,
  });

  console.log(`Router successfully deployed and verified!`);
  console.log(`Proxy is at ${routerProxyAddress}`);
  console.log(`Implementation is at ${routerImplementationAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying AttestationRegistry...");
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
  const attestationRegistry = await upgrades.deployProxy(AttestationRegistry);
  await attestationRegistry.waitForDeployment();
  const attestationRegistryProxyAddress = await attestationRegistry.getAddress();
  const attestationRegistryImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    attestationRegistryProxyAddress,
  );

  await run("verify:verify", {
    address: attestationRegistryProxyAddress,
  });

  console.log(`AttestationRegistry successfully deployed and verified!`);
  console.log(`Proxy is at ${attestationRegistryProxyAddress}`);
  console.log(`Implementation is at ${attestationRegistryImplementationAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying ModuleRegistry...");
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");
  const moduleRegistry = await upgrades.deployProxy(ModuleRegistry);
  await moduleRegistry.waitForDeployment();
  const moduleRegistryProxyAddress = await moduleRegistry.getAddress();
  const moduleRegistryImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    moduleRegistryProxyAddress,
  );

  await run("verify:verify", {
    address: moduleRegistryProxyAddress,
  });

  console.log(`ModuleRegistry successfully deployed and verified!`);
  console.log(`Proxy is at ${moduleRegistryProxyAddress}`);
  console.log(`Implementation is at ${moduleRegistryImplementationAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying PortalRegistry...");
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");
  const portalRegistry = await upgrades.deployProxy(PortalRegistry);
  await portalRegistry.waitForDeployment();
  const portalRegistryProxyAddress = await portalRegistry.getAddress();
  const portalRegistryImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    portalRegistryProxyAddress,
  );

  await run("verify:verify", {
    address: portalRegistryProxyAddress,
  });

  console.log(`PortalRegistry successfully deployed and verified!`);
  console.log(`Proxy is at ${portalRegistryProxyAddress}`);
  console.log(`Implementation is at ${portalRegistryImplementationAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying SchemaRegistry...");
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  const schemaRegistry = await upgrades.deployProxy(SchemaRegistry);
  await schemaRegistry.waitForDeployment();
  const schemaRegistryProxyAddress = await schemaRegistry.getAddress();
  const schemaRegistryImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    schemaRegistryProxyAddress,
  );

  await run("verify:verify", {
    address: schemaRegistryProxyAddress,
  });

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

  console.log(`Updating registries with the Router address...`);

  console.log("Updating AttestationRegistry with the Router address...");
  await attestationRegistry.updateRouter(routerProxyAddress);
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

  console.log("Deploying EASPortal...");
  const EASPortal = await ethers.getContractFactory("EASPortal");
  const easPortal = await EASPortal.deploy();
  await easPortal.waitForDeployment();
  const easPortalAddress = await easPortal.getAddress();

  await run("verify:verify", {
    address: easPortalAddress,
  });

  console.log(`EASPortal successfully deployed and verified!`);
  console.log(`EASPortal is at ${easPortalAddress}`);

  console.log(`\n----\n`);

  console.log(`** SUMMARY **`);
  console.log(`Router = ${routerProxyAddress}`);
  console.log(`AttestationRegistry = ${attestationRegistryProxyAddress}`);
  console.log(`ModuleRegistry = ${moduleRegistryProxyAddress}`);
  console.log(`PortalRegistry = ${portalRegistryProxyAddress}`);
  console.log(`SchemaRegistry = ${schemaRegistryProxyAddress}`);
  console.log(`EASPortal = ${easPortalAddress}`);

  console.log(`END SCRIPT`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
