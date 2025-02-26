import fs from "fs";
import path from "path";

const configPath = path.join(__dirname, "../config/linea-testnet.json");
const subgraphPath = path.join(__dirname, "../subgraph.yaml");

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
let subgraphYaml = fs.readFileSync(subgraphPath, "utf8");

// Replace placeholders with actual addresses
subgraphYaml = subgraphYaml
  .replace("0x0123456789abcdef0123456789abcdef01234567", config.schemaRegistry)
  .replace("0x0123456789abcdef0123456789abcdef01234568", config.moduleRegistry)
  .replace("0x0123456789abcdef0123456789abcdef01234569", config.attestationRegistry)
  .replace("0x0123456789abcdef0123456789abcdef01234570", config.attestationReader);

fs.writeFileSync(subgraphPath, subgraphYaml);
