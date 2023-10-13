import VeraxSdk from "../../src/VeraxSdk";
import { Module } from "../../src/types";

export default class ModuleExamples {
  private veraxSdk: VeraxSdk;
  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }
  async run(methodName: string = "", argv: string) {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const moduleId: string = argv === "" ? "0xf75be6f9418710fd516fa82afb3aad07e11a0f1b" : argv;
      console.log(await this.veraxSdk.module.findOneById(moduleId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      const params: Partial<Module> = argv === "" ? { name: "SchemaCheckerModule" } : JSON.parse(argv);
      console.log(await this.veraxSdk.module.findBy(params));
    }

    if (methodName.toLowerCase() == "register" || methodName == "") console.log(await this.veraxSdk.module.register());
  }
}
