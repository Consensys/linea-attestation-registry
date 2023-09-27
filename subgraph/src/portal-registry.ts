import { Bytes } from "@graphprotocol/graph-ts";
import { PortalRegistered as PortalRegisteredEvent, PortalRegistry } from "../generated/PortalRegistry/PortalRegistry";
import { Portal } from "../generated/schema";

export function handlePortalRegistered(event: PortalRegisteredEvent): void {
  const contract = PortalRegistry.bind(event.address);
  const portalData = contract.getPortalByAddress(event.params.portalAddress);
  const portal = new Portal(event.params.portalAddress.toHex());

  portal.ownerAddress = portalData.ownerAddress;
  portal.modules = changetype<Bytes[]>(portalData.modules);
  portal.isRevocable = portalData.isRevocable;
  portal.name = portalData.name;
  portal.description = portalData.description;
  portal.ownerName = portalData.ownerName;

  portal.save();
}
