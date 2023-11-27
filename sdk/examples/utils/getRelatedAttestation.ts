import { VeraxSdk } from "../../src/VeraxSdk";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

veraxSdk.attestation
  .getRelatedAttestations("0x0000000000000000000000000000000000000000000000000000000000000001")
  .then((res) => console.log(res));
