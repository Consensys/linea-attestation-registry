import { VeraxSdk } from "../../src/VeraxSdk";
import AttestationExamples from "./attestationExamples";

let argv: string | null | undefined = process.argv[3] as string;
argv !== null && argv !== undefined ? (argv = argv.replaceAll("\\", "")) : (argv = "");

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

new AttestationExamples(veraxSdk).run(argv, process.argv[2]);
