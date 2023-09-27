import {
  AttestationRegistered as AttestationRegisteredEvent,
  AttestationRegistry,
} from "../generated/AttestationRegistry/AttestationRegistry";
import { Attestation } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleAttestationRegistered(event: AttestationRegisteredEvent): void {
  const contract = AttestationRegistry.bind(event.address);
  const attestationData = contract.getAttestation(event.params.attestationId);
  const attestation = new Attestation(event.params.attestationId.toHex());

  attestation.schemaId = attestationData.schemaId;
  attestation.replacedBy = attestationData.replacedBy;
  attestation.attester = attestationData.attester;
  attestation.portal = attestationData.portal.toHexString();
  attestation.attestedDate = attestationData.attestedDate;
  attestation.expirationDate = attestationData.expirationDate;
  attestation.revocationDate = attestationData.revocationDate;
  attestation.version = BigInt.fromI32(attestationData.version);
  attestation.revoked = attestationData.revoked;
  attestation.subject = attestationData.subject;
  attestation.attestationData = attestationData.attestationData;

  attestation.save();
}
