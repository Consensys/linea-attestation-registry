import { ethereum } from "@graphprotocol/graph-ts";
import { Audit, AuditInformation } from "../generated/schema";

export function createAuditInformation(eventId: string, event: ethereum.Event): string {
  const auditId = eventId + "-audit";
  const audit = new Audit(auditId);
  if (!event) return auditId;

  const txn = event.transaction;
  const block = event.block;

  audit.blockNumber = block.number;
  audit.transactionHash = txn.hash;
  audit.transactionTimestamp = block.timestamp;
  audit.fromAddress = txn.from;
  audit.toAddress = txn.to || txn.from;
  audit.valueTransferred = txn.value;
  audit.gasPrice = txn.gasPrice;
  audit.save();

  const auditInfo = new AuditInformation(eventId);
  auditInfo.creation = auditId;
  auditInfo.lastModification = auditId;
  auditInfo.modifications = [auditId];
  auditInfo.save();

  return eventId;
}
