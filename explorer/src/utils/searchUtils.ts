import { COMMA_STRING, EMPTY_STRING, SPACE_STRING } from "@/constants";
import { convertSchemaRegex, regexEthAddress, schemaRegex, schemaStringRegex, urlRegex } from "@/constants/regex";
import { ResultParseSearch } from "@/interfaces/components";

const filterByRegex = (arr: string[], regex: RegExp): string[] => arr.filter((str) => regex.test(str));

const filterByNumber = (arr: string[]): string[] =>
  arr.filter((str) => {
    const number = Number(str);
    return !(Number.isNaN(number) || !Number.isSafeInteger(number));
  });

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

export const parseSearch = (search: string | null): Partial<ResultParseSearch> => {
  if (!search) return {};

  const splittedSearchBySpace = search.split(SPACE_STRING);

  const startsWith0x = filterByRegex(splittedSearchBySpace, regexEthAddress.by0x);
  const attestationIds = filterByNumber(startsWith0x);
  const startsWith0xWithoutNumber = startsWith0x.filter((str) => !attestationIds.includes(str));

  const defaultAddresses = filterByRegex(startsWith0xWithoutNumber, regexEthAddress.byNumberOfChar[42]);
  const longAddresses = filterByRegex(startsWith0xWithoutNumber, regexEthAddress.byNumberOfChar[64]);

  const urls = filterByRegex(splittedSearchBySpace, urlRegex);
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
