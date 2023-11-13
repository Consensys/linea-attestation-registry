import VeraxSdk from "../../src/VeraxSdk";
import PortalExamples from "./portalExamples";

let argv: string | null | undefined = process.argv[3] as string;
argv !== null && argv !== undefined ? (argv = argv.replaceAll("\\", "")) : (argv = "");

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

new PortalExamples(veraxSdk).run(argv, process.argv[2]);
