import VeraxSdk from "../../src/VeraxSdk";

export default class SchemaExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "") {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const schemaId: string =
        argv === "" ? "0x01f031da36192c34057c764239eb77bb6ec8ebfb808f72a7bb172f37a5bec31f" : argv;
      console.log(await this.veraxSdk.schema.findOneById(schemaId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.schema.findBy(2, 0, { description: "Gitcoin Passport Score" }, "name", "desc"));
    }

    if (methodName.toLowerCase() == "create" || methodName == "") console.log(await this.veraxSdk.schema.create());
  }
}
