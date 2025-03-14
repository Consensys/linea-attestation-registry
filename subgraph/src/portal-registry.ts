import { Bytes, store } from "@graphprotocol/graph-ts";
import {
  IssuerAdded,
  IssuerRemoved,
  PortalRegistered as PortalRegisteredEvent,
  PortalRegistry,
  PortalRevoked as PortalRevokedEvent,
} from "../generated/PortalRegistry/PortalRegistry";
import { AuditInformation, Counter, Issuer, Portal } from "../generated/schema";
import { createAuditInformation } from "../src/utils";

export function handlePortalRegistered(event: PortalRegisteredEvent): void {
  const contract = PortalRegistry.bind(event.address);
  const portalData = contract.getPortalByAddress(event.params.portalAddress);
  const portal = new Portal(event.params.portalAddress.toHexString().toLowerCase());

  portal.auditInformation = createAuditInformation(portal.id, event);

  incrementPortalsCount();

  portal.name = event.params.name;
  portal.description = event.params.description;
  portal.ownerAddress = portalData.ownerAddress;
  portal.modules = changetype<Bytes[]>(portalData.modules);
  portal.isRevocable = portalData.isRevocable;
  portal.ownerName = portalData.ownerName;
  portal.attestationCounter = 0;

  portal.save();
}

export function handlePortalRevoked(event: PortalRevokedEvent): void {
  const portalId = event.params.portalAddress.toHexString();
  const portal = Portal.load(portalId);

  if (portal != null) {
    // Delete the Portal entity
    store.remove("Portal", portalId);
  }

  const auditInformation = AuditInformation.load(portalId);

  if (auditInformation != null) {
    // Delete the AuditInformation entity
    store.remove("AuditInformation", portalId);
  }
}

export function handleIssuerAdded(event: IssuerAdded): void {
  const issuer = new Issuer(event.params.issuerAddress.toHexString());
  issuer.auditInformation = createAuditInformation(issuer.id, event);
  issuer.save();
}

export function handleIssuerRemoved(event: IssuerRemoved): void {
  const issuerId = event.params.issuerAddress.toHexString();
  const issuer = Issuer.load(issuerId);

  if (issuer != null) {
    // Delete the Issuer entity
    store.remove("Issuer", issuerId);
  }

  const auditInformation = AuditInformation.load(issuerId);

  if (auditInformation != null) {
    // Delete the AuditInformation entity
    store.remove("AuditInformation", issuerId);
  }
}

function incrementPortalsCount(): void {
  let counter = Counter.load("counter");

  if (!counter) {
    counter = new Counter("counter");
  }

  if (!counter.portals) {
    counter.portals = 1;
  } else {
    counter.portals += 1;
  }

  counter.save();
}
