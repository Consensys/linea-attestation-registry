import { SchemaCreated as SchemaCreatedEvent, SchemaRegistry } from "../generated/SchemaRegistry/SchemaRegistry";
import { Schema } from "../generated/schema";

export function handleSchemaCreated(event: SchemaCreatedEvent): void {
  const contract = SchemaRegistry.bind(event.address);
  const schemaData = contract.getSchema(event.params.id);
  const schema = new Schema(event.params.id.toHex());

  schema.name = schemaData.name;
  schema.description = schemaData.description;
  schema.context = schemaData.context;
  schema.schema = schemaData.schema;

  schema.save();
}
