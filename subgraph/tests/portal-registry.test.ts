import { afterEach, assert, beforeAll, clearStore, createMockedFunction, describe, test } from "matchstick-as";
import { Address, ethereum } from "@graphprotocol/graph-ts";
import {
  IssuerAdded as IssuerAddedEvent,
  IssuerRemoved as IssuerRemovedEvent,
  PortalRegistered as PortalRegisteredEvent,
  PortalRegistry,
} from "../generated/PortalRegistry/PortalRegistry";
import { newTypedMockEvent } from "matchstick-as/assembly/defaults";
import { handleIssuerAdded, handleIssuerRemoved, handlePortalRegistered } from "../src/portal-registry";

const portalRegistryAddress = Address.fromString("506f88a5Ca8D5F001f2909b029738A40042e42a6");
const portalAddress = Address.fromString("f75be6f9418710fd516fa82afb3aad07e11a0f1b");
const ownerAddress = Address.fromString("e75be6f9418710fd516fa82afb3aad07e11a0f1b");
const issuerAddress = "f75be6f9418710fd516fa82afb3aad07e11a0f1b";
const modules = [Address.zero()];
const isRevocable = true;
const name = "portal name";
const description = "portal description";
const ownerName = "Verax";

describe("handlePortalRegistered()", () => {
  beforeAll(() => {
    const tupleArray: Array<ethereum.Value> = [
      ethereum.Value.fromAddress(portalAddress),
      ethereum.Value.fromAddress(ownerAddress),
      ethereum.Value.fromAddressArray(modules),
      ethereum.Value.fromBoolean(isRevocable),
      ethereum.Value.fromString(name),
      ethereum.Value.fromString(description),
      ethereum.Value.fromString(ownerName),
    ];

    // Convert it to the Tuple type
    const tuple = changetype<ethereum.Tuple>(tupleArray);

    // Create a tuple Value
    const tupleValue = ethereum.Value.fromTuple(tuple);

    createMockedFunction(
      portalRegistryAddress,
      "getPortalByAddress",
      "getPortalByAddress(address):((address,address,address[],bool,string,string,string))",
    )
      .withArgs([ethereum.Value.fromAddress(Address.fromString("f75be6f9418710fd516fa82afb3aad07e11a0f1b"))])
      .returns([tupleValue]);
  });

  afterEach(() => {
    clearStore();
  });

  test("Should mock the call to the PortalRegistry", () => {
    const contract = PortalRegistry.bind(portalRegistryAddress);
    const result = contract.getPortalByAddress(portalAddress);

    assert.addressEquals(result.id, portalAddress);
    assert.addressEquals(result.ownerAddress, ownerAddress);
    assert.addressEquals(result.modules.at(0), modules.at(0));
    assert.booleanEquals(result.isRevocable, isRevocable);
    assert.stringEquals(result.name, name);
    assert.stringEquals(result.description, description);
    assert.stringEquals(result.ownerName, ownerName);
  });

  test("Should create a new Portal entity and audit data", () => {
    assert.entityCount("Portal", 0);

    const portalRegisteredEvent = createPortalRegisteredEvent(portalAddress, name, description);

    handlePortalRegistered(portalRegisteredEvent);

    assert.entityCount("Portal", 1);

    assert.fieldEquals("Portal", portalAddress.toHexString(), "id", portalAddress.toHexString());
    assert.fieldEquals("Portal", portalAddress.toHexString(), "name", name);
    assert.fieldEquals("Portal", portalAddress.toHexString(), "description", description);
    assert.fieldEquals("Portal", portalAddress.toHexString(), "attestationCounter", "0");

    assert.entityCount("AuditInformation", 1);
    assert.fieldEquals("AuditInformation", portalAddress.toHexString(), "id", portalAddress.toHexString());

    assert.entityCount("Audit", 1);
  });

  // TODO: test `handlePortalRevoked`

  test("Should increment the portals Counter", () => {
    assert.entityCount("Portal", 0);
    assert.entityCount("Counter", 0);

    const portalRegisteredEvent1 = createPortalRegisteredEvent(portalAddress, name, description);

    handlePortalRegistered(portalRegisteredEvent1);

    assert.entityCount("Portal", 1);
    assert.fieldEquals("Counter", "counter", "portals", "1");
  });
});

describe("handleIssuerAdded()", () => {
  afterEach(() => {
    clearStore();
  });

  test("Should create a new Issuer entity and audit data", () => {
    assert.entityCount("Issuer", 0);
    const issuerAddedEvent = newTypedMockEvent<IssuerAddedEvent>();
    issuerAddedEvent.address = portalRegistryAddress;
    issuerAddedEvent.parameters.push(
      new ethereum.EventParam("issuerAddress", ethereum.Value.fromAddress(Address.fromString(issuerAddress))),
    );

    handleIssuerAdded(issuerAddedEvent);

    assert.entityCount("Issuer", 1);
    assert.fieldEquals("Issuer", portalAddress.toHexString(), "id", "0x" + issuerAddress);

    assert.entityCount("AuditInformation", 1);
    assert.fieldEquals("AuditInformation", portalAddress.toHexString(), "id", portalAddress.toHexString());

    assert.entityCount("Audit", 1);
  });
});

describe("handleIssuerRemoved()", () => {
  afterEach(() => {
    clearStore();
  });

  test("Should remove the Issuer entity", () => {
    // Add a new issuer to be removed
    assert.entityCount("Issuer", 0);
    const issuerAddedEvent = newTypedMockEvent<IssuerAddedEvent>();
    issuerAddedEvent.address = portalRegistryAddress;
    issuerAddedEvent.parameters.push(
      new ethereum.EventParam("issuerAddress", ethereum.Value.fromAddress(Address.fromString(issuerAddress))),
    );
    handleIssuerAdded(issuerAddedEvent);
    assert.entityCount("Issuer", 1);

    const issuerRemovedEvent = newTypedMockEvent<IssuerRemovedEvent>();
    issuerRemovedEvent.address = portalRegistryAddress;
    issuerRemovedEvent.parameters.push(
      new ethereum.EventParam("issuerAddress", ethereum.Value.fromAddress(Address.fromString(issuerAddress))),
    );
    handleIssuerRemoved(issuerRemovedEvent);
    assert.entityCount("Issuer", 0);
  });
});

function createPortalRegisteredEvent(
  portalAddress: Address,
  portalName: string,
  portalDescription: string,
): PortalRegisteredEvent {
  const portalRegisteredEvent = newTypedMockEvent<PortalRegisteredEvent>();
  portalRegisteredEvent.address = portalRegistryAddress;

  portalRegisteredEvent.parameters.push(new ethereum.EventParam("name", ethereum.Value.fromString(portalName)));
  portalRegisteredEvent.parameters.push(
    new ethereum.EventParam("description", ethereum.Value.fromString(portalDescription)),
  );
  portalRegisteredEvent.parameters.push(
    new ethereum.EventParam("portalAddress", ethereum.Value.fromAddress(portalAddress)),
  );

  return portalRegisteredEvent;
}
