import VeraxSdk from "../../src/VeraxSdk";

export default class PortalExamples {
  private veraxSdk: VeraxSdk;
  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }
  async run(methodName: string = "") {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.portal.findOneById("0x1495341ab1019798dd08976f4a3e5ab0e095510b"));

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.portal.findBy(`{ownerName: "Clique"}`));

    if (methodName.toLowerCase() == "attest" || methodName == "") console.log(await this.veraxSdk.portal.attest());

    if (methodName.toLowerCase() == "bulkAttest".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.portal.bulkAttest());

    if (methodName.toLowerCase() == "replace" || methodName == "") console.log(await this.veraxSdk.portal.replace());

    if (methodName.toLowerCase() == "revoke" || methodName == "") console.log(await this.veraxSdk.portal.revoke());

    if (methodName.toLowerCase() == "bulkRevoke".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.portal.bulkRevoke());

    if (methodName.toLowerCase() == "massImport".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.portal.massImport());

    if (methodName.toLowerCase() == "register" || methodName == "") console.log(await this.veraxSdk.portal.register());

    if (methodName.toLowerCase() == "clone" || methodName == "") console.log(await this.veraxSdk.portal.clone());
  }
}
