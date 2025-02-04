import { Address } from "viem";
import { VeraxSdk } from "../../src/VeraxSdk";

export default class PortalExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "", waitForConfirmation = false) {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const portalId: string = argv === "" ? "0x1495341ab1019798dd08976f4a3e5ab0e095510b" : argv;
      console.log(await this.veraxSdk.portal.findOneById(portalId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.portal.findBy(2, 0, { ownerName: "Alain" }, "name", "desc"));
    }

    if (methodName.toLowerCase() == "simulateAttest".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
      const attestationPayload = params?.attestationPayload ?? {
        schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
        expirationDate: 1693583329,
        subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
        attestationData: [{ isBuidler: true }],
      };
      const validationPayloads = params?.validationPayloads ?? [];
      console.log(await this.veraxSdk.portal.simulateAttest(portalAddress, attestationPayload, validationPayloads));
    }

    if (methodName.toLowerCase() == "attest" || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
      const attestationPayload = params?.attestationPayload ?? {
        schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
        expirationDate: 1693583329,
        subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
        attestationData: [{ isBuidler: true }],
      };
      const validationPayloads = params?.validationPayloads ?? [];
      console.log(
        await this.veraxSdk.portal.attest(portalAddress, attestationPayload, validationPayloads, waitForConfirmation),
      );
    }

    if (methodName.toLowerCase() == "simulateAttestV2".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xA93162E5de5c1dcb4762cda08A26aeE4C5b9F264";
      const attestationPayload = params?.attestationPayload ?? {
        schemaId: "0x2049fef3764ceceb65a9a4a001b3824dac1d05cf5a46c3f4436cf23d280b87de",
        expirationDate: Math.floor(Date.now() / 1000) + 2592000,
        subject: "0x6eCfD8252C19aC2Bf4bd1cBdc026C001C93E179D",
        attestationData: [{ hasCompletedTutorial: true }],
      };
      const validationPayloads = params?.validationPayloads ?? [];
      console.log(await this.veraxSdk.portal.simulateAttestV2(portalAddress, attestationPayload, validationPayloads));
    }

    if (methodName.toLowerCase() == "attestV2".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xA93162E5de5c1dcb4762cda08A26aeE4C5b9F264";
      const attestationPayload = params?.attestationPayload ?? {
        schemaId: "0x2049fef3764ceceb65a9a4a001b3824dac1d05cf5a46c3f4436cf23d280b87de",
        expirationDate: Math.floor(Date.now() / 1000) + 2592000,
        subject: "0x6eCfD8252C19aC2Bf4bd1cBdc026C001C93E179D",
        attestationData: [{ hasCompletedTutorial: true }],
      };
      const validationPayloads = params?.validationPayloads ?? [];
      console.log(
        await this.veraxSdk.portal.attestV2(portalAddress, attestationPayload, validationPayloads, waitForConfirmation),
      );
    }

    if (methodName.toLowerCase() == "simulateBulkAttest".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";

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
      const validationPayloads = params?.validationPayloads ?? [[], []];
      console.log(
        await this.veraxSdk.portal.simulateBulkAttest(portalAddress, attestationPayloads, validationPayloads),
      );
    }

    if (methodName.toLowerCase() == "bulkAttest".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";

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
      const validationPayloads = params?.validationPayloads ?? [[], []];
      console.log(
        await this.veraxSdk.portal.bulkAttest(
          portalAddress,
          attestationPayloads,
          validationPayloads,
          waitForConfirmation,
        ),
      );
    }

    if (methodName.toLowerCase() == "revoke" || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
      const attestationId =
        params?.attestationId ?? "0x0000000000000000000000000000000000000000000000000000000000000001";
      console.log(await this.veraxSdk.portal.revoke(portalAddress, attestationId, waitForConfirmation));
    }

    if (methodName.toLowerCase() == "simulateRevoke".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
      const attestationId =
        params?.attestationId ?? "0x0000000000000000000000000000000000000000000000000000000000000001";
      console.log(await this.veraxSdk.portal.simulateRevoke(portalAddress, attestationId));
    }

    if (methodName.toLowerCase() == "simulateBulkRevoke".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
      const attestationIds = params?.attestationIds ?? [
        "0x00000000000000000000000000000000000000000000000000000000000010a0",
        "0x00000000000000000000000000000000000000000000000000000000000010a1",
      ];
      console.log(await this.veraxSdk.portal.simulateBulkRevoke(portalAddress, attestationIds));
    }

    if (methodName.toLowerCase() == "bulkRevoke".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
      const attestationIds = params?.attestationIds ?? [
        "0x00000000000000000000000000000000000000000000000000000000000010a0",
        "0x00000000000000000000000000000000000000000000000000000000000010a1",
      ];
      console.log(await this.veraxSdk.portal.bulkRevoke(portalAddress, attestationIds, waitForConfirmation));
    }

    if (methodName.toLowerCase() == "simulateReplace".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
      const attestationId = params?.attestationId
        ? (params.attestationId as Address)
        : "0x0000000000000000000000000000000000000000000000000000000000000001";

      const attestationPayload = params?.attestationPayload ?? {
        schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
        expirationDate: 1693583329,
        subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
        attestationData: [{ isBuidler: true }],
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
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
      const attestationId = params?.attestationId
        ? (params.attestationId as Address)
        : "0x0000000000000000000000000000000000000000000000000000000000000001";

      const attestationPayload = params?.attestationPayload ?? {
        schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
        expirationDate: 1693583329,
        subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
        attestationData: [{ isBuidler: true }],
      };
      const validationPayloads = params?.validationPayloads ?? [];
      console.log(
        await this.veraxSdk.portal.replace(
          portalAddress,
          attestationId,
          attestationPayload,
          validationPayloads,
          waitForConfirmation,
        ),
      );
    }

    if (methodName.toLowerCase() == "simulateBulkReplace".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
      const attestationIds = params?.attestationIds
        ? (params.attestationIds as string[])
        : [
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000002",
          ];

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
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0xeea25bc2ec56cae601df33b8fc676673285e12cc";
      const attestationIds = params?.attestationIds
        ? (params.attestationIds as string[])
        : [
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            "0x0000000000000000000000000000000000000000000000000000000000000002",
          ];

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
      const validationPayloads = params?.validationPayloads ?? [[], []];
      console.log(
        await this.veraxSdk.portal.bulkReplace(
          portalAddress,
          attestationIds,
          attestationPayloads,
          validationPayloads,
          waitForConfirmation,
        ),
      );
    }

    if (methodName.toLowerCase() == "simulateRegister".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const { id, name, description, isRevocable, ownerName } = params ?? {
        id: "0xD39c439cD3Ae5E1F3c7d13985aDAC90846284904",
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
        id: "0xD39c439cD3Ae5E1F3c7d13985aDAC90846284904",
        name: "test",
        description: "example",
        isRevocable: true,
        ownerName: "test",
      };
      console.log(
        await this.veraxSdk.portal.register(id, name, description, isRevocable, ownerName, waitForConfirmation),
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
        await this.veraxSdk.portal.deployDefaultPortal(
          modules,
          name,
          description,
          isRevocable,
          ownerName,
          waitForConfirmation,
        ),
      );
    }

    if (methodName.toLowerCase() == "getPortalByAddress".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0x8b833796869b5debb9b06370d6d47016f0d7973b";
      console.log(await this.veraxSdk.portal.getPortalByAddress(portalAddress));
    }

    if (methodName.toLowerCase() == "getPortalOwner".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0x8b833796869b5debb9b06370d6d47016f0d7973b";
      console.log(await this.veraxSdk.portal.getPortalOwner(portalAddress));
    }

    if (methodName.toLowerCase() == "getPortalRevocability".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0x8b833796869b5debb9b06370d6d47016f0d7973b";
      console.log(await this.veraxSdk.portal.getPortalRevocability(portalAddress));
    }

    if (methodName.toLowerCase() == "getPortalsNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.portal.getPortalsNumber());
    }

    if (methodName.toLowerCase() == "isPortalRegistered".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const portalAddress = params?.portalAddress
        ? (params.portalAddress as Address)
        : "0x8b833796869b5debb9b06370d6d47016f0d7973b";
      console.log(await this.veraxSdk.portal.isPortalRegistered(portalAddress));
    }
  }
}
