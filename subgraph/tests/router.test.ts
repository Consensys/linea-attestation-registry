import { afterEach, assert, clearStore, describe, test } from "matchstick-as";
import { Address, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { newTypedMockEvent } from "matchstick-as/assembly/defaults";
import {
  handleAttestationRegistryUpdated,
  handleModuleRegistryUpdated,
  handlePortalRegistryUpdated,
  handleSchemaRegistryUpdated,
} from "../src/router";
import {
  AttestationRegistryUpdated,
  ModuleRegistryUpdated,
  PortalRegistryUpdated,
  SchemaRegistryUpdated,
} from "../generated/Router/Router";

describe("handleAttestationRegistryUpdated()", () => {
  afterEach(() => {
    clearStore();
  });

  test("Should create a new AttestationRegistryUpdate entity and audit data", () => {
    const eventId = Bytes.fromHexString("0x29eb70a51effce09e130de98c567e2d4ce8c3145d9190c95fbbfdf9092a76a61");
    const eventIdString = eventId.toHexString();
    const registryAddress = Address.fromString("f75be6f9418710fd516fa82afb3aad07e11a0f1b");

    assert.entityCount("RegistryUpdate", 0);
    assert.entityCount("AuditInformation", 0);
    assert.entityCount("Audit", 0);

    const attestationRegistryUpdateEvent = newTypedMockEvent<AttestationRegistryUpdated>();
    attestationRegistryUpdateEvent.transaction.hash = eventId;
    attestationRegistryUpdateEvent.parameters = [];
    attestationRegistryUpdateEvent.parameters.push(
      new ethereum.EventParam("registryAddress", ethereum.Value.fromAddress(registryAddress)),
    );

    handleAttestationRegistryUpdated(attestationRegistryUpdateEvent);

    assert.entityCount("RegistryUpdate", 1);

    assert.fieldEquals("RegistryUpdate", eventIdString, "id", eventIdString);
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryType", "Attestation");
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryName", "Attestation Registry");
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryAddress", registryAddress.toHexString());

    assert.entityCount("AuditInformation", 1);
    assert.fieldEquals("AuditInformation", eventIdString, "id", eventIdString);

    assert.entityCount("Audit", 1);
  });

  test("Should create a new ModuleRegistryUpdate entity and audit data", () => {
    const eventId = Bytes.fromHexString("0x06f1965892a6841b11e6af56e3c3e8b78deed628871fa3656d8bb71b97e21f1f");
    const eventIdString = eventId.toHexString();
    const registryAddress = Address.fromString("f75be6f9418710fd516fa82afb3aad07e11a0f1b");

    assert.entityCount("RegistryUpdate", 0);
    assert.entityCount("AuditInformation", 0);
    assert.entityCount("Audit", 0);

    const moduleRegistryUpdateEvent = newTypedMockEvent<ModuleRegistryUpdated>();
    moduleRegistryUpdateEvent.transaction.hash = eventId;
    moduleRegistryUpdateEvent.parameters = [];
    moduleRegistryUpdateEvent.parameters.push(
      new ethereum.EventParam("registryAddress", ethereum.Value.fromAddress(registryAddress)),
    );

    handleModuleRegistryUpdated(moduleRegistryUpdateEvent);

    assert.entityCount("RegistryUpdate", 1);

    assert.fieldEquals("RegistryUpdate", eventIdString, "id", eventIdString);
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryType", "Module");
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryName", "Module Registry");
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryAddress", registryAddress.toHexString());

    assert.entityCount("AuditInformation", 1);
    assert.fieldEquals("AuditInformation", eventIdString, "id", eventIdString);

    assert.entityCount("Audit", 1);
  });

  test("Should create a new PortalRegistryUpdate entity and audit data", () => {
    const eventId = Bytes.fromHexString("0x251c694daf7fa2e532abf17d4defa039170894ec655c72e390497968bb0cf9c1");
    const eventIdString = eventId.toHexString();
    const registryAddress = Address.fromString("f75be6f9418710fd516fa82afb3aad07e11a0f1b");

    assert.entityCount("RegistryUpdate", 0);
    assert.entityCount("AuditInformation", 0);
    assert.entityCount("Audit", 0);

    const portalRegistryUpdateEvent = newTypedMockEvent<PortalRegistryUpdated>();
    portalRegistryUpdateEvent.transaction.hash = eventId;
    portalRegistryUpdateEvent.parameters = [];
    portalRegistryUpdateEvent.parameters.push(
      new ethereum.EventParam("registryAddress", ethereum.Value.fromAddress(registryAddress)),
    );

    handlePortalRegistryUpdated(portalRegistryUpdateEvent);

    assert.entityCount("RegistryUpdate", 1);

    assert.fieldEquals("RegistryUpdate", eventIdString, "id", eventIdString);
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryType", "Portal");
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryName", "Portal Registry");
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryAddress", registryAddress.toHexString());

    assert.entityCount("AuditInformation", 1);
    assert.fieldEquals("AuditInformation", eventIdString, "id", eventIdString);

    assert.entityCount("Audit", 1);
  });

  test("Should create a new SchemaRegistryUpdate entity and audit data", () => {
    const eventId = Bytes.fromHexString("0x632e6a0bb4f268b3bb1e7480b8ea60d416df434681831f42d4ade1e2ac8c675d");
    const eventIdString = eventId.toHexString();
    const registryAddress = Address.fromString("f75be6f9418710fd516fa82afb3aad07e11a0f1b");

    assert.entityCount("RegistryUpdate", 0);
    assert.entityCount("AuditInformation", 0);
    assert.entityCount("Audit", 0);

    const schemaRegistryUpdateEvent = newTypedMockEvent<SchemaRegistryUpdated>();
    schemaRegistryUpdateEvent.transaction.hash = eventId;
    schemaRegistryUpdateEvent.parameters = [];
    schemaRegistryUpdateEvent.parameters.push(
      new ethereum.EventParam("registryAddress", ethereum.Value.fromAddress(registryAddress)),
    );

    handleSchemaRegistryUpdated(schemaRegistryUpdateEvent);

    assert.entityCount("RegistryUpdate", 1);

    assert.fieldEquals("RegistryUpdate", eventIdString, "id", eventIdString);
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryType", "Schema");
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryName", "Schema Registry");
    assert.fieldEquals("RegistryUpdate", eventIdString, "registryAddress", registryAddress.toHexString());

    assert.entityCount("AuditInformation", 1);
    assert.fieldEquals("AuditInformation", eventIdString, "id", eventIdString);

    assert.entityCount("Audit", 1);
  });
});
