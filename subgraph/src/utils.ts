import { ethereum } from "@graphprotocol/graph-ts";
import { Audit as AuditEntity, AuditInformation as AuditInfoEntity } from "../generated/schema";

export function createAuditInformation(eventId: string, event: ethereum.Event): string {
  const auditId = eventId + "-audit";
  const audit = new AuditEntity(auditId);
  if (!event) return auditId;

  const txn = event.transaction;
  const block = event.block;

  audit.blockNumber = block.number;
  audit.transactionHash = txn.hash;
  audit.transactionTimestamp = block.timestamp;
  audit.fromAddress = txn.from;
  // Only set toAddress for regular transactions (not contract creations)
  if (txn.to) {
    audit.toAddress = txn.to;
  }
  audit.valueTransferred = txn.value;
  audit.gasPrice = txn.gasPrice;
  audit.save();

  const auditInfo = new AuditInfoEntity(eventId);
  auditInfo.creation = auditId;
  auditInfo.lastModification = auditId;
  auditInfo.modifications = [auditId];
  auditInfo.save();

  return eventId;
}

export function getRegistryName(registryType: string): string {
  return `${registryType} Registry`;
}
