import BaseDataMapper from "./BaseDataMapper";
import { abiAttestationRegistry } from "../abi/AttestationRegistry";
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

  async getVersionNumber() {
    return this.web3Client.readContract({
      abi: abiAttestationRegistry,
      address: this.conf.attestationRegistryAddress,
      functionName: "getVersionNumber",
    });
  }

  encode(schema: string, values: unknown[]): Hex {
    return encode(schema, values);
  }

  decode(schema: string, attestationData: Hex): readonly unknown[] {
    return decode(schema, attestationData);
  }
}
