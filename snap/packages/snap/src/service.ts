import { fetchAttestations, getPortal, getSchema } from './api';
import type { Attestation } from './types';

/**
 * Get attestations for an address.
 * @param chainId - The chain ID.
 * @param address - The address to get attestations for.
 * @returns The attestations for the address.
 */
export async function getAttestationsForAddress(
  chainId: string,
  address: string,
) {
  const rawAttestations = await fetchAttestations(chainId, address);

  return await Promise.all(
    rawAttestations.map(async (a) => {
      const portal = await getPortal(chainId, a.portal);
      const schema = await getSchema(chainId, a.schemaId);

      return {
        id: a.id,
        from: portal.ownerName,
        attestationDate: parseInt(a.attestedDate, 10) * 1000,
        expiryDate: parseInt(a.expirationDate, 10) * 1000,
        content: schema.name,
      } as Attestation;
    }),
  );
}
