import { ModuleRegistered as ModuleRegisteredEvent, ModuleRegistry } from "../generated/ModuleRegistry/ModuleRegistry";
import { Counter, Module } from "../generated/schema";

export function handleModuleRegistered(event: ModuleRegisteredEvent): void {
  const contract = ModuleRegistry.bind(event.address);
  const moduleData = contract.modules(event.params.moduleAddress);
  const module = new Module(event.params.moduleAddress.toHex());

  incrementModulesCount();

  module.moduleAddress = moduleData.getModuleAddress();
  module.name = moduleData.getName();
  module.description = moduleData.getDescription();

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
