import VeraxSdk from "../../src/VeraxSdk";

export default class AttestationExamples {
  private veraxSdk: VeraxSdk;
  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }
  async run(methodName: string = "") {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "")
      console.log(
        await this.veraxSdk.attestation.findOneById(
          "0x00000000000000000000000000000000000000000000000000000000000007b5",
        ),
      );
    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "")
      console.log(
        await this.veraxSdk.attestation.findBy(
          `{schemaId: "0xd1664d97bd195df77e3d5fe78c1737ab3adaa38bbe52a680d1aa30fa51f186ba"}`,
        ),
      );
  }
}
