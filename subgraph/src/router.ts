import { RouterSet as SchemaRegistryRouterSetEvent } from "../generated/SchemaRegistry/SchemaRegistry";
import { RouterSet as ModuleRegistryRouterSetEvent } from "../generated/ModuleRegistry/ModuleRegistry";
import { RouterSet as AttestationRegistryRouterSetEvent } from "../generated/AttestationRegistry/AttestationRegistry";
import { RouterSet as AttestationReaderRouterSetEvent } from "../generated/AttestationReader/AttestationReader";
import { RegistryVersion } from "../generated/schema";

export function handleSchemaRegistryRouterSet(event: SchemaRegistryRouterSetEvent): void {
  handleRouterSet(event);
}

export function handleModuleRegistryRouterSet(event: ModuleRegistryRouterSetEvent): void {
  handleRouterSet(event);
}

export function handleAttestationRegistryRouterSet(event: AttestationRegistryRouterSetEvent): void {
  handleRouterSet(event);
}

export function handleAttestationReaderRouterSet(event: AttestationReaderRouterSetEvent): void {
  handleRouterSet(event);
}

// Common handler function for router set events
function handleRouterSet(
  event:
    | SchemaRegistryRouterSetEvent
    | ModuleRegistryRouterSetEvent
    | AttestationRegistryRouterSetEvent
    | AttestationReaderRouterSetEvent,
): void {
  // Create a new RegistryVersion entity to track the router update
  const id = event.transaction.hash.toHexString().toLowerCase();
  const version = new RegistryVersion(id);

  // Determine registry type based on contract name
  let registryType = "Unknown";
  if (event instanceof SchemaRegistryRouterSetEvent) {
    registryType = "SchemaRegistry";
  } else if (event instanceof ModuleRegistryRouterSetEvent) {
    registryType = "ModuleRegistry";
  } else if (event instanceof AttestationRegistryRouterSetEvent) {
    registryType = "AttestationRegistry";
  } else if (event instanceof AttestationReaderRouterSetEvent) {
    registryType = "AttestationReader";
  }

  version.versionNumber = 1; // Initial version
  version.timestamp = event.block.timestamp;
  version.registryType = registryType;
  version.registryAddress = event.address;
  version.routerAddress = event.params.router;
  version.save();
}
