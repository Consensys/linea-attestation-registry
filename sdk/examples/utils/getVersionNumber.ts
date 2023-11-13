import VeraxSdk from "../../src/VeraxSdk";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

veraxSdk.utils.getVersionNumber().then((res) => console.log(res));
