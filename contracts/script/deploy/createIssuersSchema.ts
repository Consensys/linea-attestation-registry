import { ethers } from "hardhat";
import dotenv from "dotenv";
import { SchemaRegistry } from "../../typechain-types";

dotenv.config({ path: "../.env" });

async function main() {
  const proxyAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";
  console.log(`Creating issuers Schemas using the SchemaRegistry at ${proxyAddress}`);
  const schemaRegistry: SchemaRegistry = await ethers.getContractAt("SchemaRegistry", proxyAddress);

  await createSchema(
    schemaRegistry,
    "Issuers",
    "Creates a issuers schema for Explorer listing",
    "https://schema.org/Property",
    "string name, string description, string logoURL, string[] keywords, string CTATitle, string CTALink",
  );
}

async function createSchema(
  schemaRegistry: SchemaRegistry,
  schemaName: string,
  schemaDescription: string,
  schemaContext: string,
  schemaString: string,
) {
  const schemaId = await schemaRegistry.getIdFromSchemaString(schemaString);
  const schemaExists = await schemaRegistry.isRegistered(schemaId);

  if (!schemaExists) {
    const tx = await schemaRegistry.createSchema(schemaName, schemaDescription, schemaContext, schemaString);
    await tx.wait();
    const schemaCreated = await schemaRegistry.isRegistered(schemaId);

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
