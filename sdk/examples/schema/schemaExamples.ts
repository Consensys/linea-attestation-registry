import { Address } from "viem";
import { VeraxSdk } from "../../src/VeraxSdk";
import { DEFAULT_SCHEMA_ID, DEFAULT_SCHEMA_STRING } from "../constants";

export default class SchemaExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "", waitForConfirmation = false) {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const schemaId: string = argv === "" ? DEFAULT_SCHEMA_ID : argv;
      console.log(await this.veraxSdk.schema.findOneById(schemaId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.schema.findBy(2, 0, { description: "Hapi Test" }, "name", "desc"));
    }

    if (methodName.toLowerCase() == "simulateCreate".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { name, description, context, schemaString } = params ?? {
        name: "test",
        description: "example",
        context: "test",
        schemaString: DEFAULT_SCHEMA_STRING,
      };
      console.log(await this.veraxSdk.schema.simulateCreate(name, description, context, schemaString));
    }

    if (methodName.toLowerCase() == "create".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { name, description, context, schemaString } = params ?? {
        name: "test",
        description: "example",
        context: "test",
        schemaString: DEFAULT_SCHEMA_STRING,
      };
      console.log(await this.veraxSdk.schema.create(name, description, context, schemaString, { waitForConfirmation }));
    }

    if (methodName.toLowerCase() == "simulateUpdateContext".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { schemaId, context } = params ?? {
        schemaId: DEFAULT_SCHEMA_ID,
        context: "new context",
      };
      console.log(await this.veraxSdk.schema.simulateUpdateContext(schemaId, context));
    }

    if (methodName.toLowerCase() == "updateContext".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { schemaId, context } = params ?? {
        schemaId: DEFAULT_SCHEMA_ID,
        context: "new context",
      };
      console.log(await this.veraxSdk.schema.updateContext(schemaId, context, { waitForConfirmation }));
    }

    if (methodName.toLowerCase() == "getIdFromSchemaString".toLowerCase() || methodName == "") {
      const schemaString: string = argv === "" ? DEFAULT_SCHEMA_STRING : argv;
      console.log(await this.veraxSdk.schema.getIdFromSchemaString(schemaString));
    }

    if (methodName.toLowerCase() == "getSchema".toLowerCase() || methodName == "") {
      const schemaId: string = argv === "" ? DEFAULT_SCHEMA_ID : argv;
      console.log(await this.veraxSdk.schema.getSchema(schemaId));
    }

    if (methodName.toLowerCase() == "getSchemasNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.schema.getSchemasNumber());
    }

    if (methodName.toLowerCase() == "isRegistered".toLowerCase() || methodName == "") {
      const schemaId: string = argv === "" ? DEFAULT_SCHEMA_ID : argv;
      console.log(await this.veraxSdk.schema.isRegistered(schemaId));
    }
  }
}
