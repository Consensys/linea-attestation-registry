import VeraxSdk from "../../src/VeraxSdk";

export default class ModuleExamples {
  private veraxSdk: VeraxSdk;
  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }
  async run(methodName: string = "") {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.module.findOneById("0xf75be6f9418710fd516fa82afb3aad07e11a0f1b"));

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.module.findBy(`{name: "SchemaCheckerModule"}`));

    if (methodName.toLowerCase() == "register" || methodName == "") console.log(await this.veraxSdk.module.register());
  }
}
