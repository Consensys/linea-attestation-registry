import {
  SchemaContextUpdated,
  SchemaCreated as SchemaCreatedEvent,
  SchemaRegistry,
} from "../generated/SchemaRegistry/SchemaRegistry";
import { Counter, Schema } from "../generated/schema";
import { createAuditInformation } from "../src/utils";

export function handleSchemaCreated(event: SchemaCreatedEvent): void {
  const schema = new Schema(event.params.id.toHexString());

  schema.auditInformation = createAuditInformation(schema.id, event);

  incrementSchemasCount();

  schema.name = event.params.name;
  schema.description = event.params.description;
  schema.context = event.params.context;
  schema.schema = event.params.schemaString;
  schema.attestationCounter = 0;

  schema.save();
}

export function handleSchemaContextUpdated(event: SchemaContextUpdated): void {
  const schemaRegistryContract = SchemaRegistry.bind(event.address);
  const newContext = schemaRegistryContract.getSchema(event.params.id).context;
  const schema = Schema.load(event.params.id.toHexString());

  if (schema !== null) {
    schema.context = newContext;
    schema.auditInformation = createAuditInformation(schema.id, event);
    schema.save();
  }
}

function incrementSchemasCount(): void {
  let counter = Counter.load("counter");

  if (!counter) {
    counter = new Counter("counter");
  }

  if (!counter.schemas) {
    counter.schemas = 1;
  } else {
    counter.schemas += 1;
  }

  counter.save();
}
