import VeraxSdk from "../../src/VeraxSdk";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

console.log(await veraxSdk.attestation.find("0x00000000000000000000000000000000000000000000000000000000000007b5"));
