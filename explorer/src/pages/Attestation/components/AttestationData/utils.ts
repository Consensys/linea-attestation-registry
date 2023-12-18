export const getAttestationData = (decodedPayload: unknown): string => {
  return JSON.stringify(decodedPayload, (_key, value) => (typeof value === "bigint" ? value.toString() : value));
};
