import { Address, ethereum } from "@graphprotocol/graph-ts";
import {
  AttestationRegistryUpdated,
  ModuleRegistryUpdated,
  PortalRegistryUpdated,
  SchemaRegistryUpdated,
} from "../generated/Router/Router";
import { RegistryUpdate } from "../generated/schema";
import { createAuditInformation, getRegistryName } from "./utils";

function handleRegistryUpdate(registryAddress: Address, registryType: string, event: ethereum.Event): void {
  const eventId = event.transaction.hash.toHexString();
  const update = new RegistryUpdate(eventId);
  update.registryType = registryType;
  update.registryName = getRegistryName(registryType);
  update.registryAddress = registryAddress;
  update.auditInformation = createAuditInformation(eventId, event);
  update.save();
}

export function handleAttestationRegistryUpdated(event: AttestationRegistryUpdated): void {
  handleRegistryUpdate(event.params.registryAddress, "Attestation", event);
}

export function handleModuleRegistryUpdated(event: ModuleRegistryUpdated): void {
  handleRegistryUpdate(event.params.registryAddress, "Module", event);
}

export function handlePortalRegistryUpdated(event: PortalRegistryUpdated): void {
  handleRegistryUpdate(event.params.registryAddress, "Portal", event);
}

export function handleSchemaRegistryUpdated(event: SchemaRegistryUpdated): void {
  handleRegistryUpdate(event.params.registryAddress, "Schema", event);
}
