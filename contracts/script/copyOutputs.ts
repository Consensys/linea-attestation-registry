import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: "../.env" });

async function main() {
  console.log("Copying contracts outputs...");

  const network = process.argv[2];
  if (!network) {
    throw new Error("Network argument is required");
  }

  const filesToCopy = [
    "Router.sol/Router.json",
    "PortalRegistry.sol/PortalRegistry.json",
    "SchemaRegistry.sol/SchemaRegistry.json",
    "ModuleRegistry.sol/ModuleRegistry.json",
    "AttestationRegistry.sol/AttestationRegistry.json",
    "AttestationReader.sol/AttestationReader.json",
  ];

  filesToCopy.forEach((file) => {
    const srcPath = path.join(__dirname, "../out", file);
    const destPath = path.join(__dirname, "../deployments", network, path.basename(file));
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} to ${destPath}`);
  });

  console.log("Contracts outputs copied!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
