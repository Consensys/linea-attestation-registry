import { ethers, run } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  console.log(`Deploying Standard Library...`);

  const portalRegistryAddress = process.env.PORTAL_REGISTRY_ADDRESS;
  const attestationRegistryAddress = process.env.ATTESTATION_REGISTRY_ADDRESS;
  const moduleRegistryAddress = process.env.MODULE_REGISTRY_ADDRESS;

  if (!portalRegistryAddress) {
    throw new Error("PortalRegistry address not found");
  }

  if (!attestationRegistryAddress) {
    throw new Error("PortalRegistry address not found");
  }

  if (!moduleRegistryAddress) {
    throw new Error("PortalRegistry address not found");
  }

  console.log("Deploying ECDSAModule...");
  const ECDSAModule = await ethers.getContractFactory("ECDSAModuleV2");
  const ecdsaModule = await ECDSAModule.deploy(portalRegistryAddress);
  await ecdsaModule.waitForDeployment();
  const ecdsaModuleAddress = await ecdsaModule.getAddress();
  console.log(`ECDSAModule deployed to: ${ecdsaModuleAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying ERC1271Module...");
  const ERC1271Module = await ethers.getContractFactory("ERC1271ModuleV2");
  const erc1271Module = await ERC1271Module.deploy(portalRegistryAddress);
  await erc1271Module.waitForDeployment();
  const erc1271ModuleAddress = await erc1271Module.getAddress();
  console.log(`ERC1271Module deployed to: ${erc1271ModuleAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying FeeModule...");
  const FeeModule = await ethers.getContractFactory("FeeModuleV2");
  const feeModule = await FeeModule.deploy(portalRegistryAddress);
  await feeModule.waitForDeployment();
  const feeModuleAddress = await feeModule.getAddress();
  console.log(`FeeModule deployed to: ${feeModuleAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying IndexerModule...");
  const IndexerModule = await ethers.getContractFactory("IndexerModuleV2");
  const indexerModule = await IndexerModule.deploy(attestationRegistryAddress, portalRegistryAddress);
  await indexerModule.waitForDeployment();
  const indexerModuleAddress = await indexerModule.getAddress();
  console.log(`IndexerModule deployed to: ${indexerModuleAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying IssuersModule...");
  const IssuersModule = await ethers.getContractFactory("IssuersModuleV2");
  const issuersModule = await IssuersModule.deploy(portalRegistryAddress);
  await issuersModule.waitForDeployment();
  const issuersModuleAddress = await issuersModule.getAddress();
  console.log(`IssuersModule deployed to: ${issuersModuleAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying SchemaModule...");
  const SchemaModule = await ethers.getContractFactory("SchemaModuleV2");
  const schemaModule = await SchemaModule.deploy(portalRegistryAddress);
  await schemaModule.waitForDeployment();
  const schemaModuleAddress = await schemaModule.getAddress();
  console.log(`SchemaModule deployed to: ${schemaModuleAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying SenderModule...");
  const SenderModule = await ethers.getContractFactory("SenderModuleV2");
  const senderModule = await SenderModule.deploy(portalRegistryAddress);
  await senderModule.waitForDeployment();
  const senderModuleAddress = await senderModule.getAddress();
  console.log(`SenderModule deployed to: ${senderModuleAddress}`);

  console.log(`\n----\n`);

  console.log("ALL MODULES DEPLOYED!");

  console.log(`\n----\n`);

  console.log("Verifying modules...");

  await run("verify:verify", {
    address: ecdsaModuleAddress,
    constructorArguments: [portalRegistryAddress],
  });

  await run("verify:verify", {
    address: erc1271ModuleAddress,
    constructorArguments: [portalRegistryAddress],
  });

  await run("verify:verify", {
    address: feeModuleAddress,
    constructorArguments: [portalRegistryAddress],
  });

  await run("verify:verify", {
    address: indexerModuleAddress,
    constructorArguments: [attestationRegistryAddress, portalRegistryAddress],
  });

  await run("verify:verify", {
    address: issuersModuleAddress,
    constructorArguments: [portalRegistryAddress],
  });

  await run("verify:verify", {
    address: schemaModuleAddress,
    constructorArguments: [portalRegistryAddress],
  });

  await run("verify:verify", {
    address: senderModuleAddress,
    constructorArguments: [portalRegistryAddress],
  });

  console.log("ALL MODULES VERIFIED!");

  console.log(`\n----\n`);

  console.log("Registering modules on the ModuleRegistry...");
  const moduleRegistry = await ethers.getContractAt("ModuleRegistry", moduleRegistryAddress);

  const registerECDSAModule = await moduleRegistry.register(
    "ECDSAModule",
    "A standard library module deployed by Verax, allowing ECDSA signature verification",
    ecdsaModuleAddress,
  );
  await registerECDSAModule.wait();
  console.log("ECDSAModule registered");

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

  const registerIssuersModule = await moduleRegistry.register(
    "IssuersModule",
    "A standard library module deployed by Verax, allowing to attest Issuers",
    issuersModuleAddress,
  );
  await registerIssuersModule.wait();
  console.log("IssuersModule registered");

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

  console.log("Standard Library of Modules deployed and registered!");
  console.log("ECDSAModule: " + ecdsaModuleAddress);
  console.log("ERC1271Module: " + erc1271ModuleAddress);
  console.log("FeeModule: " + feeModuleAddress);
  console.log("IndexerModule: " + indexerModuleAddress);
  console.log("IssuersModule: " + issuersModuleAddress);
  console.log("SchemaModule: " + schemaModuleAddress);
  console.log("SenderModule: " + senderModuleAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
