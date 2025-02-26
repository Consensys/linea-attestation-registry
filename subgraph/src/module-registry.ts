import { ModuleRegistered as ModuleRegisteredEvent } from "../generated/ModuleRegistry/ModuleRegistry";
import { Counter, Module } from "../generated/schema";
import { createAuditInformation } from "../src/utils";

export function handleModuleRegistered(event: ModuleRegisteredEvent): void {
  const module = new Module(event.params.moduleAddress.toHexString().toLowerCase());

  module.auditInformation = createAuditInformation(module.id, event);

  incrementModulesCount();

  module.moduleAddress = event.params.moduleAddress;
  module.name = event.params.name;
  module.description = event.params.description;

  module.save();
}

function incrementModulesCount(): void {
  let counter = Counter.load("counter");

  if (!counter) {
    counter = new Counter("counter");
  }

  if (!counter.modules) {
    counter.modules = 1;
  } else {
    counter.modules += 1;
  }

  counter.save();
}
