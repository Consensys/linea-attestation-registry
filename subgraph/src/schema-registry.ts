import {
  SchemaContextUpdated,
  SchemaCreated as SchemaCreatedEvent,
  SchemaRegistry,
} from "../generated/SchemaRegistry/SchemaRegistry";
import { Audit, AuditInformation, Counter, Schema } from "../generated/schema";

export function handleSchemaCreated(event: SchemaCreatedEvent): void {
  const schema = new Schema(event.params.id.toHexString());

  const audit = new Audit(event.transaction.hash.toHexString().toLowerCase());
  audit.blockNumber = event.block.number;
  audit.transactionHash = event.transaction.hash;
  audit.transactionTimestamp = event.block.timestamp;
  audit.fromAddress = event.transaction.from;
  audit.toAddress = event.transaction.to;
  audit.valueTransferred = event.transaction.value;
  audit.gasPrice = event.transaction.gasPrice;

  audit.save();

  const auditInformation = new AuditInformation(schema.id);
  auditInformation.creation = audit.id.toLowerCase();
  auditInformation.lastModification = audit.id.toLowerCase();
  auditInformation.modifications = [audit.id.toLowerCase()];

  auditInformation.save();

  schema.auditInformation = auditInformation.id.toLowerCase();

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
  // Get matching Schema
  const schema = Schema.load(event.params.id.toHexString());

  if (schema !== null) {
    const audit = new Audit(event.transaction.hash.toHexString().toLowerCase());
    audit.blockNumber = event.block.number;
    audit.transactionHash = event.transaction.hash;
    audit.transactionTimestamp = event.block.timestamp;
    audit.fromAddress = event.transaction.from;
    audit.toAddress = event.transaction.to;
    audit.valueTransferred = event.transaction.value;
    audit.gasPrice = event.transaction.gasPrice;

    audit.save();

    const auditInformation = AuditInformation.load(schema.id);
    if (auditInformation !== null) {
      auditInformation.lastModification = audit.id.toLowerCase();
      auditInformation.modifications.push(audit.id.toLowerCase());

      auditInformation.save();

      schema.auditInformation = auditInformation.id.toLowerCase();
    }

    schema.context = newContext;
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
