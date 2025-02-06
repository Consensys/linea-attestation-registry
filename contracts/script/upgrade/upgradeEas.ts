import { ethers, run, upgrades } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  console.log(`Upgrading EAS-related contracts...`);

  const routerProxyAddress = process.env.ROUTER_ADDRESS;
  if (!routerProxyAddress) {
    throw new Error("Router proxy address not found");
  }

  const attestationReaderProxyAddress = process.env.ATTESTATION_READER_ADDRESS;
  if (!attestationReaderProxyAddress) {
    throw new Error("Attestation reader proxy address not found");
  }

  console.log("Upgrading AttestationReader, with proxy at", attestationReaderProxyAddress);
  const AttestationReader = await ethers.getContractFactory("AttestationReader");
  await upgrades.upgradeProxy(attestationReaderProxyAddress, AttestationReader);

  console.log(`AttestationReader successfully upgraded!`);

  console.log(`\n----\n`);

  const attestationReaderImplementationAddress = await upgrades.erc1967.getImplementationAddress(
    attestationReaderProxyAddress,
  );

  try {
    await run("verify:verify", {
      address: attestationReaderProxyAddress,
    });
  } catch (e) {
    console.log(`Error verifying AttestationReader: ${e}`);
  }

  console.log(`AttestationReader successfully upgraded and verified!`);
  console.log(`Proxy is at ${attestationReaderProxyAddress}`);
  console.log(`Implementation is at ${attestationReaderImplementationAddress}`);

  console.log(`\n----\n`);

  console.log(`** SUMMARY **`);
  console.log(`Router = ${routerProxyAddress}`);
  console.log(`AttestationReader = ${attestationReaderProxyAddress}`);

  console.log(`EAS-related contracts were upgraded!`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
