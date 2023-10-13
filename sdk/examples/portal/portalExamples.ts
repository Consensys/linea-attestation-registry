import VeraxSdk from "../../src/VeraxSdk";

export default class PortalExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(methodName: string = "") {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.portal.findOneById("0x1495341ab1019798dd08976f4a3e5ab0e095510b"));

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.portal.findBy({ ownerName: "Clique" }));

    if (methodName.toLowerCase() == "simulateAttest".toLowerCase() || methodName == "") {
      console.log(
        await this.veraxSdk.portal.simulateAttest(
          "0xeea25bc2ec56cae601df33b8fc676673285e12cc",
          {
            schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
            expirationDate: 1693583329,
            subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
            attestationData: [{ isBuidler: true }],
          },
          [],
        ),
      );
    }

    if (methodName.toLowerCase() == "attest" || methodName == "") {
      console.log(
        await this.veraxSdk.portal.attest(
          "0xeea25bc2ec56cae601df33b8fc676673285e12cc",
          {
            schemaId: "0x9ba590dd7fbd5bd1a7d06cdcb4744e20a49b3520560575cd63de17734a408738",
            expirationDate: 1693583329,
            subject: "0x828c9f04D1a07E3b0aBE12A9F8238a3Ff7E57b47",
            attestationData: [{ isBuidler: true }],
          },
          [],
        ),
      );
    }

    if (methodName.toLowerCase() == "simulateBulkAttest".toLowerCase() || methodName == "") {
      console.log(
        await this.veraxSdk.portal.simulateBulkAttest(
          "0x34798a866f52949208e67fb57ad36244024c50c0",
          [
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
          ],
          [],
        ),
      );
    }

    if (methodName.toLowerCase() == "bulkAttest".toLowerCase() || methodName == "") {
      console.log(
        await this.veraxSdk.portal.bulkAttest(
          "0x34798a866f52949208e67fb57ad36244024c50c0",
          [
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
              attestationData: [{ isBuidler: false }],
            },
          ],
          [[], []],
        ),
      );
    }

    if (methodName.toLowerCase() == "replace" || methodName == "") console.log(await this.veraxSdk.portal.replace());

    if (methodName.toLowerCase() == "revoke" || methodName == "") {
      console.log(
        await this.veraxSdk.portal.revoke(
          "0xeea25bc2ec56cae601df33b8fc676673285e12cc",
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        ),
      );
    }

    if (methodName.toLowerCase() == "simulateRevoke".toLowerCase() || methodName == "") {
      console.log(
        await this.veraxSdk.portal.simulateRevoke(
          "0xeea25bc2ec56cae601df33b8fc676673285e12cc",
          "0x0000000000000000000000000000000000000000000000000000000000000001",
        ),
      );
    }

    if (methodName.toLowerCase() == "simulateBulkRevoke".toLowerCase() || methodName == "")
      console.log(
        await this.veraxSdk.portal.simulateBulkRevoke("0x34798a866f52949208e67fb57ad36244024c50c0", [
          "0x00000000000000000000000000000000000000000000000000000000000010a0",
          "0x00000000000000000000000000000000000000000000000000000000000010a1",
        ]),
      );

    if (methodName.toLowerCase() == "bulkRevoke".toLowerCase() || methodName == "")
      console.log(
        await this.veraxSdk.portal.bulkRevoke("0x34798a866f52949208e67fb57ad36244024c50c0", [
          "0x00000000000000000000000000000000000000000000000000000000000010a0",
          "0x00000000000000000000000000000000000000000000000000000000000010a1",
        ]),
      );

    if (methodName.toLowerCase() == "massImport".toLowerCase() || methodName == "")
      console.log(await this.veraxSdk.portal.massImport());

    if (methodName.toLowerCase() == "register" || methodName == "") console.log(await this.veraxSdk.portal.register());

    if (methodName.toLowerCase() == "clone" || methodName == "") console.log(await this.veraxSdk.portal.clone());
  }
}
