import { ModuleRegistered as ModuleRegisteredEvent, ModuleRegistry } from "../generated/ModuleRegistry/ModuleRegistry";
import { Module } from "../generated/schema";

export function handleModuleRegistered(event: ModuleRegisteredEvent): void {
  const contract = ModuleRegistry.bind(event.address);
  const moduleData = contract.modules(event.params.moduleAddress);
  const module = new Module(event.params.moduleAddress.toHex());

  module.moduleAddress = moduleData.getModuleAddress();
  module.name = moduleData.getName();
  module.description = moduleData.getDescription();

  module.save();
}
