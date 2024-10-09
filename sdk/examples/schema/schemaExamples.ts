import { Address } from "viem";
import { ChainName, VeraxSdk } from "../../src/VeraxSdk";
import { Schema_filter } from "../../.graphclient";

export default class SchemaExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "", waitForConfirmation = false) {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const schemaId: string =
        argv === "" ? "0x01f031da36192c34057c764239eb77bb6ec8ebfb808f72a7bb172f37a5bec31f" : argv;
      console.log(await this.veraxSdk.schema.findOneById(schemaId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.schema.findBy(2, 0, { description: "Gitcoin Passport score" }, "name", "desc"));
    }

    if (methodName.toLowerCase() == "findByMultiChain".toLowerCase() || methodName == "") {
      const filter: Schema_filter | undefined =
        argv !== "" ? JSON.parse(argv) : { description: "Gitcoin Passport score" };
      console.log(
        await this.veraxSdk.schema.findByMultiChain(
          [ChainName.LINEA_MAINNET, ChainName.ARBITRUM_MAINNET],
          2,
          0,
          filter,
          undefined,
          undefined,
        ),
      );
    }

    if (methodName.toLowerCase() == "simulateUpdateRouter".toLowerCase() || methodName == "") {
      const routerAddress: Address = argv === "" ? "0x736c78b2f2cBf4F921E8551b2acB6A5Edc9177D5" : (argv as Address);
      console.log(await this.veraxSdk.schema.simulateUpdateRouter(routerAddress));
    }

    if (methodName.toLowerCase() == "updateRouter".toLowerCase() || methodName == "") {
      const routerAddress: Address = argv === "" ? "0x736c78b2f2cBf4F921E8551b2acB6A5Edc9177D5" : (argv as Address);
      console.log(await this.veraxSdk.schema.updateRouter(routerAddress, waitForConfirmation));
    }

    if (methodName.toLowerCase() == "simulateCreate".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { name, description, context, schemaString } = params ?? {
        name: "test",
        description: "example",
        context: "test",
        schemaString: "(bool isBuidler)",
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
        schemaString: "(bool isBuidler)",
      };
      console.log(await this.veraxSdk.schema.create(name, description, context, schemaString, waitForConfirmation));
    }

    if (methodName.toLowerCase() == "simulateUpdateContext".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { schemaId, context } = params ?? {
        schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
        context: "new context",
      };
      console.log(await this.veraxSdk.schema.simulateUpdateContext(schemaId, context));
    }

    if (methodName.toLowerCase() == "updateContext".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { schemaId, context } = params ?? {
        schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
        context: "new context",
      };
      console.log(await this.veraxSdk.schema.updateContext(schemaId, context, waitForConfirmation));
    }

    if (methodName.toLowerCase() == "getIdFromSchemaString".toLowerCase() || methodName == "") {
      const schemaString: string = argv === "" ? "(bool isBuidler)" : argv;
      console.log(await this.veraxSdk.schema.getIdFromSchemaString(schemaString));
    }

    if (methodName.toLowerCase() == "getSchema".toLowerCase() || methodName == "") {
      const schemaId: string =
        argv === "" ? "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738" : argv;
      console.log(await this.veraxSdk.schema.getSchema(schemaId));
    }

    if (methodName.toLowerCase() == "getSchemasNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.schema.getSchemasNumber());
    }

    if (methodName.toLowerCase() == "isRegistered".toLowerCase() || methodName == "") {
      const schemaId: string =
        argv === "" ? "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738" : argv;
      console.log(await this.veraxSdk.schema.isRegistered(schemaId));
    }
  }
}
