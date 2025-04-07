import { Address } from "viem";
import { VeraxSdk } from "../../src/VeraxSdk";
import { Attestation_filter } from "../../.graphclient";
import { DEFAULT_ATTESTATION_ID, DEFAULT_PORTAL_ADDRESS_4, DEFAULT_SUBJECT } from "../constants";

export default class AttestationExamples {
  private veraxSdk: VeraxSdk;

  constructor(_veraxSdk: VeraxSdk) {
    this.veraxSdk = _veraxSdk;
  }

  async run(argv: string, methodName: string = "") {
    if (methodName.toLowerCase() == "findOneById".toLowerCase() || methodName == "") {
      const attestationId: string = argv === "" ? DEFAULT_ATTESTATION_ID : argv;
      console.log(await this.veraxSdk.attestation.findOneById(attestationId));
    }

    if (methodName.toLowerCase() == "findBy".toLowerCase() || methodName == "") {
      const filter: Attestation_filter | undefined = argv !== "" ? JSON.parse(argv) : { attester_not: DEFAULT_SUBJECT };
      console.log(await this.veraxSdk.attestation.findBy(2, 0, filter, "attestedDate", "desc"));
    }

    if (methodName.toLowerCase() == "getRelatedAttestations".toLowerCase() || methodName == "") {
      const attestationId: string = argv === "" ? DEFAULT_ATTESTATION_ID : argv;
      console.log(await this.veraxSdk.attestation.getRelatedAttestations(attestationId));
    }

    if (methodName.toLowerCase() == "isRegistered".toLowerCase() || methodName == "") {
      const attestationId: string = argv === "" ? DEFAULT_ATTESTATION_ID : argv;
      console.log(await this.veraxSdk.attestation.isRegistered(attestationId));
    }

    if (methodName.toLowerCase() == "isRevocable".toLowerCase() || methodName == "") {
      const portalId: string = argv === "" ? DEFAULT_PORTAL_ADDRESS_4 : argv;
      console.log(await this.veraxSdk.attestation.isRevocable(portalId));
    }

    if (methodName.toLowerCase() == "getAttestation".toLowerCase() || methodName == "") {
      const attestationId: string = argv === "" ? DEFAULT_ATTESTATION_ID : argv;
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
      const account = params?.account ? (params.account as Address) : DEFAULT_SUBJECT;
      const id = params?.id ? (params.id as unknown as number) : 765;

      console.log(await this.veraxSdk.attestation.balanceOf(account, id));
    }

    if (methodName.toLowerCase() == "balanceOfBatch".toLowerCase() || methodName == "") {
      let params;
      if (argv !== "") params = JSON.parse(argv);
      const accounts: Address[] = params?.accounts
        ? (params.accounts as Address[])
        : [DEFAULT_SUBJECT, DEFAULT_SUBJECT];
      const ids = params?.ids ? (params.ids as number[]) : [650, 765];

      console.log(await this.veraxSdk.attestation.balanceOfBatch(accounts, ids));
    }
  }
}
