import VeraxSdk from "../../src/VeraxSdk";

export default class AttestationExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "") {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x00000000000000000000000000000000000000000000000000000000000007b5" : argv;
      console.log(await this.veraxSdk.attestation.findOneById(attestationId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      console.log(
        await this.veraxSdk.attestation.findBy(
          2,
          0,
          { attester_not: "0x809e815596AbEB3764aBf81BE2DC39fBBAcc9949" },
          "attestedDate",
          "desc",
        ),
      );
    }

    if (methodName.toLowerCase() == "getRelatedAttestations".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x0000000000000000000000000000000000000000000000000000000000000001" : argv;
      console.log(await this.veraxSdk.attestation.getRelatedAttestations(attestationId));
    }
  }
}
