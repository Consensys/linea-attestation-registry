export const hexToUtf8 = (hex: string): string => {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const byteValues = cleanHex.match(/.{1,2}/g)?.map((hex) => parseInt(hex, 16));

  if (!byteValues) {
    throw new Error('Invalid hexadecimal input');
  }
  const byteArray = new Uint8Array(byteValues);
  const decodedString = new TextDecoder().decode(byteArray);
  return decodedString;
};

export const bigintToNumber = <T extends string | bigint>(inputValue: T): number => {
  return Number(inputValue.toString());
};
