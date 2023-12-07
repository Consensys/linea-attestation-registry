import { ethers } from "hardhat";
import dotenv from "dotenv";
import { SchemaRegistry } from "../../typechain-types";
import { AddressLike, EventLog } from "ethers";

dotenv.config({ path: "../.env" });

async function main() {
  console.log(`START ISSUERS SCRIPT`);

  const portalRegistryAddress = process.env.PORTAL_REGISTRY_ADDRESS ?? "";
  const moduleRegistryAddress = process.env.MODULE_REGISTRY_ADDRESS ?? "";
  const schemaRegistryAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";

  console.log(`Creating issuers Schema using the SchemaRegistry at ${schemaRegistryAddress}`);
  const schemaRegistry: SchemaRegistry = await ethers.getContractAt("SchemaRegistry", schemaRegistryAddress);
  await createSchema(
    schemaRegistry,
    "Issuer",
    "Describes an Issuer for the Verax Attestation Registry",
    "https://schema.org/Property",
    "(string name, string description, string logoURL, string[] keywords, string CTATitle, string CTALink)",
  );

  console.log(`----\n`);

  console.log("Deploying SenderModule...");
  const senderModule = await ethers.deployContract("SenderModule", [portalRegistryAddress]);
  await senderModule.waitForDeployment();
  const senderModuleAddress = await senderModule.getAddress();
  console.log(`SenderModule successfully deployed!`);
  console.log(`SenderModule is at ${senderModuleAddress}`);

  console.log(`----\n`);

  console.log("Registering SenderModule...");
  const moduleRegistry = await ethers.getContractAt("ModuleRegistry", moduleRegistryAddress);
  const txSenderModule = await moduleRegistry.register(
    "Sender Module",
    "This Module checks if the transaction sender is authorized for a specific Portal",
    senderModuleAddress,
  );
  txSenderModule.wait();
  console.log(`SenderModule successfully registered!`);

  console.log(`----\n`);

  console.log("Deploying IssuersModule...");
  const issuersModule = await ethers.deployContract("IssuersModule", [portalRegistryAddress]);
  await issuersModule.waitForDeployment();
  const issuersModuleAddress = await issuersModule.getAddress();
  console.log(`IssuersModule successfully deployed!`);
  console.log(`IssuersModule is at ${issuersModuleAddress}`);

  console.log(`----\n`);

  console.log("Registering IssuersModule...");
  const txIssuersModule = await moduleRegistry.register(
    "Issuers Module",
    "This Modules checks if the subject of an Attestation is registered as an Issuer",
    issuersModuleAddress,
  );
  txIssuersModule.wait();
  console.log(`IssuersModule successfully registered!`);

  console.log(`----\n`);

  console.log("Deploying Issuers Portal...");
  const portalRegistry = await ethers.getContractAt("PortalRegistry", portalRegistryAddress);
  const deploymentTx = await portalRegistry.deployDefaultPortal(
    [senderModuleAddress, issuersModuleAddress] as AddressLike[],
    "Issuers Portal",
    "Portal of Issuers",
    true,
    "Verax",
  );

  const txReceipt = await deploymentTx.wait();

  const portalRegisteredEvent = txReceipt?.logs?.filter((log) => {
    return log instanceof EventLog && log.eventName == "PortalRegistered";
  });

  const issuersPortalAddress = portalRegisteredEvent?.[0].topics[3];

  if (!issuersPortalAddress) {
    throw new Error("Issuers Portal deployment failed!");
  }

  console.log(`IssuersPortal successfully deployed at ${issuersPortalAddress}`);

  console.log(`----\n`);

  console.log("Add Verax as an authorized sender...");
  const senderModuleContract = await ethers.getContractAt("SenderModule", senderModuleAddress);
  const txSenderModuleAuthorize = await senderModuleContract.setAuthorizedSenders(
    issuersPortalAddress,
    [(await ethers.getSigners())[0]],
    [true],
  );
  txSenderModuleAuthorize.wait();
  console.log(`Verax added as an authorized sender for the IssuersPortal!`);

  console.log(`----\n`);

  console.log(`** SUMMARY **`);
  console.log(`SenderModule = ${senderModuleAddress}`);
  console.log(`IssuersModule = ${issuersModuleAddress}`);
  console.log(`IssuersPortal = ${issuersPortalAddress}`);

  console.log(`END ISSUERS SCRIPT`);
}

async function createSchema(
  schemaRegistry: SchemaRegistry,
  schemaName: string,
  schemaDescription: string,
  schemaContext: string,
  schemaString: string,
) {
  console.log("Creating Schema...");
  const schemaId = await schemaRegistry.getIdFromSchemaString(schemaString);
  const schemaExists = await schemaRegistry.isRegistered(schemaId);

  console.log(`schemaExists = ${schemaExists}`);

  if (!schemaExists) {
    const tx = await schemaRegistry.createSchema(schemaName, schemaDescription, schemaContext, schemaString);
    console.log("tx", tx);
    await tx.wait();
    const schemaCreated = await schemaRegistry.isRegistered(schemaId);
    console.log("schemaCreated", schemaCreated);

    if (schemaCreated) {
      console.log(`Schema "${schemaName}" successfully created with ID ${schemaId}`);
    } else {
      throw new Error(`Schema "${schemaName}" creation failed!`);
    }
  } else {
    throw new Error(`Schema "${schemaName}" already exists with ID ${schemaId}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
