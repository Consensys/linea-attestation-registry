import VeraxSdk from "../../src/VeraxSdk";

export default class SchemaExamples {
  private veraxSdk: VeraxSdk;
  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }
  async run(methodName: string = "") {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "")
      console.log(
        await this.veraxSdk.schema.findOneById("0x01f031da36192c34057c764239eb77bb6ec8ebfb808f72a7bb172f37a5bec31f"),
      );

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.schema.findBy({ name: "Relationship" }));

    if (methodName.toLowerCase() == "create" || methodName == "") console.log(await this.veraxSdk.schema.create());
  }
}
