import VeraxSdk from "../../src/VeraxSdk";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

console.log(
  await veraxSdk.attestation.getRelatedAttestations(
    "0x0000000000000000000000000000000000000000000000000000000000000001",
  ),
);
