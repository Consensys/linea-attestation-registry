/**
 * Verax SDK - Main Entry Point
 *
 * An SDK for interacting with Verax Attestation Registry
 * Compatible with ESM, CJS, Browser, and Node.js environments
 */

// Main SDK class
export { VeraxSdk } from "./VeraxSdk";

// Data Mappers (for advanced usage)
export { default as AttestationDataMapper } from "./dataMapper/AttestationDataMapper";
export { default as SchemaDataMapper } from "./dataMapper/SchemaDataMapper";
export { default as ModuleDataMapper } from "./dataMapper/ModuleDataMapper";
export { default as PortalDataMapper } from "./dataMapper/PortalDataMapper";
export { default as UtilsDataMapper } from "./dataMapper/UtilsDataMapper";

// Types
export * from "./types";

// Constants
export * from "./utils/constants";

// Utilities (for advanced usage)
export { encode, decodeWithRetry } from "./utils/abiCoder";
export { handleError } from "./utils/errorHandler";
export type { IPFSConfig } from "./types";
