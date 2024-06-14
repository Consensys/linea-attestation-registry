import { AbiParameter, BaseError, decodeAbiParameters, encodeAbiParameters, Hex, parseAbiParameters } from "viem";

const ENCODED_PARENTHESIS: Hex = "0x0000000000000000000000000000000000000000000000000000000000000020";

export function encode(schema: string, values: unknown[]): Hex {
  return encodeAbiParameters(parseAbiParameters(schema), values);
}

export function decode(schema: string, attestationData: Hex): readonly unknown[] {
  return decodeAbiParameters(parseAbiParameters(schema), attestationData);
}

export function decodeWithRetry(schema: string, attestationData: Hex): readonly unknown[] {
  const wrappedSchema = schema.startsWith("(") ? schema : `(${schema})`;
  let result = decodeWrapped(wrappedSchema, attestationData);

  if (!result.length && !attestationData.startsWith(ENCODED_PARENTHESIS)) {
    result = decodeWrapped(wrappedSchema, `${ENCODED_PARENTHESIS}${attestationData.substring(2)}`);
  }

  return result;
}

function decodeWrapped(schema: string, attestationData: Hex): readonly unknown[] {
  try {
    const parsedParams = tryParse(schema);
    return decodeAbiParameters(parsedParams, attestationData);
  } catch (e) {
    return [];
  }
}

function tryParse(schema: string): readonly AbiParameter[] {
  try {
    return parseAbiParameters(schema);
  } catch (e) {
    if ((e as BaseError).shortMessage === "Invalid ABI parameter.") {
      try {
        return parseAbiParameters(reverseSchema(schema));
      } catch (e) {
        return [];
      }
    }
    return [];
  }
}

function reverseSchema(schema: string): string {
  return schema.startsWith("(")
    ? `(${reverseWordsTwoByTwo(schema.substring(1, schema.length - 1))})`
    : reverseWordsTwoByTwo(schema);
}

function reverseWordsTwoByTwo(schema: string): string {
  return schema
    .split(" ")
    .reduce((acc: string[], word: string, i: number) => {
      if (i % 2 === 0) {
        acc.push(word);
      } else {
        acc.unshift(word);
      }
      return acc;
    }, [])
    .join(" ");
}
