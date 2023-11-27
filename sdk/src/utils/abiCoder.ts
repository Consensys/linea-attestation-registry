import { decodeAbiParameters, encodeAbiParameters, parseAbiParameters } from "viem";

export function encode(schema: string, values: unknown[]): `0x${string}` {
  return encodeAbiParameters(parseAbiParameters(schema), values);
}

export function decode(schema: string, attestationData: `0x${string}`): readonly unknown[] {
  return decodeAbiParameters(parseAbiParameters(schema), attestationData);
}

export function decodeWithRetry(schema: string, attestationData: `0x${string}`): readonly unknown[] {
  try {
    return decodeAbiParameters(parseAbiParameters(schema), attestationData);
  } catch (e) {
    try {
      return decodeAbiParameters(parseAbiParameters(`(${schema})`), attestationData);
    } catch (e) {
      return [];
    }
  }
}
