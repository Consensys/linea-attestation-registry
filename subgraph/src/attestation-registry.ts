import {
  AttestationRegistered as AttestationRegisteredEvent,
  AttestationRegistry,
  AttestationReplaced,
  AttestationRevoked,
  VersionUpdated,
} from "../generated/AttestationRegistry/AttestationRegistry";
import { Attestation, Audit, AuditInformation, Counter, Portal, RegistryVersion, Schema } from "../generated/schema";
import { BigInt, ByteArray, Bytes, ethereum } from "@graphprotocol/graph-ts";

export function handleAttestationRegistered(event: AttestationRegisteredEvent): void {
  const attestationRegistryContract = AttestationRegistry.bind(event.address);
  const attestationData = attestationRegistryContract.getAttestation(event.params.attestationId);
  const attestation = new Attestation(event.params.attestationId.toHexString().toLowerCase());

  const audit = new Audit(event.transaction.hash.toHexString().toLowerCase());
  audit.blockNumber = event.block.number;
  audit.transactionHash = event.transaction.hash;
  audit.transactionTimestamp = event.block.timestamp;
  audit.fromAddress = event.transaction.from;
  audit.toAddress = event.transaction.to;
  audit.valueTransferred = event.transaction.value;
  audit.gasPrice = event.transaction.gasPrice;

  audit.save();

  const auditInformation = new AuditInformation(attestation.id);
  auditInformation.creation = audit.id.toLowerCase();
  auditInformation.lastModification = audit.id.toLowerCase();
  auditInformation.modifications = [audit.id.toLowerCase()];

  auditInformation.save();

  attestation.auditInformation = auditInformation.id.toLowerCase();

  incrementAttestationCount(attestationData.portal.toHexString(), attestationData.schemaId.toHexString());

  attestation.replacedBy = attestationData.replacedBy;
  attestation.attester = attestationData.attester;
  attestation.attestedDate = attestationData.attestedDate;
  attestation.expirationDate = attestationData.expirationDate;
  attestation.revocationDate = attestationData.revocationDate;
  attestation.version = BigInt.fromI32(attestationData.version);
  attestation.revoked = attestationData.revoked;
  attestation.encodedSubject = attestationData.subject;
  attestation.attestationData = attestationData.attestationData;
  attestation.schema = attestationData.schemaId.toHexString().toLowerCase();
  attestation.portal = attestationData.portal.toHexString().toLowerCase();

  // If the subject looks like an encoded address, decode it to an address
  const tempSubject = ethereum.decode("address", attestationData.subject);
  attestation.subject = tempSubject ? tempSubject.toAddress() : attestationData.subject;

  // Get matching Schema
  const schema = Schema.load(attestationData.schemaId.toHex());

  if (schema) {
    // Remove the first and last characters of the schema string (the parentheses) if they exist
    let tempSchema = schema.schema;
    tempSchema = tempSchema.startsWith("(") ? tempSchema.substring(1) : tempSchema;
    tempSchema = tempSchema.endsWith(")") ? tempSchema.substring(0, tempSchema.length - 1) : tempSchema;

    // Split Schema into a "type fieldName" array
    const splitSchema = tempSchema.split(",");

    // Keep only the Schema's types
    const schemaTypes = splitSchema.map<string>((item) => item.trim().split(" ")[0]);

    // Join the types in a single coma-separated string
    const schemaString = schemaTypes.toString();

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
      // Make the decoded data into a Tuple
      const tupleValue = decoded.toTuple();

      // Convert every field of the Tuple into a String
      const tempStringArray: string[] = tupleToStringArray(tupleValue);

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
  const attestation = Attestation.load(event.params.attestationId.toHexString().toLowerCase());

  if (attestation) {
    attestation.revoked = true;
    attestation.revocationDate = attestationData.revocationDate;

    const audit = new Audit(event.transaction.hash.toHexString().toLowerCase());
    audit.blockNumber = event.block.number;
    audit.transactionHash = event.transaction.hash;
    audit.transactionTimestamp = event.block.timestamp;
    audit.fromAddress = event.transaction.from;
    audit.toAddress = event.transaction.to;
    audit.valueTransferred = event.transaction.value;
    audit.gasPrice = event.transaction.gasPrice;

    audit.save();

    const auditInformation = AuditInformation.load(attestation.id);
    if (auditInformation !== null) {
      auditInformation.lastModification = audit.id.toLowerCase();
      auditInformation.modifications.push(audit.id.toLowerCase());

      auditInformation.save();

      attestation.auditInformation = auditInformation.id.toLowerCase();
    }

    attestation.save();
  }
}

export function handleAttestationReplaced(event: AttestationReplaced): void {
  const attestation = Attestation.load(event.params.attestationId.toHexString().toLowerCase());

  if (attestation) {
    attestation.replacedBy = event.params.replacedBy;

    const audit = new Audit(event.transaction.hash.toHexString().toLowerCase());
    audit.blockNumber = event.block.number;
    audit.transactionHash = event.transaction.hash;
    audit.transactionTimestamp = event.block.timestamp;
    audit.fromAddress = event.transaction.from;
    audit.toAddress = event.transaction.to;
    audit.valueTransferred = event.transaction.value;
    audit.gasPrice = event.transaction.gasPrice;

    audit.save();

    const auditInformation = AuditInformation.load(attestation.id);
    if (auditInformation !== null) {
      auditInformation.lastModification = audit.id.toLowerCase();
      auditInformation.modifications.push(audit.id.toLowerCase());

      auditInformation.save();

      attestation.auditInformation = auditInformation.id.toLowerCase();
    }

    attestation.save();
  }
}

export function handleVersionUpdated(event: VersionUpdated): void {
  let registryVersion = RegistryVersion.load("registry-version");

  if (!registryVersion) {
    registryVersion = new RegistryVersion("registry-version");
  }

  const audit = new Audit(event.transaction.hash.toHexString().toLowerCase());
  audit.blockNumber = event.block.number;
  audit.transactionHash = event.transaction.hash;
  audit.transactionTimestamp = event.block.timestamp;
  audit.fromAddress = event.transaction.from;
  audit.toAddress = event.transaction.to;
  audit.valueTransferred = event.transaction.value;
  audit.gasPrice = event.transaction.gasPrice;

  audit.save();

  let auditInformation = AuditInformation.load(registryVersion.id);
  if (auditInformation === null) {
    auditInformation = new AuditInformation(registryVersion.id);
    auditInformation.creation = audit.id.toLowerCase();
    auditInformation.lastModification = audit.id.toLowerCase();
    auditInformation.modifications = [audit.id.toLowerCase()];
  } else {
    auditInformation.lastModification = audit.id.toLowerCase();
    auditInformation.modifications.push(audit.id.toLowerCase());
  }

  auditInformation.save();

  registryVersion.auditInformation = auditInformation.id.toLowerCase();

  registryVersion.versionNumber = event.params.version;
  registryVersion.timestamp = event.block.timestamp;

  registryVersion.save();
}

function tupleToStringArray(tuple: ethereum.Tuple): string[] {
  const tempStringArray: string[] = [];

  for (let i = 0; i < tuple.length; i++) {
    tempStringArray.push(valueToString(tuple[i]));
  }

  return tempStringArray;
}

function valueToString(value: ethereum.Value): string {
  switch (value.kind) {
    case ethereum.ValueKind.ADDRESS:
      return value.toAddress().toHexString();
    case ethereum.ValueKind.FIXED_BYTES:
      return value.toBytes().toHex();
    case ethereum.ValueKind.BYTES:
      return value.toBytes().toHex();
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
      return tupleToStringArray(value.toTuple()).toString();
    default:
      return "UNKNOWN TYPE";
  }
}

function incrementAttestationCount(portalAddress: string, schemaId: string): void {
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

  // Increment attestation counter for corresponding schema
  const schema = Schema.load(schemaId);

  if (schema) {
    if (!schema.attestationCounter) {
      schema.attestationCounter = 1;
    } else {
      schema.attestationCounter += 1;
    }

    schema.save();
  }
}
