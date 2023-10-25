import { Address } from "viem";
import VeraxSdk from "../../src/VeraxSdk";

export default class AttestationExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "") {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x00000000000000000000000000000000000000000000000000000000000007b5" : argv;
      console.log(await this.veraxSdk.attestation.findOneById(attestationId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      console.log(
        await this.veraxSdk.attestation.findBy(
          2,
          0,
          { attester_not: "0x809e815596AbEB3764aBf81BE2DC39fBBAcc9949" },
          "attestedDate",
          "desc",
        ),
      );
    }

    if (methodName.toLowerCase() == "getRelatedAttestations".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x0000000000000000000000000000000000000000000000000000000000000001" : argv;
      console.log(await this.veraxSdk.attestation.getRelatedAttestations(attestationId));
    }

    if (methodName.toLowerCase() == "simulateUpdateRouter".toLowerCase() || methodName == "") {
      const routerAddress: Address = argv === "" ? "0x736c78b2f2cBf4F921E8551b2acB6A5Edc9177D5" : (argv as Address);
      console.log(await this.veraxSdk.attestation.simulateUpdateRouter(routerAddress));
    }

    if (methodName.toLowerCase() == "updateRouter".toLowerCase() || methodName == "") {
      const routerAddress: Address = argv === "" ? "0x736c78b2f2cBf4F921E8551b2acB6A5Edc9177D5" : (argv as Address);
      console.log(await this.veraxSdk.attestation.updateRouter(routerAddress));
    }

    if (methodName.toLowerCase() == "simulateMassImport".toLowerCase() || methodName == "") {
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
      console.log(await this.veraxSdk.attestation.simulateMassImport(portalAddress, attestationPayloads));
    }

    if (methodName.toLowerCase() == "massImport".toLowerCase() || methodName == "") {
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
      console.log(await this.veraxSdk.attestation.massImport(portalAddress, attestationPayloads));
    }

    if (methodName.toLowerCase() == "simulateIncrementVersionNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.attestation.simulateIncrementVersionNumber());
    }

    if (methodName.toLowerCase() == "incrementVersionNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.attestation.incrementVersionNumber());
    }

    if (methodName.toLowerCase() == "isRegistered".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x00000000000000000000000000000000000000000000000000000000000007b5" : argv;
      console.log(await this.veraxSdk.attestation.isRegistered(attestationId));
    }

    if (methodName.toLowerCase() == "isRevocable".toLowerCase() || methodName == "") {
      const portalId: string = argv === "" ? "0xeea25bc2ec56cae601df33b8fc676673285e12cc" : argv;
      console.log(await this.veraxSdk.attestation.isRevocable(portalId));
    }

    if (methodName.toLowerCase() == "getAttestation".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x00000000000000000000000000000000000000000000000000000000000007b5" : argv;
      console.log(await this.veraxSdk.attestation.getAttestation(attestationId));
    }

    if (methodName.toLowerCase() == "getVersionNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.attestation.getVersionNumber());
    }

    if (methodName.toLowerCase() == "getAttestationIdCounter".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.attestation.getAttestationIdCounter());
    }

    if (methodName.toLowerCase() == "balanceOf".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const account = params?.account ? (params.account as Address) : "0x809e815596abeb3764abf81be2dc39fbbacc9949";
      const id = params?.id ? (params.id as unknown as number) : 1;

      console.log(await this.veraxSdk.attestation.balanceOf(account, id));
    }

    if (methodName.toLowerCase() == "balanceOfBatch".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const accounts = params?.accounts
        ? (params.accounts as Address[])
        : ["0x809e815596abeb3764abf81be2dc39fbbacc9949", "0x809e815596abeb3764abf81be2dc39fbbacc9949"];
      const ids = params?.ids ? (params.ids as number[]) : [1, 2];

      console.log(await this.veraxSdk.attestation.balanceOfBatch(accounts as Address[], ids));
    }
  }
}
