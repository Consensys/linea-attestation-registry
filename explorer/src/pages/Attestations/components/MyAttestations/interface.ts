import { Attestation } from "@verax-attestation-registry/verax-sdk";

export interface IMyAttestations {
  showMyAttestations: boolean;
  attestationsList: Attestation[] | undefined;
}
