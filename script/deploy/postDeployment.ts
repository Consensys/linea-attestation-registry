import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  const proxyAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";
  console.log("Creating relationship schema using schema registry, with proxy at", proxyAddress);
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");
  const schemaRegistry = SchemaRegistry.attach(proxyAddress);
  await createSchema(schemaRegistry, 
      "Relationship", 
      "Creates a named relationship between two attestations", 
      "https://schema.org/Property", 
      "bytes32 subject, string predicate, bytes32 object");
  await createSchema(schemaRegistry, 
      "namedGraphRelationship", 
      "Creates a named relationship between two attestations inside a specific named graph", 
      "https://schema.org/Property", 
      "string namedGraph, bytes32 subject, string predicate, bytes32 object");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function createSchema(schemaRegistry, schemaName, schemaDescription, schemaContext, schemaString) {
  const schemaId = await schemaRegistry.getIdFromSchemaString(schemaString);
  const schemaExists = await schemaRegistry.isRegistered(schemaId);
  if (!schemaExists) {
    const tx = await schemaRegistry.createSchema(schemaName, schemaDescription, schemaContext, schemaString);
    await tx.wait();
    const schemaCreated = await schemaRegistry.isRegistered(schemaId);
    if (schemaCreated)
      console.log(`${schemaName} schema creation succeeded, schema id : ${schemaId}`);

    else
      console.log(`${schemaName} schema creation failed, schema id : ${schemaId}`);
  }

  else {
    console.log(`${schemaName} schema already exists, schema id : ${schemaId}`);
  }
}

