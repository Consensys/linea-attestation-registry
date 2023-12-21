import { afterEach, assert, clearStore, describe, test } from "matchstick-as";
import {
  ModuleRegistered as ModuleRegisteredEvent,
  ModuleRegistered,
} from "../generated/ModuleRegistry/ModuleRegistry";
import { Address, ethereum } from "@graphprotocol/graph-ts";
import { newTypedMockEvent } from "matchstick-as/assembly/defaults";
import { handleModuleRegistered } from "../src/module-registry";

describe("handleModuleRegistered()", () => {
  const moduleAddress = "f75be6f9418710fd516fa82afb3aad07e11a0f1b";
  const moduleName = "module name";
  const moduleDescription = "module description";

  afterEach(() => {
    clearStore();
  });

  test("Should create a new Module entity and audit data", () => {
    assert.entityCount("Module", 0);

    const moduleRegisteredEvent = createModuleRegisteredEvent(moduleAddress, moduleName, moduleDescription);

    handleModuleRegistered(moduleRegisteredEvent);

    assert.entityCount("Module", 1);

    assert.fieldEquals("Module", "0x" + moduleAddress, "id", "0x" + moduleAddress);
    assert.fieldEquals("Module", "0x" + moduleAddress, "name", moduleName);
    assert.fieldEquals("Module", "0x" + moduleAddress, "description", moduleDescription);
    assert.fieldEquals("Module", "0x" + moduleAddress, "moduleAddress", "0x" + moduleAddress);

    assert.entityCount("AuditInformation", 1);
    assert.fieldEquals("AuditInformation", "0x" + moduleAddress, "id", "0x" + moduleAddress);

    assert.entityCount("Audit", 1);
  });

  test("Should increment the modules Counter", () => {
    assert.entityCount("Module", 0);

    const moduleAddress1 = "f75be6f9418710fd516fa82afb3aad07e11a0f1b";
    const moduleAddress2 = "e75be6f9418710fd516fa82afb3aad07e11a0f1b";

    const moduleRegisteredEvent1 = createModuleRegisteredEvent(moduleAddress1, moduleName, moduleDescription);

    handleModuleRegistered(moduleRegisteredEvent1);

    assert.entityCount("Module", 1);
    assert.fieldEquals("Counter", "counter", "modules", "1");

    const moduleRegisteredEvent2 = createModuleRegisteredEvent(moduleAddress2, moduleName, moduleDescription);

    handleModuleRegistered(moduleRegisteredEvent2);

    assert.entityCount("Module", 2);
    assert.fieldEquals("Counter", "counter", "modules", "2");
  });
});

function createModuleRegisteredEvent(
  moduleAddress: string,
  moduleName: string,
  moduleDescription: string,
): ModuleRegistered {
  const moduleRegisteredEvent = newTypedMockEvent<ModuleRegisteredEvent>();

  moduleRegisteredEvent.parameters.push(new ethereum.EventParam("name", ethereum.Value.fromString(moduleName)));
  moduleRegisteredEvent.parameters.push(
    new ethereum.EventParam("description", ethereum.Value.fromString(moduleDescription)),
  );
  moduleRegisteredEvent.parameters.push(
    new ethereum.EventParam("moduleAddress", ethereum.Value.fromAddress(Address.fromString(moduleAddress))),
  );

  return moduleRegisteredEvent;
}
