import { SchemaCreated as SchemaCreatedEvent, SchemaRegistry } from "../generated/SchemaRegistry/SchemaRegistry";
import { Counter, Schema } from "../generated/schema";

export function handleSchemaCreated(event: SchemaCreatedEvent): void {
  const contract = SchemaRegistry.bind(event.address);
  const schemaData = contract.getSchema(event.params.id);
  const schema = new Schema(event.params.id.toHex());

  incrementSchemasCount();

  schema.name = schemaData.name;
  schema.description = schemaData.description;
  schema.context = schemaData.context;
  schema.schema = schemaData.schema;

  schema.save();
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
