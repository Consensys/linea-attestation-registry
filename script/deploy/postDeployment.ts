import { ethers } from "hardhat";
import dotenv from "dotenv";
import { Contract } from "ethers";

dotenv.config({ path: "../.env" });

async function main() {
  const proxyAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";
  console.log("Creating relationship schema using schema registry, with proxy at", proxyAddress);
  const schemaRegistry = await ethers.getContractAt("SchemaRegistry", proxyAddress);

  await createSchema(
    schemaRegistry,
    "Relationship",
    "Creates a named relationship between two attestations",
    "https://schema.org/Property",
    "bytes32 subject, string predicate, bytes32 object",
  );
  await createSchema(
    schemaRegistry,
    "namedGraphRelationship",
    "Creates a named relationship between two attestations inside a specific named graph",
    "https://schema.org/Property",
    "string namedGraph, bytes32 subject, string predicate, bytes32 object",
  );
}

async function createSchema(
  schemaRegistry: Contract,
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
