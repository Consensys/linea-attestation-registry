import { parseAbiParameters } from 'abitype';

type ArrayComponent = { type: string; components: ArrayComponent[] };
type MergeArraysType = { [key: string]: string | boolean | MergeArraysType };

const mergeArrays = (array1: ArrayComponent[], array2: unknown[]): MergeArraysType => {
  const result: MergeArraysType = {};

  array1.forEach((item, index) => {
    const value = array2[index];
    if (Array.isArray(value)) {
      result[item.type] = mergeArrays(item.components, value);
    } else {
      result[item.type] = value as string;
    }
  });
  return result;
};

export const getAttestationData = (schemaString: string, decodedData: unknown[]) => {
  try {
    const parsedSchema = parseAbiParameters(schemaString);
    if (parsedSchema.length !== decodedData.length) return null;
    return mergeArrays([...parsedSchema] as ArrayComponent[], decodedData);
  } catch (error) {
    return null;
  }
};
