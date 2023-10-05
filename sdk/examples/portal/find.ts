import VeraxSdk from "../../src/VeraxSdk";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

console.log(await veraxSdk.portal.find("0x1495341ab1019798dd08976f4a3e5ab0e095510b"));
