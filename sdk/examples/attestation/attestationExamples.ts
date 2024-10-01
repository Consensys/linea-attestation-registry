import { Address } from "viem";
import { VeraxSdk } from "../../src/VeraxSdk";
import { Attestation_filter } from "../../.graphclient";

export default class AttestationExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "", waitForConfirmation = false) {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x0000000000000000000000000000000000000000000000000000000000000129" : argv;
      console.log(await this.veraxSdk.attestation.findOneById(attestationId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      const filter: Attestation_filter | undefined =
        argv !== "" ? JSON.parse(argv) : { attester_not: "0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d" };
      console.log(await this.veraxSdk.attestation.findBy(2, 0, filter, "attestedDate", "desc"));
    }

    if (methodName.toLowerCase() == "findByMultiChain".toLowerCase() || methodName == "") {
      const filter: Attestation_filter | undefined =
        argv !== "" ? JSON.parse(argv) : { attester_not: "0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d" };
      console.log(
        await this.veraxSdk.attestation.findByMultiChain(
          [VeraxSdk.CHAINS.LINEA_MAINNET, VeraxSdk.CHAINS.ARBITRUM_MAINNET],
          2,
          0,
          filter,
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
      console.log(await this.veraxSdk.attestation.updateRouter(routerAddress, waitForConfirmation));
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
      console.log(await this.veraxSdk.attestation.massImport(portalAddress, attestationPayloads, waitForConfirmation));
    }

    if (methodName.toLowerCase() == "simulateIncrementVersionNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.attestation.simulateIncrementVersionNumber());
    }

    if (methodName.toLowerCase() == "incrementVersionNumber".toLowerCase() || methodName == "") {
      console.log(await this.veraxSdk.attestation.incrementVersionNumber(waitForConfirmation));
    }

    if (methodName.toLowerCase() == "isRegistered".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x0000000000000000000000000000000000000000000000000000000000000129" : argv;
      console.log(await this.veraxSdk.attestation.isRegistered(attestationId));
    }

    if (methodName.toLowerCase() == "isRevocable".toLowerCase() || methodName == "") {
      const portalId: string = argv === "" ? "0xeea25bc2ec56cae601df33b8fc676673285e12cc" : argv;
      console.log(await this.veraxSdk.attestation.isRevocable(portalId));
    }

    if (methodName.toLowerCase() == "getAttestation".toLowerCase() || methodName == "") {
      const attestationId: string =
        argv === "" ? "0x0000000000000000000000000000000000000000000000000000000000000129" : argv;
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
      const account = params?.account ? (params.account as Address) : "0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d";
      const id = params?.id ? (params.id as unknown as number) : 1;

      console.log(await this.veraxSdk.attestation.balanceOf(account, id));
    }

    if (methodName.toLowerCase() == "balanceOfBatch".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const accounts = params?.accounts
        ? (params.accounts as Address[])
        : ["0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d", "0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d"];
      const ids = params?.ids ? (params.ids as number[]) : [1, 2];

      console.log(await this.veraxSdk.attestation.balanceOfBatch(accounts as Address[], ids));
    }
  }
}
