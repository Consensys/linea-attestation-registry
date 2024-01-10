import { VeraxSdk } from "../../src/VeraxSdk";
import AttestationExamples from "./attestationExamples";

let argv: string | null | undefined = process.argv[3] as string;
argv !== null && argv !== undefined ? (argv = argv.replaceAll("\\", "")) : (argv = "");

const waitForConfirmationArgv: string | null | undefined = process.argv[4] as string;
let waitForConfirmation = false;
if (waitForConfirmationArgv === "wait") waitForConfirmation = true;

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

new AttestationExamples(veraxSdk).run(argv, process.argv[2], waitForConfirmation);
