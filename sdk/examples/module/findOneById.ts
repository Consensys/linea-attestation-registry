import VeraxSdk from "../../src/VeraxSdk";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

console.log(await veraxSdk.module.findOneById("0xf75be6f9418710fd516fa82afb3aad07e11a0f1b"));
