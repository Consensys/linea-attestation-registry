import { Hex } from "viem";
import { VeraxSdk } from "../../src/VeraxSdk";
import PortalExamples from "./schemaExamples";
import { config } from "dotenv";
import * as path from "path";

const envPath = path.resolve(__dirname, "../../.env");
config({ path: envPath });

const privateKey = process.env.PRIVATE_KEY as Hex;

let argv: string | null | undefined = process.argv[3] as string;
argv !== null && argv !== undefined && argv !== "wait" ? (argv = argv.replaceAll("\\", "")) : (argv = "");

const waitForConfirmationArgv: string | null | undefined = process.argv[4] as string;
let waitForConfirmation = false;
if ((argv === "" && (process.argv[3] as string) === "wait") || waitForConfirmationArgv === "wait")
  waitForConfirmation = true;

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET, undefined, privateKey);

new PortalExamples(veraxSdk).run(argv, process.argv[2], waitForConfirmation);
