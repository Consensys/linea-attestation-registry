import { Hex } from "viem";

import { COMMA_STRING, EMPTY_STRING, SPACE_STRING } from "@/constants";
import {
  convertSchemaRegex,
  isNumber,
  regexEthAddress,
  schemaRegex,
  schemaStringRegex,
  urlRegex,
} from "@/constants/regex";
import { ResultParseSearch } from "@/interfaces/components";
import { buildAttestationId } from "@/utils/attestationIdUtils.ts";

const filterByRegex = (arr: string[], regex: RegExp): string[] => arr.filter((str) => regex.test(str));

const extractSchema = (search: string) => {
  const matchingSchema = search.match(schemaRegex);
  const matchingSchemaString = search.match(schemaStringRegex);

  if (matchingSchema && !matchingSchemaString) {
    const schema = matchingSchema.join(COMMA_STRING);
    return {
      schema,
      schemaString: schema.match(convertSchemaRegex)?.join(COMMA_STRING),
    };
  }
  return {
    schema: matchingSchema?.join(COMMA_STRING),
    schemaString: matchingSchemaString?.[0],
  };
};

const removeSubstringFromArray = (inputString: string, substringsToRemove: Array<string>): string => {
  const regex = new RegExp(substringsToRemove.map((item) => `\\b${item}\\b`).join("|"), "g");
  return inputString.replace(regex, EMPTY_STRING).trim();
};

export const parseSearch = (search: string | null, chainPrefix: Hex): Partial<ResultParseSearch> => {
  if (!search) return {};

  const splitSearchBySpace = search.split(SPACE_STRING);

  const startsWith0x = filterByRegex(splitSearchBySpace, regexEthAddress.by0x);
  const potentialAttestationIds = filterByRegex(startsWith0x, regexEthAddress.byNumberOfChar[64]);
  const rawNumbers = filterByRegex(splitSearchBySpace, isNumber);
  const hexNumbers = rawNumbers.map((num) => buildAttestationId(Number(num), chainPrefix));
  const attestationIds = [...potentialAttestationIds, ...hexNumbers];

  const defaultAddresses = filterByRegex(startsWith0x, regexEthAddress.byNumberOfChar[42]);
  const longAddresses = filterByRegex(startsWith0x, regexEthAddress.byNumberOfChar[64]);

  const urls = filterByRegex(splitSearchBySpace, urlRegex);
  const allStrings = [...urls, ...defaultAddresses, ...longAddresses, ...attestationIds];
  const searchWithoutUrlsAddressIds = removeSubstringFromArray(search, allStrings);

  const { schema, schemaString } = extractSchema(searchWithoutUrlsAddressIds);
  const searchWithoutSchema =
    schema || schemaString
      ? searchWithoutUrlsAddressIds.replace((schema || schemaString) as string, EMPTY_STRING)
      : searchWithoutUrlsAddressIds;

  return {
    //todo decodedData and attestationData
    address: defaultAddresses.length ? defaultAddresses : undefined,
    attestationIds: attestationIds.length ? attestationIds : undefined,
    schemasIds: longAddresses.length ? longAddresses : undefined,
    nameOrDescription: searchWithoutSchema ? searchWithoutSchema.trimStart() : undefined,
    urls: urls.length ? urls : undefined,
    schema,
    schemaString,
  };
};

export const uniqMap = <T>(array: T[], by: keyof T): T[] => [
  ...new Map(array.map((result) => [result[by], result])).values(),
];
