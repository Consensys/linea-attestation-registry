import { VeraxSdk } from "../../src/VeraxSdk";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA);

veraxSdk.utils.getVersionNumber().then((res) => console.log(res));
