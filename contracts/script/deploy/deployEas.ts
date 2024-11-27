import { ethers, run, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  console.log(`START SCRIPT`);

  const easRegistryAddress = process.env.EAS_REGISTRY_ADDRESS;
  if (!easRegistryAddress) {
    throw new Error("EAS address not found");
  }

  const routerProxyAddress = process.env.ROUTER_ADDRESS;
  if (!routerProxyAddress) {
    throw new Error("Router proxy address not found");
  }

  console.log(`\n----\n`);

  console.log("Deploying AttestationReader...");
  const AttestationReader = await ethers.getContractFactory("AttestationReader");
  const attestationReader = await upgrades.deployProxy(AttestationReader);
  await attestationReader.waitForDeployment();
  const attestationReaderProxyAddress = await attestationReader.getAddress();
  const attestationReaderImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    attestationReaderProxyAddress,
  );

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await run("verify:verify", {
    address: attestationReaderProxyAddress,
  });

  console.log(`AttestationReader successfully deployed and verified!`);
  console.log(`Proxy is at ${attestationReaderProxyAddress}`);
  console.log(`Implementation is at ${attestationReaderImplementationAddress}`);

  console.log(`\n----\n`);

  console.log("Updating AttestationReader with the Router address...");
  await attestationReader.updateRouter(routerProxyAddress);
  console.log("AttestationReader updated with router address!");

  console.log("Updating AttestationReader with the EAS Registry address...");
  await attestationReader.updateEASRegistryAddress(easRegistryAddress);
  console.log("AttestationReader updated with EAS registry address!");

  console.log(`\n----\n`);

  console.log(`** SUMMARY **`);
  console.log(`AttestationReader = ${attestationReaderProxyAddress}`);

  console.log(`END SCRIPT`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
