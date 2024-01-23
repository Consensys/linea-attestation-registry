import { afterEach, assert, clearStore, describe, test } from "matchstick-as";
import { Bytes, ethereum } from "@graphprotocol/graph-ts";
import { newTypedMockEvent } from "matchstick-as/assembly/defaults";
import { handleSchemaCreated } from "../src/schema-registry";
import { SchemaCreated, SchemaCreated as SchemaCreatedEvent } from "../generated/SchemaRegistry/SchemaRegistry";

describe("handleSchemaCreated()", () => {
  const schemaId = "0x7930a5ebfabdd4ef76bbb8cdcbc2225b6256d9511d9cf5ff0d6514c1bdb4d7dc";
  const schemaName = "module name";
  const schemaDescription = "module description";
  const schemaContext = "schema context";
  const schemaString = "(bool isBuilder)";

  afterEach(() => {
    clearStore();
  });

  test("Should create a new Schema entity", () => {
    assert.entityCount("Schema", 0);

    const schemaCreatedEvent = createSchemaCreatedEvent(
      schemaId,
      schemaName,
      schemaDescription,
      schemaContext,
      schemaString,
    );

    handleSchemaCreated(schemaCreatedEvent);

    assert.entityCount("Schema", 1);

    assert.fieldEquals("Schema", schemaId, "id", schemaId);
    assert.fieldEquals("Schema", schemaId, "name", schemaName);
    assert.fieldEquals("Schema", schemaId, "description", schemaDescription);
    assert.fieldEquals("Schema", schemaId, "context", schemaContext);
    assert.fieldEquals("Schema", schemaId, "schema", schemaString);
    assert.fieldEquals("Schema", schemaId, "attestationCounter", "0");
  });

  test("Should increment the schemas Counter", () => {
    assert.entityCount("Schema", 0);

    const schemaId1 = "0x7930a5ebfabdd4ef76bbb8cdcbc2225b6256d9511d9cf5ff0d6514c1bdb4d7dc";
    const schemaId2 = "0x8930a5ebfabdd4ef76bbb8cdcbc2225b6256d9511d9cf5ff0d6514c1bdb4d7dc";

    const schemaCreatedEvent1 = createSchemaCreatedEvent(
      schemaId1,
      schemaName,
      schemaDescription,
      schemaContext,
      schemaString,
    );

    handleSchemaCreated(schemaCreatedEvent1);

    assert.entityCount("Schema", 1);
    assert.fieldEquals("Counter", "counter", "schemas", "1");

    const schemaCreatedEvent2 = createSchemaCreatedEvent(
      schemaId2,
      schemaName,
      schemaDescription,
      schemaContext,
      schemaString,
    );

    handleSchemaCreated(schemaCreatedEvent2);

    assert.entityCount("Schema", 2);
    assert.fieldEquals("Counter", "counter", "schemas", "2");
  });
});

function createSchemaCreatedEvent(
  schemaId: string,
  schemaName: string,
  schemaDescription: string,
  schemaContext: string,
  schemaString: string,
): SchemaCreated {
  const schemaCreatedEvent = newTypedMockEvent<SchemaCreatedEvent>();

  schemaCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromBytes(Bytes.fromHexString(schemaId))),
  );
  schemaCreatedEvent.parameters.push(new ethereum.EventParam("name", ethereum.Value.fromString(schemaName)));
  schemaCreatedEvent.parameters.push(
    new ethereum.EventParam("description", ethereum.Value.fromString(schemaDescription)),
  );
  schemaCreatedEvent.parameters.push(new ethereum.EventParam("context", ethereum.Value.fromString(schemaContext)));
  schemaCreatedEvent.parameters.push(new ethereum.EventParam("schemaString", ethereum.Value.fromString(schemaString)));

  return schemaCreatedEvent;
}
