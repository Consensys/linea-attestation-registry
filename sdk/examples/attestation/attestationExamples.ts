import VeraxSdk from "../../src/VeraxSdk";
import { Attestation } from "../../src/types";

export default class AttestationExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(methodName: string = "", argv: string) {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x00000000000000000000000000000000000000000000000000000000000007b5" : argv;
      console.log(await this.veraxSdk.attestation.findOneById(attestationId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      const params: Partial<Attestation> =
        argv === ""
          ? { schemaId: "0xd1664d97bd195df77e3d5fe78c1737ab3adaa38bbe52a680d1aa30fa51f186ba" }
          : JSON.parse(argv);
      console.log(await this.veraxSdk.attestation.findBy(params));
    }

    if (methodName.toLowerCase() == "getRelatedAttestations".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x0000000000000000000000000000000000000000000000000000000000000001" : argv;
      console.log(await this.veraxSdk.attestation.getRelatedAttestations(attestationId));
    }
  }
}
