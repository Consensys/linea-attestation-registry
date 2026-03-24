import { Hex } from "viem";
import { VeraxSdk } from "../../src";
import AttestationExamples from "./attestationExamples";

const privateKey = process.env.PRIVATE_KEY as Hex;

let argv: string | null | undefined = process.argv[3] as string;
argv !== null && argv !== undefined && argv !== "wait" ? (argv = argv.replaceAll("\\", "")) : (argv = "");

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA, undefined, privateKey);

new AttestationExamples(veraxSdk).run(argv, process.argv[2]);
