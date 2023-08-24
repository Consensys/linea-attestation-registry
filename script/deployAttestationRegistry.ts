import { ethers, run, upgrades } from "hardhat";

async function main() {
  console.log("Deploying AttestationRegistry...");
  const portalRegistryAddress = process.env.PORTAL_REGISTRY_ADDRESS ?? "";
  const schemaRegistryAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");
  const attestationRegistry = await upgrades.deployProxy(AttestationRegistry, [
    portalRegistryAddress,
    schemaRegistryAddress,
  ]);
  await attestationRegistry.waitForDeployment();
  const proxyAddress = await attestationRegistry.getAddress();
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

  await run("verify:verify", {
    address: proxyAddress,
  });

  console.log(`AttestationRegistry successfully deployed and verified!`);
  console.log(`Proxy is at ${proxyAddress}`);
  console.log(`Implementation is at ${implementationAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
