export const getAttestationData = (decodedPayload: unknown): string | null => {
  if (!decodedPayload) return null;

  const payload = Array.isArray(decodedPayload) && decodedPayload.length === 1 ? decodedPayload[0] : decodedPayload;

  if (payload === "NOT DECODED") return null;

  return JSON.stringify(payload, (_, value) => (typeof value === "bigint" ? value.toString() : value));
};
