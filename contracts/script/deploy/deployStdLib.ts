import { ethers, run } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const PORTAL_REGISTRY_ADDRESS = process.env.PORTAL_REGISTRY_ADDRESS ?? "";
const MODULE_REGISTRY_ADDRESS = process.env.MODULE_REGISTRY_ADDRESS ?? "";

async function main() {
  console.log(`START SCRIPT`);

  console.log("Deploying ECDSAModule...");
  const ECDSAModule = await ethers.getContractFactory("ECDSAModule");
  const ecdsaModule = await ECDSAModule.deploy(PORTAL_REGISTRY_ADDRESS);
  await ecdsaModule.waitForDeployment();
  const ecdsaModuleAddress = await ecdsaModule.getAddress();
  console.log(`ECDSAModule deployed to: ${ecdsaModuleAddress}`);
  await run("verify:verify", {
    address: ecdsaModuleAddress,
    constructorArguments: [PORTAL_REGISTRY_ADDRESS],
  });

  console.log(`\n----\n`);

  console.log("Deploying ERC1271Module...");
  const ERC1271Module = await ethers.getContractFactory("ERC1271Module");
  const erc1271Module = await ERC1271Module.deploy(PORTAL_REGISTRY_ADDRESS);
  await erc1271Module.waitForDeployment();
  const erc1271ModuleAddress = await erc1271Module.getAddress();
  console.log(`ERC1271Module deployed to: ${erc1271ModuleAddress}`);
  await run("verify:verify", {
    address: erc1271ModuleAddress,
    constructorArguments: [PORTAL_REGISTRY_ADDRESS],
  });

  console.log(`\n----\n`);

  console.log("Deploying FeeModule...");
  const FeeModule = await ethers.getContractFactory("FeeModule");
  const feeModule = await FeeModule.deploy(PORTAL_REGISTRY_ADDRESS);
  await feeModule.waitForDeployment();
  const feeModuleAddress = await feeModule.getAddress();
  console.log(`FeeModule deployed to: ${feeModuleAddress}`);
  await run("verify:verify", {
    address: feeModuleAddress,
    constructorArguments: [PORTAL_REGISTRY_ADDRESS],
  });

  console.log(`\n----\n`);

  console.log("Deploying IndexerModule...");
  const IndexerModule = await ethers.getContractFactory("IndexerModule");
  const indexerModule = await IndexerModule.deploy(PORTAL_REGISTRY_ADDRESS);
  await indexerModule.waitForDeployment();
  const indexerModuleAddress = await indexerModule.getAddress();
  console.log(`IndexerModule deployed to: ${indexerModuleAddress}`);
  await run("verify:verify", {
    address: indexerModuleAddress,
    constructorArguments: [PORTAL_REGISTRY_ADDRESS],
  });

  console.log(`\n----\n`);

  console.log("Deploying SchemaModule...");
  const SchemaModule = await ethers.getContractFactory("SchemaModule");
  const schemaModule = await SchemaModule.deploy(PORTAL_REGISTRY_ADDRESS);
  await schemaModule.waitForDeployment();
  const schemaModuleAddress = await schemaModule.getAddress();
  console.log(`SchemaModule deployed to: ${schemaModuleAddress}`);
  await run("verify:verify", {
    address: schemaModuleAddress,
    constructorArguments: [PORTAL_REGISTRY_ADDRESS],
  });

  console.log(`\n----\n`);

  console.log("Deploying SenderModule...");
  const SenderModule = await ethers.getContractFactory("SenderModule");
  const senderModule = await SenderModule.deploy(PORTAL_REGISTRY_ADDRESS);
  await senderModule.waitForDeployment();
  const senderModuleAddress = await senderModule.getAddress();
  console.log(`SenderModule deployed to: ${senderModuleAddress}`);
  await run("verify:verify", {
    address: senderModuleAddress,
    constructorArguments: [PORTAL_REGISTRY_ADDRESS],
  });

  console.log(`\n----\n`);

  console.log("ALL MODULES DEPLOYED!");

  console.log(`\n----\n`);

  console.log("Registering modules on the ModuleRegistry...");
  const moduleRegistry = await ethers.getContractAt("ModuleRegistry", MODULE_REGISTRY_ADDRESS);

  const registerECDSAModule = await moduleRegistry.register(
    "ECDSAModule",
    "A standard library module deployed by Verax, allowing ECDSA signature verification",
    ecdsaModuleAddress,
  );
  await registerECDSAModule.wait();
  console.log("ECDSAModule registered");

  // Continue from your existing code
  const registerERC1271Module = await moduleRegistry.register(
    "ERC1271Module",
    "A standard library module deployed by Verax, allowing ERC1271 signature verification",
    erc1271ModuleAddress,
  );
  await registerERC1271Module.wait();
  console.log("ERC1271Module registered");

  const registerFeeModule = await moduleRegistry.register(
    "FeeModule",
    "A standard library module deployed by Verax, allowing attestation fees",
    feeModuleAddress,
  );
  await registerFeeModule.wait();
  console.log("FeeModule registered");

  const registerIndexerModule = await moduleRegistry.register(
    "IndexerModule",
    "A standard library module deployed by Verax, indexing attestations",
    indexerModuleAddress,
  );
  await registerIndexerModule.wait();
  console.log("IndexerModule registered");

  const registerSchemaModule = await moduleRegistry.register(
    "SchemaModule",
    "A standard library module deployed by Verax, checking attestation schemas",
    schemaModuleAddress,
  );
  await registerSchemaModule.wait();
  console.log("SchemaModule registered");

  const registerSenderModule = await moduleRegistry.register(
    "SenderModule",
    "A standard library module deployed by Verax, checking attestation senders",
    senderModuleAddress,
  );
  await registerSenderModule.wait();
  console.log("SenderModule registered");

  console.log("ALL MODULES REGISTERED!");

  console.log("Module Addresses:");
  console.log("ECDSAModule: " + ecdsaModuleAddress);
  console.log("ERC1271Module: " + erc1271ModuleAddress);
  console.log("FeeModule: " + feeModuleAddress);
  console.log("IndexerModule: " + indexerModuleAddress);
  console.log("SchemaModule: " + schemaModuleAddress);
  console.log("SenderModule: " + senderModuleAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
