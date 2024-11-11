import BaseDataMapper from "./BaseDataMapper";
import { abiAttestationRegistry } from "../abi/AttestationRegistry";
import { decode, encode } from "../utils/abiCoder";
import { Hex } from "viem";
import { subgraphCall } from "../utils/graphClientHelper";

export default class UtilsDataMapper extends BaseDataMapper<object, unknown, unknown> {
  typeName = "counter";
  gqlInterface = `{
        attestations
        modules
        portals
        schemas
  }`;

  async getModulesNumber() {
    return await this.getCounterForType("module");
  }

  async getPortalsCount() {
    return await this.getCounterForType("portal");
  }

  async getSchemasNumber() {
    return await this.getCounterForType("schema");
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

  private async getCounterForType(type: string) {
    const query = `query get_${type}_counter { counters { ${type}s } }`;

    const { data, status } = await subgraphCall(query, this.conf.subgraphUrl);

    if (status != 200) {
      throw new Error(`Error(s) while fetching total count of ${type}s`);
    }

    return data?.data ? data.data["counters"][0][`${type}s`] : 0;
  }
}
