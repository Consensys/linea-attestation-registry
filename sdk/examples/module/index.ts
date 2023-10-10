import VeraxSdk from "../../src/VeraxSdk";
import ModuleExamples from "./moduleExamples";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

await new ModuleExamples(veraxSdk).run(process.argv[2]);
