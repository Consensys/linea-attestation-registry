import { EMPTY_STRING } from "@/constants";

export const cropString = (query: string, step = 4, headFromIndex = 0) => {
  if (!query) return EMPTY_STRING;

  if (query.length > 20) {
    const head = query.substring(headFromIndex, step + 2);
    const tail = query.substring(query.length - step, query.length);

    return `${head}…${tail}`;
  }
  return query;
};

export const removeCommas = (str: string) => str.replace(/,/g, "");
