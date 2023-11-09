import {
  AttestationRegistered as AttestationRegisteredEvent,
  AttestationRegistry,
  AttestationReplaced,
  AttestationRevoked,
  VersionUpdated,
} from "../generated/AttestationRegistry/AttestationRegistry";
import { Attestation, Counter, Portal, Schema, Version, Versions } from "../generated/schema";
import { BigInt, ByteArray, Bytes, ethereum } from "@graphprotocol/graph-ts";

export function handleAttestationRegistered(event: AttestationRegisteredEvent): void {
  const attestationRegistryContract = AttestationRegistry.bind(event.address);
  const attestationData = attestationRegistryContract.getAttestation(event.params.attestationId);
  const attestation = new Attestation(event.params.attestationId.toHex());

  incrementAttestationCount(attestationData.portal.toHexString());

  attestation.schemaId = attestationData.schemaId;
  attestation.replacedBy = attestationData.replacedBy;
  attestation.attester = attestationData.attester;
  attestation.portal = attestationData.portal;
  attestation.attestedDate = attestationData.attestedDate;
  attestation.expirationDate = attestationData.expirationDate;
  attestation.revocationDate = attestationData.revocationDate;
  attestation.version = BigInt.fromI32(attestationData.version);
  attestation.revoked = attestationData.revoked;
  attestation.subject = attestationData.subject;
  attestation.attestationData = attestationData.attestationData;

  // Get matching Schema
  const schema = Schema.load(attestationData.schemaId.toHex());

  if (schema) {
    // Split Schema into a "type fieldName" array
    const splitSchema = schema.schema.split(",");

    // Keep only the Schema's types
    const schemaTypes = splitSchema.map<string>((item) => item.trim().split(" ")[0]);

    // Join the types in a single coma-separated string
    const schemaString = schemaTypes.toString();

    // Add this Schema string to the Attestation Entity
    attestation.schemaString = schemaString;

    const encodedData = attestationData.attestationData;

    // Initiate the decoded data in case it's not decoded at all
    attestation.decodedData = ["NOT DECODED"];

    // Decode the encoded attestation data
    let decoded = ethereum.decode("(" + schemaString + ")", Bytes.fromUint8Array(encodedData));

    // If the decoding function didn't give anything, re-try with the encoded data as a tuple
    if (!decoded) {
      // Change attestation encoded data into an encoded Tuple
      const tuplePrefix = ByteArray.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000020");
      const encodedDataAsTuple = new Uint8Array(tuplePrefix.length + encodedData.length);
      encodedDataAsTuple.set(tuplePrefix, 0);
      encodedDataAsTuple.set(encodedData, tuplePrefix.length);

      // Decode the tuple
      decoded = ethereum.decode("(" + schemaString + ")", Bytes.fromUint8Array(encodedDataAsTuple));
    }

    // If the decode function went through, save it as an Array of Strings
    if (decoded) {
      const tempStringArray: string[] = [];

      // Make the decoded data into a Tuple
      const tupleValue = decoded.toTuple();

      // Convert every field of the Tuple into a String
      for (let i = 0; i < tupleValue.length; i++) {
        tempStringArray.push(valueToString(tupleValue[i]));
      }

      // Add this decoded Array to the Attestation Entity
      attestation.decodedData =
        tempStringArray.toString().length < 2000
          ? tempStringArray
          : [tempStringArray.toString().substring(0, 2000) + " ... TRUNCATED ..."];
    }
  }

  attestation.save();
}

export function handleAttestationRevoked(event: AttestationRevoked): void {
  const attestationRegistryContract = AttestationRegistry.bind(event.address);
  const attestationData = attestationRegistryContract.getAttestation(event.params.attestationId);
  const attestation = Attestation.load(event.params.attestationId.toHex());

  if (attestation) {
    attestation.revoked = true;
    attestation.revocationDate = attestationData.revocationDate;
    attestation.save();
  }
}

export function handleAttestationReplaced(event: AttestationReplaced): void {
  const attestation = Attestation.load(event.params.attestationId.toHex());

  if (attestation) {
    attestation.replacedBy = event.params.replacedBy;
    attestation.save();
  }
}

export function handleVersionUpdated(event: VersionUpdated): void {
  let versions = Versions.load("versions");
  if (!versions) {
    versions = new Versions("versions");
  }
  const version = new Version(`${event.params.version.toString().concat(event.block.timestamp.toString())}`);
  version.versionNumber = event.params.version;
  version.timestamp = event.block.timestamp;
  version.versions = "versions";
  version.save();

  versions.history.load().push(version);
  versions.current = version.id;
  versions.save();
}

function valueToString(value: ethereum.Value): string {
  switch (value.kind) {
    case ethereum.ValueKind.ADDRESS:
      return value.toAddress().toHexString();
    case ethereum.ValueKind.FIXED_BYTES:
      return value.toBytes().toHex();
    case ethereum.ValueKind.BYTES:
      return value.toString();
    case ethereum.ValueKind.INT:
      return value.toBigInt().toHexString();
    case ethereum.ValueKind.UINT:
      return value.toBigInt().toHexString();
    case ethereum.ValueKind.BOOL:
      return value.toBoolean().toString();
    case ethereum.ValueKind.STRING:
      return value.toString();
    case ethereum.ValueKind.FIXED_ARRAY:
      return value
        .toArray()
        .map<string>((item) => valueToString(item))
        .toString();
    case ethereum.ValueKind.ARRAY:
      return value
        .toArray()
        .map<string>((item) => valueToString(item))
        .toString();
    case ethereum.ValueKind.TUPLE:
      return "TUPLE NOT SUPPORTED";
    default:
      return "UNKNOWN TYPE";
  }
}

function incrementAttestationCount(portalAddress: string): void {
  let counter = Counter.load("counter");

  if (!counter) {
    counter = new Counter("counter");
  }

  if (!counter.attestations) {
    counter.attestations = 1;
  } else {
    counter.attestations += 1;
  }

  counter.save();

  // Increment attestation counter for corresponding portal
  const portal = Portal.load(portalAddress);

  if (portal) {
    if (!portal.attestationCounter) {
      portal.attestationCounter = 1;
    } else {
      portal.attestationCounter += 1;
    }

    portal.save();
  }
}
