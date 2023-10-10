import { decodeAbiParameters, encodeAbiParameters, parseAbiParameters } from "viem";

export function encode(schema: string, values: unknown[]): `0x${string}` {
  return encodeAbiParameters(parseAbiParameters(schema), values);
}

export function decode(schema: string, attestationData: `0x${string}`): readonly unknown[] {
  return decodeAbiParameters(parseAbiParameters(schema), attestationData);
}
