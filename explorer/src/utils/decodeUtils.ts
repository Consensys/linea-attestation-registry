export const bigintToNumber = <T extends string | bigint>(inputValue: T): number => {
  return Number(inputValue.toString());
};
