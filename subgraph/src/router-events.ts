import { RouterSet as SchemaRegistryRouterSetEvent } from "../generated/SchemaRegistry/SchemaRegistry";
import { RouterSet as ModuleRegistryRouterSetEvent } from "../generated/ModuleRegistry/ModuleRegistry";
import { RouterSet as AttestationRegistryRouterSetEvent } from "../generated/AttestationRegistry/AttestationRegistry";
import { RouterSet as AttestationReaderRouterSetEvent } from "../generated/AttestationReader/AttestationReader";
import { RouterUpdate, Audit, AuditInformation } from "../generated/schema";

export function handleSchemaRegistryRouterSet(event: SchemaRegistryRouterSetEvent): void {
  handleRouterSet(event, "SchemaRegistry");
}

export function handleModuleRegistryRouterSet(event: ModuleRegistryRouterSetEvent): void {
  handleRouterSet(event, "ModuleRegistry");
}

export function handleAttestationRegistryRouterSet(event: AttestationRegistryRouterSetEvent): void {
  handleRouterSet(event, "AttestationRegistry");
}

export function handleAttestationReaderRouterSet(event: AttestationReaderRouterSetEvent): void {
  handleRouterSet(event, "AttestationReader");
}

// Common handler function with union type for event parameter
function handleRouterSet(
  event:
    | SchemaRegistryRouterSetEvent
    | ModuleRegistryRouterSetEvent
    | AttestationRegistryRouterSetEvent
    | AttestationReaderRouterSetEvent,
  registryName: string,
): void {
  const id = event.transaction.hash.toHexString().toLowerCase();
  const routerUpdate = new RouterUpdate(id);

  const audit = new Audit(id);
  audit.blockNumber = event.block.number;
  audit.transactionHash = event.transaction.hash;
  audit.transactionTimestamp = event.block.timestamp;
  audit.fromAddress = event.transaction.from;
  audit.toAddress = event.transaction.to;
  audit.valueTransferred = event.transaction.value;
  audit.gasPrice = event.transaction.gasPrice;
  audit.save();

  const auditInformation = new AuditInformation(id);
  auditInformation.creation = audit.id;
  auditInformation.lastModification = audit.id;
  auditInformation.modifications = [audit.id];
  auditInformation.save();

  routerUpdate.registryType = registryName;
  routerUpdate.registryAddress = event.address;
  routerUpdate.routerAddress = event.params.router;
  routerUpdate.timestamp = event.block.timestamp;
  routerUpdate.auditInformation = auditInformation.id;
  routerUpdate.save();
}
