import { ModuleRegistered as ModuleRegisteredEvent } from "../generated/ModuleRegistry/ModuleRegistry";
import { Audit, AuditInformation, Counter, Module } from "../generated/schema";

export function handleModuleRegistered(event: ModuleRegisteredEvent): void {
  const module = new Module(event.params.moduleAddress.toHexString().toLowerCase());

  const audit = new Audit(event.transaction.hash.toHexString().toLowerCase());
  audit.blockNumber = event.block.number;
  audit.transactionHash = event.transaction.hash;
  audit.transactionTimestamp = event.block.timestamp;
  audit.fromAddress = event.transaction.from;
  audit.toAddress = event.transaction.to;
  audit.valueTransferred = event.transaction.value;
  audit.gasPrice = event.transaction.gasPrice;

  audit.save();

  const auditInformation = new AuditInformation(module.id);
  auditInformation.creation = audit.id.toLowerCase();
  auditInformation.lastModification = audit.id.toLowerCase();
  auditInformation.modifications = [audit.id.toLowerCase()];

  auditInformation.save();

  module.auditInformation = auditInformation.id.toLowerCase();

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
