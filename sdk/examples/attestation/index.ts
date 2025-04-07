import { Hex } from "viem";
import { VeraxSdk } from "../../src/VeraxSdk";
import AttestationExamples from "./attestationExamples";
import { config } from "dotenv";
import * as path from "path";

const envPath = path.resolve(__dirname, "../../.env");
config({ path: envPath });

const privateKey = process.env.PRIVATE_KEY as Hex;

let argv: string | null | undefined = process.argv[3] as string;
argv !== null && argv !== undefined && argv !== "wait" ? (argv = argv.replaceAll("\\", "")) : (argv = "");

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA, undefined, privateKey);

new AttestationExamples(veraxSdk).run(argv, process.argv[2]);
