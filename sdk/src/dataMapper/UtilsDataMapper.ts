import BaseDataMapper from "./BaseDataMapper";
import { abiAttestationRegistry } from "../abi/AttestationRegistry";
import { abiModuleRegistry } from "../abi/ModuleRegistry";
import { abiPortalRegistry } from "../abi/PortalRegistry";
import { abiSchemaRegistry } from "../abi/SchemaRegistry";
import { decode, encode } from "../utils/abiCoder";
import { Hex } from "viem";

export default class UtilsDataMapper extends BaseDataMapper<object, unknown, unknown> {
  typeName = "counter";
  gqlInterface = `{
        attestations
        modules
        portals
        schemas
  }`;

  async getModulesNumber() {
    return this.web3Client.readContract({
      abi: abiModuleRegistry,
      address: this.conf.moduleRegistryAddress,
      functionName: "getModulesNumber",
    });
  }

  async getPortalsCount() {
    return this.web3Client.readContract({
      abi: abiPortalRegistry,
      address: this.conf.portalRegistryAddress,
      functionName: "getPortalsCount",
    });
  }

  async getSchemasNumber() {
    return this.web3Client.readContract({
      abi: abiSchemaRegistry,
      address: this.conf.schemaRegistryAddress,
      functionName: "getSchemasNumber",
    });
  }

  async getVersionNumber() {
    return this.web3Client.readContract({
      abi: abiAttestationRegistry,
      address: this.conf.attestationRegistryAddress,
      functionName: "getVersionNumber",
    });
  }

  async getAttestationIdCounter() {
    return this.web3Client.readContract({
      abi: abiAttestationRegistry,
      address: this.conf.attestationRegistryAddress,
      functionName: "getAttestationIdCounter",
    });
  }

  encode(schema: string, values: unknown[]): Hex {
    return encode(schema, values);
  }

  decode(schema: string, attestationData: Hex): readonly unknown[] {
    return decode(schema, attestationData);
  }
}
