import { Address } from "viem";
import { VeraxSdk } from "../../src/VeraxSdk";

export default class ModuleExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "", waitForConfirmation = false) {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const moduleId: string = argv === "" ? "0xf75be6f9418710fd516fa82afb3aad07e11a0f1b" : argv;
      console.log(await this.veraxSdk.module.findOneById(moduleId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.module.findBy(2, 0, { name_contains: "Msg" }, undefined, undefined));
    }

    if (methodName.toLowerCase() == "simulateUpdateRouter".toLowerCase() || methodName == "") {
      const routerAddress: Address = argv === "" ? "0x736c78b2f2cBf4F921E8551b2acB6A5Edc9177D5" : (argv as Address);
      console.log(await this.veraxSdk.module.simulateUpdateRouter(routerAddress));
    }

    if (methodName.toLowerCase() == "updateRouter".toLowerCase() || methodName == "") {
      const routerAddress: Address = argv === "" ? "0x736c78b2f2cBf4F921E8551b2acB6A5Edc9177D5" : (argv as Address);
      console.log(await this.veraxSdk.module.updateRouter(routerAddress, waitForConfirmation));
    }

    if (methodName.toLowerCase() == "simulateRegister".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { name, description, moduleAddress } = params ?? {
        name: "test",
        description: "example",
        moduleAddress: "0x4bb8769e18f1518c35be8405d43d7cc07ecf501c",
      };
      console.log(await this.veraxSdk.module.simulateRegister(name, description, moduleAddress));
    }

    if (methodName.toLowerCase() == "register".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { name, description, moduleAddress } = params ?? {
        name: "test",
        description: "example",
        moduleAddress: "0x4bb8769e18f1518c35be8405d43d7cc07ecf501c",
      };
      console.log(await this.veraxSdk.module.register(name, description, moduleAddress, waitForConfirmation));
    }

    if (methodName.toLowerCase() == "simulateRunModules".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);

      const modulesAddresses = params?.modulesAddresses
        ? params.modulesAddresses
        : ["0x4bb8769e18f1518c35be8405d43d7cc07ecf501c"];
      const attestationPayload = params?.attestationPayload ?? {
        schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
        expirationDate: 1693583329,
        subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
        attestationData: [{ isBuidler: true }],
      };
      const validationPayloads = params?.validationPayloads ?? [];
      const value = params?.value ? (params.value as number) : 1;

      console.log(
        await this.veraxSdk.module.simulateRunModules(
          modulesAddresses as Address[],
          attestationPayload,
          validationPayloads,
          value,
        ),
      );
    }

    if (methodName.toLowerCase() == "runModules".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);

      const modulesAddresses = params?.modulesAddresses
        ? params.modulesAddresses
        : ["0x4bb8769e18f1518c35be8405d43d7cc07ecf501c"];
      const attestationPayload = params?.attestationPayload ?? {
        schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
        expirationDate: 1693583329,
        subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
        attestationData: [{ isBuidler: true }],
      };
      const validationPayloads = params?.validationPayloads ?? [];
      const value = params?.value ? (params.value as number) : 1;

      console.log(
        await this.veraxSdk.module.runModules(
          modulesAddresses as Address[],
          attestationPayload,
          validationPayloads,
          value,
          waitForConfirmation,
        ),
      );
    }

    if (methodName.toLowerCase() == "simulateBulkRunModules".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);

      const modulesAddresses = params?.modulesAddresses
        ? params.modulesAddresses
        : ["0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5"];
      const attestationPayloads = params?.attestationPayloads ?? [
        {
          schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
          expirationDate: 1693583329,
          subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
          attestationData: [{ isBuidler: true }],
        },
        {
          schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
          expirationDate: 1693583329,
          subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
          attestationData: [{ isBuidler: true }],
        },
      ];
      const validationPayloads = params?.validationPayloads ?? [[""], [""]];

      console.log(
        await this.veraxSdk.module.simulateBulkRunModules(
          modulesAddresses as Address[],
          attestationPayloads,
          validationPayloads,
        ),
      );
    }

    if (methodName.toLowerCase() == "bulkRunModules".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);

      const modulesAddresses = params?.modulesAddresses
        ? params.modulesAddresses
        : ["0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5"];
      const attestationPayloads = params?.attestationPayloads ?? [
        {
          schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
          expirationDate: 1693583329,
          subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
          attestationData: [{ isBuidler: true }],
        },
        {
          schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
          expirationDate: 1693583329,
          subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
          attestationData: [{ isBuidler: true }],
        },
      ];
      const validationPayloads = params?.validationPayloads ?? [[""], [""]];

      console.log(
        await this.veraxSdk.module.bulkRunModules(
          modulesAddresses as Address[],
          attestationPayloads,
          validationPayloads,
          waitForConfirmation,
        ),
      );
    }

    if (methodName.toLowerCase() == "isContractAddress".toLowerCase() || methodName == "") {
      const contractAddress: Address = argv === "" ? "0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5" : (argv as Address);
      console.log(await this.veraxSdk.module.isContractAddress(contractAddress));
    }

    if (methodName.toLowerCase() == "getModulesNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.module.getModulesNumber());
    }

    if (methodName.toLowerCase() == "isRegistered".toLowerCase() || methodName == "") {
      const moduleAddress: Address = argv === "" ? "0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5" : (argv as Address);
      console.log(await this.veraxSdk.module.isRegistered(moduleAddress));
    }

    if (methodName.toLowerCase() == "getModule".toLowerCase() || methodName == "") {
      const moduleAddress: Address = argv === "" ? "0x8DcC1F7e746D6071Eb3ee9012aFB6c707bFf82a5" : (argv as Address);
      console.log(await this.veraxSdk.module.getModule(moduleAddress));
    }
  }
}
