import VeraxSdk from "../../src/VeraxSdk";

export default class ModuleExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "") {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const moduleId: string = argv === "" ? "0xf75be6f9418710fd516fa82afb3aad07e11a0f1b" : argv;
      console.log(await this.veraxSdk.module.findOneById(moduleId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.module.findBy(2, 0, { name_contains: "Msg" }, undefined, undefined));
    }

    if (methodName.toLowerCase() == "register" || methodName == "") console.log(await this.veraxSdk.module.register());
  }
}
