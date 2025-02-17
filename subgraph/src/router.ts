import { Address, ethereum } from "@graphprotocol/graph-ts";
import {
  AttestationRegistryUpdated,
  ModuleRegistryUpdated,
  PortalRegistryUpdated,
  SchemaRegistryUpdated,
} from "../generated/Router/Router";
import { RegistryUpdate } from "../generated/schema";
import { createAuditInformation } from "../src/utils";

function handleRegistryUpdate(registryAddress: Address, registryType: string, event: ethereum.Event): void {
  const eventId = event.transaction.hash.toHexString();
  const update = new RegistryUpdate(eventId);
  update.registryType = registryType;
  update.registryName = `${registryType} Registry`;
  update.registryAddress = registryAddress;
  update.auditInformation = createAuditInformation(eventId, event);
  update.save();
}

export function handleAttestationRegistryUpdated(event: AttestationRegistryUpdated): void {
  handleRegistryUpdate(event.params.registryAddress, "ATTESTATION", event as unknown as ethereum.Event);
}

export function handleModuleRegistryUpdated(event: ModuleRegistryUpdated): void {
  handleRegistryUpdate(event.params.registryAddress, "MODULE", event as unknown as ethereum.Event);
}

export function handlePortalRegistryUpdated(event: PortalRegistryUpdated): void {
  handleRegistryUpdate(event.params.registryAddress, "PORTAL", event as unknown as ethereum.Event);
}

export function handleSchemaRegistryUpdated(event: SchemaRegistryUpdated): void {
  handleRegistryUpdate(event.params.registryAddress, "SCHEMA", event as unknown as ethereum.Event);
}
