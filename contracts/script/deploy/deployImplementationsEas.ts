import { ethers } from "hardhat";
import { verifyContract } from "../utils";

async function main() {
  console.log(`START EAS IMPLEMENTATIONS DEPLOYMENT`);

  // Get verification flag from environment variable or command line argument
  const shouldVerify = process.env.VERIFY_CONTRACTS !== "false";
  console.log(`Contract verification is ${shouldVerify ? "enabled" : "disabled"}`);

  console.log("Deploying AttestationReader implementation...");
  const AttestationReader = await ethers.getContractFactory("AttestationReader");
  const attestationReader = await AttestationReader.deploy();
  await attestationReader.waitForDeployment();
  const attestationReaderAddress = await attestationReader.getAddress();
  console.log(`AttestationReader implementation deployed at: ${attestationReaderAddress}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
  await verifyContract(attestationReaderAddress, [], shouldVerify);

  console.log(`\n----\n`);

  console.log(`** EAS IMPLEMENTATION ADDRESSES SUMMARY **`);
  console.log(`AttestationReader: ${attestationReaderAddress}`);

  console.log(`END EAS IMPLEMENTATIONS DEPLOYMENT`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
