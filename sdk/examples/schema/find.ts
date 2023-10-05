import VeraxSdk from "../../src/VeraxSdk";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

console.log(await veraxSdk.schema.find("0x01f031da36192c34057c764239eb77bb6ec8ebfb808f72a7bb172f37a5bec31f"));
