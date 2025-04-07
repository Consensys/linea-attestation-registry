import { Address } from "viem";
import { VeraxSdk } from "../../src/VeraxSdk";
import {
  DEFAULT_PORTAL_ADDRESS,
  DEFAULT_PORTAL_ADDRESS_2,
  DEFAULT_SCHEMA_ID,
  DEFAULT_SUBJECT,
  DEFAULT_EXPIRATION_DATE,
  DEFAULT_ATTESTATION_DATA,
  DEFAULT_ATTESTATION_ID,
  DEFAULT_ATTESTATION_ID_1,
  DEFAULT_PORTAL_ADDRESS_3,
} from "../constants";

export default class PortalExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "", waitForConfirmation = false) {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const portalId: string = argv === "" ? DEFAULT_PORTAL_ADDRESS : argv;
      console.log(await this.veraxSdk.portal.findOneById(portalId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.portal.findBy(2, 0, { ownerName: "alain.linea.eth" }, "name", "desc"));
    }

    if (methodName.toLowerCase() == "simulateAttest".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS;
      const attestationPayload = params?.attestationPayload ?? {
        schemaId: DEFAULT_SCHEMA_ID,
        expirationDate: DEFAULT_EXPIRATION_DATE,
        subject: DEFAULT_SUBJECT,
        attestationData: DEFAULT_ATTESTATION_DATA,
      };
      const validationPayloads = params?.validationPayloads ?? [];
      console.log(await this.veraxSdk.portal.simulateAttest(portalAddress, attestationPayload, validationPayloads));
    }

    if (methodName.toLowerCase() == "attest" || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS;
      const attestationPayload = params?.attestationPayload ?? {
        schemaId: DEFAULT_SCHEMA_ID,
        expirationDate: DEFAULT_EXPIRATION_DATE,
        subject: DEFAULT_SUBJECT,
        attestationData: DEFAULT_ATTESTATION_DATA,
      };
      const validationPayloads = params?.validationPayloads ?? [];
      console.log(
        await this.veraxSdk.portal.attest(portalAddress, attestationPayload, validationPayloads, {
          waitForConfirmation,
        }),
      );
    }

    if (methodName.toLowerCase() == "simulateBulkAttest".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS_2;

      const attestationPayloads = params?.attestationPayloads ?? [
        {
          schemaId: DEFAULT_SCHEMA_ID,
          expirationDate: DEFAULT_EXPIRATION_DATE,
          subject: DEFAULT_SUBJECT,
          attestationData: DEFAULT_ATTESTATION_DATA,
        },
        {
          schemaId: DEFAULT_SCHEMA_ID,
          expirationDate: DEFAULT_EXPIRATION_DATE,
          subject: DEFAULT_SUBJECT,
          attestationData: DEFAULT_ATTESTATION_DATA,
        },
      ];
      const validationPayloads = params?.validationPayloads ?? [[], []];
      console.log(
        await this.veraxSdk.portal.simulateBulkAttest(portalAddress, attestationPayloads, validationPayloads),
      );
    }

    if (methodName.toLowerCase() == "bulkAttest".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS_2;

      const attestationPayloads = params?.attestationPayloads ?? [
        {
          schemaId: DEFAULT_SCHEMA_ID,
          expirationDate: 0,
          subject: DEFAULT_SUBJECT,
          attestationData: DEFAULT_ATTESTATION_DATA,
        },
        {
          schemaId: DEFAULT_SCHEMA_ID,
          expirationDate: 0,
          subject: DEFAULT_SUBJECT,
          attestationData: DEFAULT_ATTESTATION_DATA,
        },
      ];
      const validationPayloads = params?.validationPayloads ?? [[], []];
      console.log(
        await this.veraxSdk.portal.bulkAttest(portalAddress, attestationPayloads, validationPayloads, {
          waitForConfirmation,
        }),
      );
    }

    if (methodName.toLowerCase() == "simulateRevoke".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS_2;
      const attestationId = params?.attestationId ?? DEFAULT_ATTESTATION_ID;
      console.log(await this.veraxSdk.portal.simulateRevoke(portalAddress, attestationId));
    }

    if (methodName.toLowerCase() == "revoke" || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS_2;
      const attestationId = params?.attestationId ?? DEFAULT_ATTESTATION_ID_1;
      console.log(await this.veraxSdk.portal.revoke(portalAddress, attestationId, { waitForConfirmation }));
    }

    if (methodName.toLowerCase() == "simulateBulkRevoke".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS_2;
      const attestationIds = params?.attestationIds ?? [
        "0x00000000000000000000000000000000000000000000000000000000000010a0",
        "0x00000000000000000000000000000000000000000000000000000000000010a1",
      ];
      console.log(await this.veraxSdk.portal.simulateBulkRevoke(portalAddress, attestationIds));
    }

    if (methodName.toLowerCase() == "bulkRevoke".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS_2;
      const attestationIds = params?.attestationIds ?? [
        "0x00000000000000000000000000000000000000000000000000000000000010a0",
        "0x00000000000000000000000000000000000000000000000000000000000010a1",
      ];
      console.log(await this.veraxSdk.portal.bulkRevoke(portalAddress, attestationIds, { waitForConfirmation }));
    }

    if (methodName.toLowerCase() == "simulateReplace".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS_2;
      const attestationId = params?.attestationId ? (params.attestationId as Address) : DEFAULT_ATTESTATION_ID_1;

      const attestationPayload = params?.attestationPayload ?? {
        schemaId: DEFAULT_SCHEMA_ID,
        expirationDate: DEFAULT_EXPIRATION_DATE,
        subject: DEFAULT_SUBJECT,
        attestationData: DEFAULT_ATTESTATION_DATA,
      };
      const validationPayloads = params?.validationPayloads ?? [];
      console.log(
        await this.veraxSdk.portal.simulateReplace(
          portalAddress,
          attestationId,
          attestationPayload,
          validationPayloads,
        ),
      );
    }

    if (methodName.toLowerCase() == "replace".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS_2;
      const attestationId = params?.attestationId ? (params.attestationId as Address) : DEFAULT_ATTESTATION_ID_1;

      const attestationPayload = params?.attestationPayload ?? {
        schemaId: DEFAULT_SCHEMA_ID,
        expirationDate: DEFAULT_EXPIRATION_DATE,
        subject: DEFAULT_SUBJECT,
        attestationData: DEFAULT_ATTESTATION_DATA,
      };
      const validationPayloads = params?.validationPayloads ?? [];
      console.log(
        await this.veraxSdk.portal.replace(portalAddress, attestationId, attestationPayload, validationPayloads, {
          waitForConfirmation,
        }),
      );
    }

    if (methodName.toLowerCase() == "simulateBulkReplace".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS_2;
      const attestationIds = params?.attestationIds
        ? (params.attestationIds as string[])
        : [DEFAULT_ATTESTATION_ID_1, "0x0000000000000000000000000000000000000000000000000000000000000002"];

      const attestationPayloads = params?.attestationPayloads ?? [
        {
          schemaId: DEFAULT_SCHEMA_ID,
          expirationDate: DEFAULT_EXPIRATION_DATE,
          subject: DEFAULT_SUBJECT,
          attestationData: DEFAULT_ATTESTATION_DATA,
        },
        {
          schemaId: DEFAULT_SCHEMA_ID,
          expirationDate: DEFAULT_EXPIRATION_DATE,
          subject: DEFAULT_SUBJECT,
          attestationData: DEFAULT_ATTESTATION_DATA,
        },
      ];
      const validationPayloads = params?.validationPayloads ?? [[], []];
      console.log(
        await this.veraxSdk.portal.simulateBulkReplace(
          portalAddress,
          attestationIds,
          attestationPayloads,
          validationPayloads,
        ),
      );
    }

    if (methodName.toLowerCase() == "bulkReplace".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS_2;
      const attestationIds = params?.attestationIds
        ? (params.attestationIds as string[])
        : [DEFAULT_ATTESTATION_ID_1, "0x0000000000000000000000000000000000000000000000000000000000000002"];

      const attestationPayloads = params?.attestationPayloads ?? [
        {
          schemaId: DEFAULT_SCHEMA_ID,
          expirationDate: DEFAULT_EXPIRATION_DATE,
          subject: DEFAULT_SUBJECT,
          attestationData: DEFAULT_ATTESTATION_DATA,
        },
        {
          schemaId: DEFAULT_SCHEMA_ID,
          expirationDate: DEFAULT_EXPIRATION_DATE,
          subject: DEFAULT_SUBJECT,
          attestationData: DEFAULT_ATTESTATION_DATA,
        },
      ];
      const validationPayloads = params?.validationPayloads ?? [[], []];
      console.log(
        await this.veraxSdk.portal.bulkReplace(portalAddress, attestationIds, attestationPayloads, validationPayloads, {
          waitForConfirmation,
        }),
      );
    }

    if (methodName.toLowerCase() == "simulateRegister".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { id, name, description, isRevocable, ownerName } = params ?? {
        id: DEFAULT_PORTAL_ADDRESS_3,
        name: "test",
        description: "example",
        isRevocable: true,
        ownerName: "test",
      };
      console.log(await this.veraxSdk.portal.simulateRegister(id, name, description, isRevocable, ownerName));
    }

    if (methodName.toLowerCase() == "register".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { id, name, description, isRevocable, ownerName } = params ?? {
        id: DEFAULT_PORTAL_ADDRESS_3,
        name: "test",
        description: "example",
        isRevocable: true,
        ownerName: "test",
      };
      console.log(
        await this.veraxSdk.portal.register(id, name, description, isRevocable, ownerName, { waitForConfirmation }),
      );
    }

    if (methodName.toLowerCase() == "simulateDeployDefaultPortal".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { modules, name, description, isRevocable, ownerName } = params ?? {
        modules: [],
        name: "test",
        description: "example",
        isRevocable: true,
        ownerName: "test",
      };
      console.log(
        await this.veraxSdk.portal.simulateDeployDefaultPortal(modules, name, description, isRevocable, ownerName),
      );
    }

    if (methodName.toLowerCase() == "deployDefaultPortal".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { modules, name, description, isRevocable, ownerName } = params ?? {
        modules: [],
        name: "test",
        description: "example",
        isRevocable: true,
        ownerName: "test",
      };
      console.log(
        await this.veraxSdk.portal.deployDefaultPortal(modules, name, description, isRevocable, ownerName, {
          waitForConfirmation,
        }),
      );
    }

    if (methodName.toLowerCase() == "getPortalByAddress".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS;
      console.log(await this.veraxSdk.portal.getPortalByAddress(portalAddress));
    }

    if (methodName.toLowerCase() == "getPortalOwner".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS;
      console.log(await this.veraxSdk.portal.getPortalOwner(portalAddress));
    }

    if (methodName.toLowerCase() == "getPortalRevocability".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS;
      console.log(await this.veraxSdk.portal.getPortalRevocability(portalAddress));
    }

    if (methodName.toLowerCase() == "getPortalsNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.portal.getPortalsNumber());
    }

    if (methodName.toLowerCase() == "isPortalRegistered".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress ? (params.portalAddress as Address) : DEFAULT_PORTAL_ADDRESS;
      console.log(await this.veraxSdk.portal.isPortalRegistered(portalAddress));
    }
  }
}
