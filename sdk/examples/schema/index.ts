import VeraxSdk from "../../src/VeraxSdk";
import PortalExamples from "./schemaExamples";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

await new PortalExamples(veraxSdk).run(process.argv[2]);
