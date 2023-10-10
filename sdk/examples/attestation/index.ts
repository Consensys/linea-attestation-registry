import VeraxSdk from "../../src/VeraxSdk";
import AttestationExamples from "./attestationExamples";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

await new AttestationExamples(veraxSdk).run(process.argv[2]);
