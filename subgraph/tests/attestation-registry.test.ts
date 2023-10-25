import { afterEach, assert, beforeAll, clearStore, createMockedFunction, describe, test } from "matchstick-as";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  AttestationRegistered as AttestationRegisteredEvent,
  AttestationRegistry,
} from "../generated/AttestationRegistry/AttestationRegistry";
import { newTypedMockEvent } from "matchstick-as/assembly/defaults";
import { handleAttestationRegistered } from "../src/attestation-registry";
import { Schema } from "../generated/schema";

const attestationRegistryAddress = Address.fromString("C765F28096F6121C2F2b82D35A4346280164428b");
const attestationId = Bytes.fromHexString("0x00000000000000000000000000000000000000000000000000000000000010f5");
const schemaId = Bytes.fromHexString("0x7930a5ebfabdd4ef76bbb8cdcbc2225b6256d9511d9cf5ff0d6514c1bdb4d7dc");
const replacedBy = Bytes.fromHexString("0x00000000000000000000000000000000000000000000000000000000000010f6");
const attester = Address.fromString("e02bd7a6c8aa401189aebb5bad755c2610940a73");
const portal = Address.fromString("f75be6f9418710fd516fa82afb3aad07e11a0f1b");
const attestedDate = BigInt.fromString("1234");
const expirationDate = BigInt.fromString("1234");
const revocationDate = BigInt.fromString("0");
const version = BigInt.fromString("4");
const revoked = false;
const subject = Bytes.fromHexString("0xC765F28096F6121C2F2b82D35A4346280164428b");
const attestationData = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000001");

describe("handleAttestationRegistered()", () => {
  beforeAll(() => {
    const tupleArray: Array<ethereum.Value> = [
      ethereum.Value.fromFixedBytes(attestationId),
      ethereum.Value.fromFixedBytes(schemaId),
      ethereum.Value.fromFixedBytes(replacedBy),
      ethereum.Value.fromAddress(attester),
      ethereum.Value.fromAddress(portal),
      ethereum.Value.fromUnsignedBigInt(attestedDate),
      ethereum.Value.fromUnsignedBigInt(expirationDate),
      ethereum.Value.fromUnsignedBigInt(revocationDate),
      ethereum.Value.fromUnsignedBigInt(version),
      ethereum.Value.fromBoolean(revoked),
      ethereum.Value.fromBytes(subject),
      ethereum.Value.fromBytes(attestationData),
    ];

    // Convert it to the Tuple type
    const tuple = changetype<ethereum.Tuple>(tupleArray);

    // Create a tuple Value
    const tupleValue = ethereum.Value.fromTuple(tuple);

    createMockedFunction(
      attestationRegistryAddress,
      "getAttestation",
      "getAttestation(bytes32):((bytes32,bytes32,bytes32,address,address,uint64,uint64,uint64,uint16,bool,bytes,bytes))",
    )
      .withArgs([ethereum.Value.fromFixedBytes(attestationId)])
      .returns([tupleValue]);
  });

  afterEach(() => {
    clearStore();
  });

  test("Should mock the call to the AttestationRegistry", () => {
    const contract = AttestationRegistry.bind(attestationRegistryAddress);
    const result = contract.getAttestation(attestationId);

    assert.bytesEquals(result.attestationId, attestationId);
    assert.bytesEquals(result.schemaId, schemaId);
    assert.bytesEquals(result.replacedBy, replacedBy);
    assert.addressEquals(result.attester, attester);
    assert.addressEquals(result.portal, portal);
    assert.bigIntEquals(result.attestedDate, attestedDate);
    assert.bigIntEquals(result.expirationDate, expirationDate);
    assert.bigIntEquals(result.revocationDate, revocationDate);
    assert.i32Equals(result.version, version.toI32());
    assert.booleanEquals(result.revoked, revoked);
    assert.bytesEquals(result.subject, subject);
    assert.bytesEquals(result.attestationData, attestationData);
  });

  test("Should create a new Attestation entity", () => {
    assert.entityCount("Attestation", 0);

    const attestationRegisteredEvent = createAttestationRegisteredEvent(attestationId);

    handleAttestationRegistered(attestationRegisteredEvent);

    assert.entityCount("Attestation", 1);

    assert.fieldEquals("Attestation", attestationId.toHexString(), "id", attestationId.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "schemaId", schemaId.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "replacedBy", replacedBy.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attester", attester.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "portal", portal.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attestedDate", attestedDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "expirationDate", expirationDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revocationDate", revocationDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "version", version.toI32().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revoked", revoked.toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "subject", subject.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attestationData", attestationData.toHexString());
  });

  test("Should increment the attestations Counter", () => {
    assert.entityCount("Attestation", 0);
    assert.entityCount("Counter", 0);

    const attestationRegisteredEvent1 = createAttestationRegisteredEvent(attestationId);

    handleAttestationRegistered(attestationRegisteredEvent1);

    assert.entityCount("Attestation", 1);
    assert.fieldEquals("Counter", "counter", "attestations", "1");
  });

  test("Should decode a basic attestation data", () => {
    const schema = new Schema(schemaId.toHexString());
    schema.name = "name";
    schema.description = "description";
    schema.context = "context";
    schema.schema = "bool isOk";
    schema.save();

    const attestationRegisteredEvent = createAttestationRegisteredEvent(attestationId);

    handleAttestationRegistered(attestationRegisteredEvent);

    assert.entityCount("Attestation", 1);

    assert.fieldEquals("Attestation", attestationId.toHexString(), "id", attestationId.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "schemaId", schemaId.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "replacedBy", replacedBy.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attester", attester.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "portal", portal.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attestedDate", attestedDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "expirationDate", expirationDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revocationDate", revocationDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "version", version.toI32().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revoked", revoked.toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "subject", subject.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attestationData", attestationData.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "schemaString", "bool");
    assert.fieldEquals("Attestation", attestationId.toHexString(), "decodedData", "[true]");
  });
});

function createAttestationRegisteredEvent(attestationId: Bytes): AttestationRegisteredEvent {
  const attestationRegisteredEvent = newTypedMockEvent<AttestationRegisteredEvent>();
  attestationRegisteredEvent.address = attestationRegistryAddress;

  attestationRegisteredEvent.parameters.push(
    new ethereum.EventParam("attestationId", ethereum.Value.fromBytes(attestationId)),
  );

  return attestationRegisteredEvent;
}
