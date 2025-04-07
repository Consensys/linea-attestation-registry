import { Address } from "viem";
import { parseEther } from "viem";
import { VeraxSdk } from "../../src/VeraxSdk";
import {
  DEFAULT_MODULE_ADDRESS,
  DEFAULT_MODULE_ADDRESS_2,
  DEFAULT_SCHEMA_ID_2,
  DEFAULT_SUBJECT_2,
  DEFAULT_EXPIRATION_DATE,
  DEFAULT_ATTESTATION_DATA_2,
} from "../constants";

export default class ModuleExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "", waitForConfirmation = false) {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const moduleId: string = argv === "" ? DEFAULT_MODULE_ADDRESS : argv;
      console.log(await this.veraxSdk.module.findOneById(moduleId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.module.findBy(2, 0, { name: "test" }, "name", "desc"));
    }

    if (methodName.toLowerCase() == "simulateRegister".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { name, description, moduleAddress } = params ?? {
        name: "test",
        description: "example",
        moduleAddress: DEFAULT_MODULE_ADDRESS,
      };
      console.log(await this.veraxSdk.module.simulateRegister(name, description, moduleAddress));
    }

    if (methodName.toLowerCase() == "register".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { name, description, moduleAddress } = params ?? {
        name: "test",
        description: "example",
        moduleAddress: DEFAULT_MODULE_ADDRESS,
      };
      console.log(await this.veraxSdk.module.register(name, description, moduleAddress, { waitForConfirmation }));
    }

    if (methodName.toLowerCase() == "simulateRunModules".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);

      const modulesAddresses = params?.modulesAddresses ? params.modulesAddresses : [DEFAULT_MODULE_ADDRESS];
      const attestationPayload = params?.attestationPayload ?? {
        schemaId: DEFAULT_SCHEMA_ID_2,
        expirationDate: DEFAULT_EXPIRATION_DATE,
        subject: DEFAULT_SUBJECT_2,
        attestationData: DEFAULT_ATTESTATION_DATA_2,
      };
      const validationPayloads = params?.validationPayloads ?? [];
      const value = parseEther(params?.value ?? 0);

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

      const modulesAddresses = params?.modulesAddresses ? params.modulesAddresses : [DEFAULT_MODULE_ADDRESS];
      const attestationPayload = params?.attestationPayload ?? {
        schemaId: DEFAULT_SCHEMA_ID_2,
        expirationDate: DEFAULT_EXPIRATION_DATE,
        subject: DEFAULT_SUBJECT_2,
        attestationData: DEFAULT_ATTESTATION_DATA_2,
      };
      const validationPayloads = params?.validationPayloads ?? [];
      const value = parseEther(params?.value ?? 0);

      console.log(
        await this.veraxSdk.module.runModules(modulesAddresses as Address[], attestationPayload, validationPayloads, {
          value,
          waitForConfirmation,
        }),
      );
    }

    if (methodName.toLowerCase() == "simulateBulkRunModules".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);

      const modulesAddresses = params?.modulesAddresses ? params.modulesAddresses : [DEFAULT_MODULE_ADDRESS_2];
      const attestationPayloads = params?.attestationPayloads ?? [
        {
          schemaId: DEFAULT_SCHEMA_ID_2,
          expirationDate: DEFAULT_EXPIRATION_DATE,
          subject: DEFAULT_SUBJECT_2,
          attestationData: DEFAULT_ATTESTATION_DATA_2,
        },
        {
          schemaId: DEFAULT_SCHEMA_ID_2,
          expirationDate: DEFAULT_EXPIRATION_DATE,
          subject: DEFAULT_SUBJECT_2,
          attestationData: DEFAULT_ATTESTATION_DATA_2,
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

      const modulesAddresses = params?.modulesAddresses ? params.modulesAddresses : [DEFAULT_MODULE_ADDRESS_2];
      const attestationPayloads = params?.attestationPayloads ?? [
        {
          schemaId: DEFAULT_SCHEMA_ID_2,
          expirationDate: DEFAULT_EXPIRATION_DATE,
          subject: DEFAULT_SUBJECT_2,
          attestationData: DEFAULT_ATTESTATION_DATA_2,
        },
        {
          schemaId: DEFAULT_SCHEMA_ID_2,
          expirationDate: DEFAULT_EXPIRATION_DATE,
          subject: DEFAULT_SUBJECT_2,
          attestationData: DEFAULT_ATTESTATION_DATA_2,
        },
      ];
      const validationPayloads = params?.validationPayloads ?? [[""], [""]];

      console.log(
        await this.veraxSdk.module.bulkRunModules(
          modulesAddresses as Address[],
          attestationPayloads,
          validationPayloads,
          { waitForConfirmation },
        ),
      );
    }

    if (methodName.toLowerCase() == "isContractAddress".toLowerCase() || methodName == "") {
      const contractAddress: Address = argv === "" ? DEFAULT_MODULE_ADDRESS : (argv as Address);
      console.log(await this.veraxSdk.module.isContractAddress(contractAddress));
    }

    if (methodName.toLowerCase() == "getModulesNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.module.getModulesNumber());
    }

    if (methodName.toLowerCase() == "isRegistered".toLowerCase() || methodName == "") {
      const moduleAddress: Address = argv === "" ? DEFAULT_MODULE_ADDRESS : (argv as Address);
      console.log(await this.veraxSdk.module.isRegistered(moduleAddress));
    }

    if (methodName.toLowerCase() == "getModule".toLowerCase() || methodName == "") {
      const moduleAddress: Address = argv === "" ? DEFAULT_MODULE_ADDRESS : (argv as Address);
      console.log(await this.veraxSdk.module.getModule(moduleAddress));
    }
  }
}
