import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying CorrectModule...");
  const CorrectModule = await ethers.getContractFactory("CorrectModule");
  const correctModule = await CorrectModule.deploy();
  await correctModule.waitForDeployment();
  const correctModuleAddress = await correctModule.getAddress();

  await run("verify:verify", {
    address: correctModuleAddress,
  });

  console.log(`CorrectModule successfully deployed and verified!`);
  console.log(`CorrectModule is at ${correctModuleAddress}`);

  console.log(`\n----\n`);

  console.log("Deploying DefaultPortal...");

  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");
  const portalRegistry = await PortalRegistry.attach("0x83eEAA59D6d707d3044a7CB47E865c5Bf7375dB5");

  const defaultPortalAddress = await portalRegistry.deployDefaultPortal(
    [correctModuleAddress],
    "Default Portal",
    "Default Portal to issue standard attestations",
    false,
    "Consensys",
  );

  await run("verify:verify", {
    address: defaultPortalAddress,
  });

  console.log(`DefaultPortal successfully deployed, registered and verified!`);
  console.log(`DefaultPortal is at ${defaultPortalAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
