import { Hex } from "viem";
import { numberToHex } from "viem/utils";

export const buildAttestationId = (rawNumberId: number, chainPrefix: Hex): Hex => {
  const rawId = numberToHex(rawNumberId, { size: 32 });
  const idWithoutPrefix = rawId.slice(6);
  return `${chainPrefix}${idWithoutPrefix}`;
};
