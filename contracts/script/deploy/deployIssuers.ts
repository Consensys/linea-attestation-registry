import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  console.log(`START ISSUERS SCRIPT`);

  const portalRegistryAddress = process.env.PORTAL_REGISTRY_ADDRESS ?? "";
  const moduleRegistryAddress = process.env.MODULE_REGISTRY_ADDRESS ?? "";
  const routerAddress = process.env.ROUTER_ADDRESS;

  console.log("Deploying IssuersMoudle...");
  const issuersModule = await ethers.deployContract("IssuersModule", [portalRegistryAddress]);
  await issuersModule.waitForDeployment();
  const issuersModuleAddress = await issuersModule.getAddress();
  console.log(`IssuersModule successfully deployed!`);
  console.log(`IssuersModule is at ${issuersModuleAddress}`);
  console.log(`----\n`);

  console.log("Deploying Issuers Portal...");
  const issuersPortal = await ethers.deployContract("IssuersPortal", [[issuersModuleAddress], routerAddress]);
  await issuersPortal.waitForDeployment();
  const issuersPortalAddress = await issuersPortal.getAddress();
  console.log(`IssuersPortal successfully deployed!`);
  console.log(`IssuersPortal is at ${issuersPortalAddress}`);
  console.log(`----\n`);

  console.log(`** SUMMARY **`);
  console.log(`IssuersModule = ${issuersModuleAddress}`);
  console.log(`IssuersPortal = ${issuersPortalAddress}`);
  console.log(`----\n`);

  console.log("registering IssuersPortal...");
  const portalRegistry = await ethers.getContractAt("PortalRegistry", portalRegistryAddress);
  const txRegistryPortal = await portalRegistry.register(
    issuersPortalAddress,
    "Issuers Portal",
    "Portal of Issuers",
    true,
    "Issuer Portal owner and Issuers",
  );
  txRegistryPortal.wait();
  console.log(`register IssuersPortal success!`);
  console.log(`----\n`);

  console.log("registering IssuersModule...");
  const moduleRegistry = await ethers.getContractAt("ModuleRegistry", moduleRegistryAddress);
  const txModulePortal = await moduleRegistry.register("Issuers Module", "Module of Issuers", issuersModuleAddress);
  txModulePortal.wait();
  console.log(`register IssuersModule success!`);

  console.log(`END ISSUERS SCRIPT`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
