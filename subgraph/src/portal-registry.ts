import { Bytes } from "@graphprotocol/graph-ts";
import { PortalRegistered as PortalRegisteredEvent, PortalRegistry } from "../generated/PortalRegistry/PortalRegistry";
import { Counter, Portal } from "../generated/schema";

export function handlePortalRegistered(event: PortalRegisteredEvent): void {
  const contract = PortalRegistry.bind(event.address);
  const portalData = contract.getPortalByAddress(event.params.portalAddress);
  const portal = new Portal(event.params.portalAddress.toHex());

  incrementPortalsCount();

  portal.ownerAddress = portalData.ownerAddress;
  portal.modules = changetype<Bytes[]>(portalData.modules);
  portal.isRevocable = portalData.isRevocable;
  portal.name = portalData.name;
  portal.description = portalData.description;
  portal.ownerName = portalData.ownerName;

  portal.save();
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
