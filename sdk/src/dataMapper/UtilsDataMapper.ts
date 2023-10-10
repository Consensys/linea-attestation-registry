import BaseDataMapper from "./BaseDataMapper";
import { abiAttestationRegistry } from "../abi/AttestationRegistry";
import { abiModuleRegistry } from "../abi/ModuleRegistry";
import { abiPortalRegistry } from "../abi/PortalRegistry";
import { abiSchemaRegistry } from "../abi/SchemaRegistry";
import { decode, encode } from "../utils/abiCoder";

export default class UtilsDataMapper extends BaseDataMapper {
  typeName = "counter";
  gqlInterface = `{
        attestations
        modules
        portals
        schemas
  }`;

  async getModulesNumber() {
    return await this.web3Client.readContract({
      abi: abiModuleRegistry,
      address: this.conf.moduleRegistryAddress,
      functionName: "getModulesNumber",
    });
  }

  async getPortalsCount() {
    return await this.web3Client.readContract({
      abi: abiPortalRegistry,
      address: this.conf.portalRegistryAddress,
      functionName: "getPortalsCount",
    });
  }

  async getSchemasNumber() {
    return await this.web3Client.readContract({
      abi: abiSchemaRegistry,
      address: this.conf.schemaRegistryAddress,
      functionName: "getSchemasNumber",
    });
  }

  async getVersionNumber() {
    return await this.web3Client.readContract({
      abi: abiAttestationRegistry,
      address: this.conf.attestationRegistryAddress,
      functionName: "getVersionNumber",
    });
  }

  async getAttestationIdCounter() {
    return await this.web3Client.readContract({
      abi: abiAttestationRegistry,
      address: this.conf.attestationRegistryAddress,
      functionName: "getAttestationIdCounter",
    });
  }

  encode(schema: string, values: unknown[]): `0x${string}` {
    return encode(schema, values);
  }

  decode(schema: string, attestationData: `0x${string}`): readonly unknown[] {
    return decode(schema, attestationData);
  }
}
