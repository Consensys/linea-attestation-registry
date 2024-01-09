export const getAttestationData = (decodedPayload: unknown): string => {
  decodedPayload = Array.isArray(decodedPayload) && decodedPayload.length === 1 ? decodedPayload[0] : decodedPayload;
  return JSON.stringify(decodedPayload, (_key, value) => (typeof value === "bigint" ? value.toString() : value));
};

export const isDecodedData = (decodedPayload?: unknown, decodedData?: Array<string>): boolean => {
  if (Array.isArray(decodedPayload) && !decodedPayload.length) return false;
  if (!decodedData?.length) return false;
  if (decodedData.length === 1 && decodedData[0] === "NOT DECODED") return false;
  return Boolean(decodedPayload || decodedData);
};
