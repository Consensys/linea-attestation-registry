import { ethers, run } from "hardhat";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

async function main() {
  console.log(`START SCRIPT`);

  console.log("Deploying Router...");
  const router = await ethers.deployContract("Router");
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();

  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    await run("verify:verify", {
      address: routerAddress,
    });
  } catch (e) {
    console.log("Verification failed for Router");
  }

  console.log(`Router successfully deployed and verified!`);
  console.log(`Implementation is at ${routerAddress}`);

  console.log(`** SUMMARY **`);
  console.log(`Router = ${routerAddress}`);

  console.log(`END SCRIPT`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
